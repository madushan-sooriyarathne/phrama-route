import { authClient } from "./auth-client";

export const verifySession = async (headers: Headers) => {
	const authHeader = headers.get("authorization");

	const forwarded = new Headers();
	if (authHeader) forwarded.set("authorization", authHeader);

	const { data, error } = await authClient.getSession({
		fetchOptions: {
			headers: forwarded,
		},
	});

	if (error) {
		throw new Error(error.message || "Failed to verify session");
	}

	return data;
};
