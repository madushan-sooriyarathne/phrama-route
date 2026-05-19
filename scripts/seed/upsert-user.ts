import { eq } from "drizzle-orm";
import { db } from "#/db/index.ts";
import { user } from "#/db/schema/auth.ts";
import { auth } from "#/lib/auth.ts";

type Role = "super_admin" | "admin" | "rep";

type UpsertInput = {
	name: string;
	email: string;
	role: Role;
	password: string;
};

const USER_ALREADY_EXISTS_CODE = "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL";

const signUpViaBetterAuth = async (
	input: Pick<UpsertInput, "name" | "email" | "password">,
): Promise<{ id: string } | { exists: true } | { error: string }> => {
	try {
		const result = await auth.api.signUpEmail({
			body: { name: input.name, email: input.email, password: input.password },
		});
		return { id: result.user.id };
	} catch (err) {
		const message = err instanceof Error ? err.message : String(err);
		if (message.includes(USER_ALREADY_EXISTS_CODE)) {
			return { exists: true };
		}
		return { error: `signUp ${input.email}: ${message}` };
	}
};

const signInToRecoverId = async (
	input: Pick<UpsertInput, "email" | "password">,
): Promise<string> => {
	const result = await auth.api.signInEmail({
		body: { email: input.email, password: input.password },
	});
	if (result?.user?.id) return result.user.id;
	throw new Error(`signIn fallback failed for ${input.email}`);
};

const mirrorRoleInPublicUser = async (
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
	input: Pick<UpsertInput, "email" | "password">,
): Promise<string> => {
	const result = await signUpViaBetterAuth({
		name: input.email,
		email: input.email,
		password: input.password,
	});
	if ("id" in result) return result.id;
	if ("exists" in result) return signInToRecoverId(input);
	throw new Error(result.error);
};

export const upsertUser = async (input: UpsertInput): Promise<string> => {
	const existing = await db
		.select({ id: user.id })
		.from(user)
		.where(eq(user.email, input.email))
		.limit(1);

	if (existing.length > 0) {
		await mirrorRoleInPublicUser(existing[0].id, input);
		return existing[0].id;
	}

	const signUpResult = await signUpViaBetterAuth(input);
	const authId =
		"id" in signUpResult
			? signUpResult.id
			: "exists" in signUpResult
				? await fetchAuthIdByEmail(input)
				: (() => {
						throw new Error(signUpResult.error);
					})();

	await mirrorRoleInPublicUser(authId, input);
	return authId;
};
