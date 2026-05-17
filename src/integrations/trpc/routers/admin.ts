import * as Sentry from "@sentry/tanstackstart-react";
import type { TRPCRouterRecord } from "@trpc/server";
import { TRPCError } from "@trpc/server";
import { and, asc, eq, inArray } from "drizzle-orm";
import { z } from "zod";
import { db } from "#/db";
import { medicines, repMedicines, user } from "#/db/schema";
import { authClient } from "#/lib/auth-client";
import { isSuperAdmin, USER_ROLES } from "#/lib/role";
import { adminProcedure } from "../init";

const roleSchema = z.enum(USER_ROLES);

const stockStatusSchema = z.enum(["in_stock", "out_of_stock", "low_stock"]);

export const adminRouter = {
	listUsers: adminProcedure.query(async () => {
		return Sentry.startSpan({ name: "admin.listUsers" }, async () => {
			const rows = await db
				.select({
					id: user.id,
					name: user.name,
					email: user.email,
					role: user.role,
					image: user.image,
					createdAt: user.createdAt,
				})
				.from(user)
				.orderBy(asc(user.name));
			return rows.map((u) => ({
				...u,
				createdAt: u.createdAt.toISOString(),
			}));
		});
	}),

	createUser: adminProcedure
		.input(
			z.object({
				name: z.string().min(1).max(120),
				email: z.string().email(),
				password: z.string().min(8).max(128),
				role: roleSchema,
			}),
		)
		.mutation(async ({ ctx, input }) => {
			return Sentry.startSpan({ name: "admin.createUser" }, async () => {
				if (
					input.role === "super_admin" &&
					!isSuperAdmin(ctx.session.user.role)
				) {
					throw new TRPCError({
						code: "FORBIDDEN",
						message: "Only super admins can create super admins.",
					});
				}

				const { data, error } = await authClient.signUp.email({
					name: input.name,
					email: input.email,
					password: input.password,
				});

				if (error || !data) {
					throw new TRPCError({
						code: "BAD_REQUEST",
						message: error?.message ?? "Failed to create user.",
					});
				}

				if (input.role !== "rep") {
					await db
						.update(user)
						.set({ role: input.role, updatedAt: new Date() })
						.where(eq(user.email, input.email));
				}

				return { id: data.user?.id ?? null };
			});
		}),

	updateUser: adminProcedure
		.input(
			z.object({
				id: z.string().min(1),
				name: z.string().min(1).max(120).optional(),
				role: roleSchema.optional(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			return Sentry.startSpan({ name: "admin.updateUser" }, async () => {
				const target = await db.query.user.findFirst({
					where: eq(user.id, input.id),
					columns: { id: true, role: true },
				});
				if (!target) {
					throw new TRPCError({ code: "NOT_FOUND" });
				}

				if (
					(input.role === "super_admin" || target.role === "super_admin") &&
					!isSuperAdmin(ctx.session.user.role)
				) {
					throw new TRPCError({
						code: "FORBIDDEN",
						message: "Only super admins can modify super admins.",
					});
				}

				const patch: {
					name?: string;
					role?: typeof input.role;
					updatedAt: Date;
				} = {
					updatedAt: new Date(),
				};
				if (input.name !== undefined) patch.name = input.name;
				if (input.role !== undefined) patch.role = input.role;

				await db.update(user).set(patch).where(eq(user.id, input.id));
				return { ok: true };
			});
		}),

	deleteUser: adminProcedure
		.input(z.object({ id: z.string().min(1) }))
		.mutation(async ({ ctx, input }) => {
			return Sentry.startSpan({ name: "admin.deleteUser" }, async () => {
				if (ctx.session.user.id === input.id) {
					throw new TRPCError({
						code: "BAD_REQUEST",
						message: "You cannot delete your own account.",
					});
				}

				const target = await db.query.user.findFirst({
					where: eq(user.id, input.id),
					columns: { id: true, role: true },
				});
				if (!target) {
					throw new TRPCError({ code: "NOT_FOUND" });
				}
				if (
					target.role === "super_admin" &&
					!isSuperAdmin(ctx.session.user.role)
				) {
					throw new TRPCError({
						code: "FORBIDDEN",
						message: "Only super admins can delete super admins.",
					});
				}

				await db.delete(user).where(eq(user.id, input.id));
				return { ok: true };
			});
		}),

	listMedicines: adminProcedure.query(async () => {
		return Sentry.startSpan({ name: "admin.listMedicines" }, async () => {
			const rows = await db
				.select()
				.from(medicines)
				.orderBy(asc(medicines.name));
			return rows.map((m) => ({
				id: m.id,
				name: m.name,
				genericName: m.genericName,
				price: Number(m.price),
				stockStatus: m.stockStatus,
				createdAt: m.createdAt.toISOString(),
				updatedAt: m.updatedAt.toISOString(),
			}));
		});
	}),

	createMedicine: adminProcedure
		.input(
			z.object({
				name: z.string().min(1).max(200),
				genericName: z.string().max(200).optional(),
				price: z.number().positive(),
				stockStatus: stockStatusSchema.default("in_stock"),
			}),
		)
		.mutation(async ({ input }) => {
			return Sentry.startSpan({ name: "admin.createMedicine" }, async () => {
				const [row] = await db
					.insert(medicines)
					.values({
						name: input.name,
						genericName: input.genericName ?? null,
						price: input.price.toFixed(2),
						stockStatus: input.stockStatus,
					})
					.returning({ id: medicines.id });
				return { id: row?.id ?? null };
			});
		}),

	updateMedicine: adminProcedure
		.input(
			z.object({
				id: z.string().min(1),
				name: z.string().min(1).max(200).optional(),
				genericName: z.string().max(200).nullable().optional(),
				price: z.number().positive().optional(),
				stockStatus: stockStatusSchema.optional(),
			}),
		)
		.mutation(async ({ input }) => {
			return Sentry.startSpan({ name: "admin.updateMedicine" }, async () => {
				const patch: Record<string, unknown> = { updatedAt: new Date() };
				if (input.name !== undefined) patch.name = input.name;
				if (input.genericName !== undefined)
					patch.genericName = input.genericName;
				if (input.price !== undefined) patch.price = input.price.toFixed(2);
				if (input.stockStatus !== undefined)
					patch.stockStatus = input.stockStatus;

				await db.update(medicines).set(patch).where(eq(medicines.id, input.id));
				return { ok: true };
			});
		}),

	deleteMedicine: adminProcedure
		.input(z.object({ id: z.string().min(1) }))
		.mutation(async ({ input }) => {
			return Sentry.startSpan({ name: "admin.deleteMedicine" }, async () => {
				await db.delete(medicines).where(eq(medicines.id, input.id));
				return { ok: true };
			});
		}),

	listRepsForMedicine: adminProcedure
		.input(z.object({ medicineId: z.string().min(1) }))
		.query(async ({ input }) => {
			return Sentry.startSpan(
				{ name: "admin.listRepsForMedicine" },
				async () => {
					const rows = await db
						.select({ repId: repMedicines.repId })
						.from(repMedicines)
						.where(eq(repMedicines.medicineId, input.medicineId));
					return rows.map((r) => r.repId);
				},
			);
		}),

	assignMedicineToReps: adminProcedure
		.input(
			z.object({
				medicineId: z.string().min(1),
				repIds: z.array(z.string().min(1)),
			}),
		)
		.mutation(async ({ input }) => {
			return Sentry.startSpan(
				{ name: "admin.assignMedicineToReps" },
				async () => {
					await db.transaction(async (tx) => {
						const existing = await tx
							.select({ repId: repMedicines.repId })
							.from(repMedicines)
							.where(eq(repMedicines.medicineId, input.medicineId));
						const existingIds = new Set(existing.map((r) => r.repId));
						const targetIds = new Set(input.repIds);

						const toAdd = input.repIds.filter((id) => !existingIds.has(id));
						const toRemove = [...existingIds].filter(
							(id) => !targetIds.has(id),
						);

						if (toAdd.length > 0) {
							await tx.insert(repMedicines).values(
								toAdd.map((repId) => ({
									repId,
									medicineId: input.medicineId,
								})),
							);
						}
						if (toRemove.length > 0) {
							await tx
								.delete(repMedicines)
								.where(
									and(
										eq(repMedicines.medicineId, input.medicineId),
										inArray(repMedicines.repId, toRemove),
									),
								);
						}
					});
					return { ok: true };
				},
			);
		}),
} satisfies TRPCRouterRecord;
