import { relations } from "drizzle-orm";
import { user } from "./auth.ts";
import {
	medicines,
	orderItems,
	orders,
	pharmacies,
	repMedicines,
	repRoutes,
	routePharmacies,
	routes,
} from "./core.ts";

export const userRelations = relations(user, ({ many }) => ({
	assignedRoutes: many(repRoutes),
	assignedMedicines: many(repMedicines),
	orders: many(orders),
	createdRoutes: many(routes),
}));

export const routesRelations = relations(routes, ({ one, many }) => ({
	admin: one(user, {
		fields: [routes.adminId],
		references: [user.id],
	}),
	pharmacies: many(routePharmacies),
	reps: many(repRoutes),
	orders: many(orders),
}));

export const pharmaciesRelations = relations(pharmacies, ({ many }) => ({
	routes: many(routePharmacies),
	orders: many(orders),
}));

export const medicinesRelations = relations(medicines, ({ many }) => ({
	reps: many(repMedicines),
	orderItems: many(orderItems),
}));

export const routePharmaciesRelations = relations(
	routePharmacies,
	({ one }) => ({
		route: one(routes, {
			fields: [routePharmacies.routeId],
			references: [routes.id],
		}),
		pharmacy: one(pharmacies, {
			fields: [routePharmacies.pharmacyId],
			references: [pharmacies.id],
		}),
	}),
);

export const repRoutesRelations = relations(repRoutes, ({ one }) => ({
	rep: one(user, {
		fields: [repRoutes.repId],
		references: [user.id],
	}),
	route: one(routes, {
		fields: [repRoutes.routeId],
		references: [routes.id],
	}),
}));

export const repMedicinesRelations = relations(repMedicines, ({ one }) => ({
	rep: one(user, {
		fields: [repMedicines.repId],
		references: [user.id],
	}),
	medicine: one(medicines, {
		fields: [repMedicines.medicineId],
		references: [medicines.id],
	}),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
	rep: one(user, {
		fields: [orders.repId],
		references: [user.id],
	}),
	pharmacy: one(pharmacies, {
		fields: [orders.pharmacyId],
		references: [pharmacies.id],
	}),
	route: one(routes, {
		fields: [orders.routeId],
		references: [routes.id],
	}),
	items: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
	order: one(orders, {
		fields: [orderItems.orderId],
		references: [orders.id],
	}),
	medicine: one(medicines, {
		fields: [orderItems.medicineId],
		references: [medicines.id],
	}),
}));
