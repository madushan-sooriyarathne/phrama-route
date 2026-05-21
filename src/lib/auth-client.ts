import { createAuthClient } from "better-auth/react";
import { env } from "#/env";

export const authClient = createAuthClient({
	baseURL:
		typeof window !== "undefined"
			? window.location.origin
			: env.VITE_BETTER_AUTH_URL,
});
