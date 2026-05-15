import type { TRPCRouterRecord } from "@trpc/server";
import { and, count, desc, eq, gte, lt } from "drizzle-orm";
import { db } from "#/db";
import { orders, repRoutes, routePharmacies } from "#/db/schema";
import { protectedProcedure } from "../init";

export const dashboardRouter = {
	getSummary: protectedProcedure.query(async ({ ctx }) => {
		const repId = ctx.session.user.id;

		const todayStart = new Date();
		todayStart.setHours(0, 0, 0, 0);
		const tomorrowStart = new Date(todayStart);
		tomorrowStart.setDate(tomorrowStart.getDate() + 1);

		const firstRepRoute = await db.query.repRoutes.findFirst({
			where: eq(repRoutes.repId, repId),
			with: { route: true },
		});

		const todayOrders = await db.query.orders.findMany({
			where: and(
				eq(orders.repId, repId),
				gte(orders.createdAt, todayStart),
				lt(orders.createdAt, tomorrowStart),
			),
			columns: { pharmacyId: true, totalAmount: true },
		});

		const visitedPharmacyIds = new Set(todayOrders.map((o) => o.pharmacyId));
		const totalSales = todayOrders.reduce(
			(acc, o) => acc + Number(o.totalAmount),
			0,
		);

		let totalPharmacies = 0;
		if (firstRepRoute) {
			const [result] = await db
				.select({ value: count() })
				.from(routePharmacies)
				.where(eq(routePharmacies.routeId, firstRepRoute.routeId));
			totalPharmacies = result?.value ?? 0;
		}

		return {
			routeName: firstRepRoute?.route.routeName ?? null,
			pharmaciesVisited: visitedPharmacyIds.size,
			totalPharmacies,
			totalSales,
		};
	}),

	getRecentOrders: protectedProcedure.query(async ({ ctx }) => {
		const repId = ctx.session.user.id;

		const recentOrders = await db.query.orders.findMany({
			where: eq(orders.repId, repId),
			with: { pharmacy: true },
			orderBy: [desc(orders.createdAt)],
			limit: 3,
		});

		return recentOrders.map((order) => ({
			id: order.id,
			pharmacyName: order.pharmacy.name,
			amount: Number(order.totalAmount),
			createdAt: order.createdAt.toISOString(),
			status: order.status,
		}));
	}),
} satisfies TRPCRouterRecord;
