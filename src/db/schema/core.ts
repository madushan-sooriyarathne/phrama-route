import {
	integer,
	numeric,
	pgTable,
	primaryKey,
	text,
	timestamp,
} from "drizzle-orm/pg-core";
import { user } from "./auth.ts";
import { orderStatusEnum } from "./enums.ts";

export const medicines = pgTable("medicines", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	name: text("name").notNull(),
	genericName: text("generic_name"),
	price: numeric("price", { precision: 10, scale: 2 }).notNull(),
	stockStatus: text("stock_status").default("in_stock").notNull(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const pharmacies = pgTable("pharmacies", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	name: text("name").notNull(),
	address: text("address").notNull(),
	contactNo: text("contact_no"),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const routes = pgTable("routes", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	routeName: text("route_name").notNull(),
	adminId: text("admin_id")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const routePharmacies = pgTable(
	"route_pharmacies",
	{
		routeId: text("route_id")
			.notNull()
			.references(() => routes.id, { onDelete: "cascade" }),
		pharmacyId: text("pharmacy_id")
			.notNull()
			.references(() => pharmacies.id, { onDelete: "cascade" }),
	},
	(t) => ({
		pk: primaryKey({ columns: [t.routeId, t.pharmacyId] }),
	}),
);

export const repRoutes = pgTable(
	"rep_routes",
	{
		repId: text("rep_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		routeId: text("route_id")
			.notNull()
			.references(() => routes.id, { onDelete: "cascade" }),
	},
	(t) => ({
		pk: primaryKey({ columns: [t.repId, t.routeId] }),
	}),
);

export const repMedicines = pgTable(
	"rep_medicines",
	{
		repId: text("rep_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		medicineId: text("medicine_id")
			.notNull()
			.references(() => medicines.id, { onDelete: "cascade" }),
	},
	(t) => ({
		pk: primaryKey({ columns: [t.repId, t.medicineId] }),
	}),
);

export const orders = pgTable("orders", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	repId: text("rep_id")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	pharmacyId: text("pharmacy_id")
		.notNull()
		.references(() => pharmacies.id, { onDelete: "cascade" }),
	routeId: text("route_id")
		.notNull()
		.references(() => routes.id, { onDelete: "cascade" }),
	totalAmount: numeric("total_amount", { precision: 12, scale: 2 }).notNull(),
	status: orderStatusEnum("status").default("pending").notNull(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const orderItems = pgTable("order_items", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	orderId: text("order_id")
		.notNull()
		.references(() => orders.id, { onDelete: "cascade" }),
	medicineId: text("medicine_id")
		.notNull()
		.references(() => medicines.id, { onDelete: "cascade" }),
	quantity: integer("quantity").notNull(),
	unitPrice: numeric("unit_price", { precision: 10, scale: 2 }).notNull(),
	lineTotal: numeric("line_total", { precision: 12, scale: 2 }).notNull(),
});
