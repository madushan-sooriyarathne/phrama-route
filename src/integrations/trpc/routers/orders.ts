import * as Sentry from "@sentry/tanstackstart-react";
import { TRPCError, type TRPCRouterRecord } from "@trpc/server";
import { and, desc, eq, lt, or } from "drizzle-orm";
import { z } from "zod";
import { db } from "#/db";
import {
	medicines,
	orderItems,
	orders,
	pharmacies,
	repMedicines,
	repRoutes,
	routePharmacies,
	routes,
} from "#/db/schema";
import { isAdmin } from "#/lib/role";
import { protectedProcedure } from "../init";

const LIST_LIMIT = 15;

export const ordersRouter = {
	list: protectedProcedure
		.input(
			z.object({
				cursor: z
					.object({
						createdAt: z.string(),
						id: z.string(),
					})
					.optional(),
				limit: z.number().min(1).max(50).default(LIST_LIMIT),
			}),
		)
		.query(async ({ ctx, input }) => {
			return Sentry.startSpan({ name: "orders.list" }, async () => {
				const repId = ctx.session.user.id;
				const { cursor, limit } = input;

				const cursorDate = cursor ? new Date(cursor.createdAt) : undefined;
				const cursorId = cursor?.id;

				const rows = await db.query.orders.findMany({
					where: and(
						eq(orders.repId, repId),
						cursorDate && cursorId
							? or(
									lt(orders.createdAt, cursorDate),
									and(
										eq(orders.createdAt, cursorDate),
										lt(orders.id, cursorId),
									),
								)
							: undefined,
					),
					with: { pharmacy: true },
					orderBy: [desc(orders.createdAt), desc(orders.id)],
					limit: limit + 1,
				});

				const hasNextPage = rows.length > limit;
				const items = hasNextPage ? rows.slice(0, limit) : rows;

				const lastItem = items.at(-1);
				const nextCursor =
					hasNextPage && lastItem
						? {
								createdAt: lastItem.createdAt.toISOString(),
								id: lastItem.id,
							}
						: null;

				return {
					items: items.map((order) => ({
						id: order.id,
						displayId: deriveDisplayId(order.id),
						pharmacyName: order.pharmacy.name,
						totalAmount: Number(order.totalAmount),
						createdAt: order.createdAt.toISOString(),
						status: order.status,
					})),
					nextCursor,
				};
			});
		}),

	getAssignedRoutes: protectedProcedure.query(async ({ ctx }) => {
		return Sentry.startSpan({ name: "orders.getAssignedRoutes" }, async () => {
			const repId = ctx.session.user.id;

			const rows = await db
				.select({ id: routes.id, routeName: routes.routeName })
				.from(repRoutes)
				.innerJoin(routes, eq(repRoutes.routeId, routes.id))
				.where(eq(repRoutes.repId, repId));

			return rows;
		});
	}),

	getPharmaciesForRoute: protectedProcedure
		.input(z.object({ routeId: z.string().min(1) }))
		.query(async ({ input }) => {
			return Sentry.startSpan(
				{ name: "orders.getPharmaciesForRoute" },
				async () => {
					const rows = await db
						.select({
							id: pharmacies.id,
							name: pharmacies.name,
							address: pharmacies.address,
						})
						.from(routePharmacies)
						.innerJoin(
							pharmacies,
							eq(routePharmacies.pharmacyId, pharmacies.id),
						)
						.where(eq(routePharmacies.routeId, input.routeId));

					return rows;
				},
			);
		}),

	getAssignedMedicines: protectedProcedure.query(async ({ ctx }) => {
		return Sentry.startSpan(
			{ name: "orders.getAssignedMedicines" },
			async () => {
				const repId = ctx.session.user.id;

				const rows = await db
					.select({
						id: medicines.id,
						name: medicines.name,
						genericName: medicines.genericName,
						price: medicines.price,
						stockStatus: medicines.stockStatus,
					})
					.from(repMedicines)
					.innerJoin(medicines, eq(repMedicines.medicineId, medicines.id))
					.where(eq(repMedicines.repId, repId));

				return rows;
			},
		);
	}),

	create: protectedProcedure
		.input(
			z.object({
				routeId: z.string().min(1),
				pharmacyId: z.string().min(1),
				items: z
					.array(
						z.object({
							medicineId: z.string().min(1),
							quantity: z.number().int().min(1),
							unitPrice: z.number().positive(),
						}),
					)
					.min(1),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			return Sentry.startSpan({ name: "orders.create" }, async () => {
				const repId = ctx.session.user.id;

				const totalAmount = input.items.reduce(
					(sum, item) => sum + item.quantity * item.unitPrice,
					0,
				);

				const orderId = crypto.randomUUID();

				await db.batch([
					db.insert(orders).values({
						id: orderId,
						repId,
						pharmacyId: input.pharmacyId,
						routeId: input.routeId,
						totalAmount: totalAmount.toFixed(2),
					}),
					db.insert(orderItems).values(
						input.items.map((item) => ({
							orderId,
							medicineId: item.medicineId,
							quantity: item.quantity,
							unitPrice: item.unitPrice.toFixed(2),
							lineTotal: (item.quantity * item.unitPrice).toFixed(2),
						})),
					),
				]);

				return { orderId };
			});
		}),

	get: protectedProcedure
		.input(z.object({ id: z.string().min(1) }))
		.query(async ({ ctx, input }) => {
			return Sentry.startSpan({ name: "orders.get" }, async () => {
				const order = await db.query.orders.findFirst({
					where: eq(orders.id, input.id),
					with: {
						pharmacy: true,
						route: true,
						rep: true,
						items: {
							with: {
								medicine: true,
							},
						},
					},
				});

				if (!order) {
					throw new TRPCError({
						code: "NOT_FOUND",
						message: "Order not found",
					});
				}

				const role = (ctx.session.user as { role?: string }).role;
				const isUserAdmin = isAdmin(role);
				if (!isUserAdmin && order.repId !== ctx.session.user.id) {
					throw new TRPCError({
						code: "FORBIDDEN",
						message: "You do not have access to this order",
					});
				}

				return {
					id: order.id,
					displayId: deriveDisplayId(order.id),
					repId: order.repId,
					repName: order.rep.name,
					pharmacyId: order.pharmacyId,
					pharmacyName: order.pharmacy.name,
					pharmacyAddress: order.pharmacy.address,
					routeId: order.routeId,
					routeName: order.route.routeName,
					totalAmount: Number(order.totalAmount),
					status: order.status,
					createdAt: order.createdAt.toISOString(),
					items: order.items.map((item) => ({
						id: item.id,
						medicineId: item.medicineId,
						medicineName: item.medicine.name,
						genericName: item.medicine.genericName,
						quantity: item.quantity,
						unitPrice: Number(item.unitPrice),
						lineTotal: Number(item.lineTotal),
					})),
				};
			});
		}),

	update: protectedProcedure
		.input(
			z.object({
				id: z.string().min(1),
				routeId: z.string().min(1),
				pharmacyId: z.string().min(1),
				items: z
					.array(
						z.object({
							medicineId: z.string().min(1),
							quantity: z.number().int().min(1),
							unitPrice: z.number().positive(),
						}),
					)
					.min(1),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			return Sentry.startSpan({ name: "orders.update" }, async () => {
				const order = await db.query.orders.findFirst({
					where: eq(orders.id, input.id),
				});

				if (!order) {
					throw new TRPCError({
						code: "NOT_FOUND",
						message: "Order not found",
					});
				}

				const role = (ctx.session.user as { role?: string }).role;
				const isUserAdmin = isAdmin(role);
				if (!isUserAdmin && order.repId !== ctx.session.user.id) {
					throw new TRPCError({
						code: "FORBIDDEN",
						message: "You do not have permission to edit this order",
					});
				}

				const totalAmount = input.items.reduce(
					(sum, item) => sum + item.quantity * item.unitPrice,
					0,
				);

				await db.batch([
					db
						.update(orders)
						.set({
							routeId: input.routeId,
							pharmacyId: input.pharmacyId,
							totalAmount: totalAmount.toFixed(2),
							updatedAt: new Date(),
						})
						.where(eq(orders.id, input.id)),

					db.delete(orderItems).where(eq(orderItems.orderId, input.id)),

					db.insert(orderItems).values(
						input.items.map((item) => ({
							orderId: input.id,
							medicineId: item.medicineId,
							quantity: item.quantity,
							unitPrice: item.unitPrice.toFixed(2),
							lineTotal: (item.quantity * item.unitPrice).toFixed(2),
						})),
					),
				]);

				return { success: true };
			});
		}),

	delete: protectedProcedure
		.input(z.object({ id: z.string().min(1) }))
		.mutation(async ({ ctx, input }) => {
			return Sentry.startSpan({ name: "orders.delete" }, async () => {
				const order = await db.query.orders.findFirst({
					where: eq(orders.id, input.id),
				});

				if (!order) {
					throw new TRPCError({
						code: "NOT_FOUND",
						message: "Order not found",
					});
				}

				const role = (ctx.session.user as { role?: string }).role;
				const isUserAdmin = isAdmin(role);
				if (!isUserAdmin && order.repId !== ctx.session.user.id) {
					throw new TRPCError({
						code: "FORBIDDEN",
						message: "You do not have permission to delete this order",
					});
				}

				await db.delete(orders).where(eq(orders.id, input.id));
				return { success: true };
			});
		}),
} satisfies TRPCRouterRecord;

function deriveDisplayId(uuid: string): string {
	const hex = uuid.replace(/-/g, "").slice(-4);
	const num = Number.parseInt(hex, 16) % 1000;
	return `#ORD-${num.toString().padStart(3, "0")}`;
}
