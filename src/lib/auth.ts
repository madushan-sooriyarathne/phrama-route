import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "#/db/index.ts";
import { account, session, user, verification } from "#/db/schema/auth.ts";
import { env } from "#/env";

export const auth = betterAuth({
	trustedOrigins: env.SERVER_URL ? [env.SERVER_URL] : [],
	database: drizzleAdapter(db, {
		provider: "pg",
		schema: { user, session, account, verification },
	}),
	emailAndPassword: {
		enabled: true,
	},
	user: {
		additionalFields: {
			role: {
				type: "string",
				required: false,
				defaultValue: "rep",
				input: false,
			},
		},
	},
});
