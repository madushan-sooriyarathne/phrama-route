import type { inferAsyncReturnType } from "@trpc/server";
import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { verifySession } from "#/lib/auth";
import { isAdmin } from "#/lib/role";

export async function createTRPCContext({ req }: { req: Request }) {
	const session = await verifySession(req.headers).catch(() => null);
	return { session };
}

type TRPCContext = inferAsyncReturnType<typeof createTRPCContext>;

const t = initTRPC.context<TRPCContext>().create({
	transformer: superjson,
});

export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
	if (!ctx.session?.user) {
		throw new TRPCError({ code: "UNAUTHORIZED" });
	}
	return next({ ctx: { ...ctx, session: ctx.session } });
});

export const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
	const role = (ctx.session.user as { role?: string }).role;
	if (!isAdmin(role)) {
		throw new TRPCError({ code: "FORBIDDEN" });
	}
	return next({ ctx });
});
