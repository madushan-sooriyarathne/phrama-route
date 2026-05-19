import { auth } from "./auth.ts";

export const verifySession = async (headers: Headers) => {
	const session = await auth.api.getSession({ headers });
	return session;
};
