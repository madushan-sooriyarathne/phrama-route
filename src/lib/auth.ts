import { authClient } from "./auth-client";

export const verifySession = async (headers: Headers) => {
	const { data, error } = await authClient.getSession({
		fetchOptions: {
			headers,
		},
	});

	if (error) {
		throw new Error(error.message || "Failed to verify session");
	}

	return data;
};
