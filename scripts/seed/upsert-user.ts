import { eq } from "drizzle-orm";
import { db } from "#/db/index.ts";
import { user } from "#/db/schema/auth.ts";

type Role = "super_admin" | "admin" | "rep";

type UpsertInput = {
	name: string;
	email: string;
	role: Role;
	password: string;
	authBaseUrl: string;
};

type AuthResponseBody = {
	user?: { id: string };
	message?: string;
	code?: string;
};

const USER_EXISTS_CODE = "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL";

const buildOrigin = (baseUrl: string) => new URL(baseUrl).origin;

const postAuth = async (
	baseUrl: string,
	path: string,
	body: Record<string, string>,
): Promise<{ status: number; body: AuthResponseBody }> => {
	const response = await fetch(`${baseUrl}${path}`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Origin: buildOrigin(baseUrl),
		},
		body: JSON.stringify(body),
	});
	const parsed = (await response.json().catch(() => ({}))) as AuthResponseBody;
	return { status: response.status, body: parsed };
};

const signUpViaNeonAuth = async (
	baseUrl: string,
	input: Pick<UpsertInput, "name" | "email" | "password">,
): Promise<{ id: string } | { exists: true } | { error: string }> => {
	const { status, body } = await postAuth(baseUrl, "/sign-up/email", {
		email: input.email,
		password: input.password,
		name: input.name,
	});
	if (status >= 200 && status < 300 && body.user?.id)
		return { id: body.user.id };
	if (body.code === USER_EXISTS_CODE) return { exists: true };
	return {
		error:
			`signUp ${input.email}: ${status} ${body.message ?? ""} ${body.code ?? ""}`.trim(),
	};
};

const signInToRecoverId = async (
	baseUrl: string,
	input: Pick<UpsertInput, "email" | "password">,
): Promise<string> => {
	const { status, body } = await postAuth(baseUrl, "/sign-in/email", {
		email: input.email,
		password: input.password,
	});
	if (status >= 200 && status < 300 && body.user?.id) return body.user.id;
	throw new Error(
		`signIn fallback failed for ${input.email}: ${status} ${body.message ?? ""} ${body.code ?? ""}`.trim(),
	);
};

const mirrorLocalUser = async (
	id: string,
	input: Pick<UpsertInput, "name" | "email" | "role">,
): Promise<void> => {
	const now = new Date();
	await db
		.insert(user)
		.values({
			id,
			name: input.name,
			email: input.email,
			emailVerified: true,
			role: input.role,
			createdAt: now,
			updatedAt: now,
		})
		.onConflictDoUpdate({
			target: user.id,
			set: {
				name: input.name,
				email: input.email,
				role: input.role,
				updatedAt: now,
			},
		});
};

const fetchAuthIdByEmail = async (
	baseUrl: string,
	input: Pick<UpsertInput, "email" | "password">,
): Promise<string> => {
	const result = await signUpViaNeonAuth(baseUrl, {
		name: input.email,
		email: input.email,
		password: input.password,
	});
	if ("id" in result) return result.id;
	if ("exists" in result) return signInToRecoverId(baseUrl, input);
	throw new Error(result.error);
};

export const upsertUser = async (input: UpsertInput): Promise<string> => {
	const baseUrl = input.authBaseUrl.replace(/\/+$/, "");

	const existing = await db
		.select({ id: user.id })
		.from(user)
		.where(eq(user.email, input.email))
		.limit(1);

	if (existing.length > 0) {
		await mirrorLocalUser(existing[0].id, input);
		return existing[0].id;
	}

	const signUpResult = await signUpViaNeonAuth(baseUrl, input);
	const authId =
		"id" in signUpResult
			? signUpResult.id
			: "exists" in signUpResult
				? await fetchAuthIdByEmail(baseUrl, input)
				: (() => {
						throw new Error(signUpResult.error);
					})();

	await mirrorLocalUser(authId, input);
	return authId;
};
