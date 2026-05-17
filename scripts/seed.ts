import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "#/db/index.ts";
import {
	medicines,
	pharmacies,
	repMedicines,
	repRoutes,
	routePharmacies,
	routes,
} from "#/db/schema/core.ts";
import { parseCsv } from "./seed/parse-csv.ts";
import { upsertUser } from "./seed/upsert-user.ts";

const DEFAULT_PASSWORD = "Phrama@123#$";
const DATA_DIR = resolve(process.cwd(), "scripts/data");

const requireEnv = (key: string): string => {
	const value = process.env[key];
	if (!value) throw new Error(`Missing env var: ${key}`);
	return value;
};

const lineRef = z
	.string()
	.regex(/^\d+$/, "expected 1-based line number")
	.transform(Number);

const userRowSchema = z.object({
	line: z.number(),
	Name: z.string().min(1),
	"Email Address": z.email(),
	"User Role": z.enum(["super_admin", "admin", "rep"]),
});

const routeRowSchema = z.object({
	line: z.number(),
	Name: z.string().min(1),
	"Assigned User's ID": lineRef,
});

const pharmacyRowSchema = z.object({
	line: z.number(),
	Name: z.string().min(1),
	Address: z.string().min(1),
	"Contact Number": z.string().optional().default(""),
	"Route ID": lineRef,
});

const medicineRowSchema = z.object({
	line: z.number(),
	Name: z.string().min(1),
	"Technical Name": z.string().optional().default(""),
	Price: z.string().regex(/^\d+(\.\d+)?$/, "expected decimal price"),
});

const repRouteRowSchema = z.object({
	line: z.number(),
	"Assigned User's ID": lineRef,
	"Route ID": lineRef,
});

const repMedicineRowSchema = z.object({
	line: z.number(),
	"Assigned User's ID": lineRef,
	"Medicine ID": lineRef,
});

const loadCsv = async <T extends z.ZodTypeAny>(
	filename: string,
	schema: T,
): Promise<z.infer<T>[]> => {
	const text = await readFile(resolve(DATA_DIR, filename), "utf8");
	const rows = parseCsv(text);
	return rows.map((row, index) => {
		const result = schema.safeParse(row);
		if (!result.success) {
			throw new Error(`${filename} line ${index + 1}: ${result.error.message}`);
		}
		return result.data;
	});
};

const seedUsers = async (
	rows: z.infer<typeof userRowSchema>[],
	authBaseUrl: string,
): Promise<Map<number, string>> => {
	const map = new Map<number, string>();
	for (const row of rows) {
		const id = await upsertUser({
			name: row.Name,
			email: row["Email Address"],
			role: row["User Role"],
			password: DEFAULT_PASSWORD,
			authBaseUrl,
		});
		map.set(row.line, id);
		console.log(
			`  user line=${row.line} email=${row["Email Address"]} id=${id}`,
		);
	}
	return map;
};

const upsertRoute = async (
	routeName: string,
	adminId: string,
): Promise<string> => {
	const existing = await db
		.select({ id: routes.id })
		.from(routes)
		.where(and(eq(routes.routeName, routeName), eq(routes.adminId, adminId)))
		.limit(1);
	if (existing.length > 0) return existing[0].id;
	const [inserted] = await db
		.insert(routes)
		.values({ routeName, adminId })
		.returning({ id: routes.id });
	return inserted.id;
};

const seedRoutes = async (
	rows: z.infer<typeof routeRowSchema>[],
	userMap: Map<number, string>,
): Promise<Map<number, string>> => {
	const map = new Map<number, string>();
	for (const row of rows) {
		const adminId = userMap.get(row["Assigned User's ID"]);
		if (!adminId) {
			throw new Error(
				`routes line ${row.line}: Assigned User line ${row["Assigned User's ID"]} not found`,
			);
		}
		const id = await upsertRoute(row.Name, adminId);
		map.set(row.line, id);
		console.log(`  route line=${row.line} name=${row.Name} id=${id}`);
	}
	return map;
};

const upsertPharmacy = async (
	name: string,
	address: string,
	contactNo: string,
): Promise<string> => {
	const existing = await db
		.select({ id: pharmacies.id })
		.from(pharmacies)
		.where(and(eq(pharmacies.name, name), eq(pharmacies.address, address)))
		.limit(1);
	if (existing.length > 0) return existing[0].id;
	const [inserted] = await db
		.insert(pharmacies)
		.values({ name, address, contactNo: contactNo || null })
		.returning({ id: pharmacies.id });
	return inserted.id;
};

const seedPharmacies = async (
	rows: z.infer<typeof pharmacyRowSchema>[],
	routeMap: Map<number, string>,
): Promise<void> => {
	for (const row of rows) {
		const routeId = routeMap.get(row["Route ID"]);
		if (!routeId) {
			throw new Error(
				`pharmacies line ${row.line}: Route line ${row["Route ID"]} not found`,
			);
		}
		const pharmacyId = await upsertPharmacy(
			row.Name,
			row.Address,
			row["Contact Number"],
		);
		await db
			.insert(routePharmacies)
			.values({ routeId, pharmacyId })
			.onConflictDoNothing();
		console.log(
			`  pharmacy line=${row.line} name=${row.Name} id=${pharmacyId} → route=${routeId}`,
		);
	}
};

const upsertMedicine = async (
	name: string,
	genericName: string,
	price: string,
): Promise<string> => {
	const condition = genericName
		? and(eq(medicines.name, name), eq(medicines.genericName, genericName))
		: eq(medicines.name, name);
	const existing = await db
		.select({ id: medicines.id })
		.from(medicines)
		.where(condition)
		.limit(1);
	if (existing.length > 0) return existing[0].id;
	const [inserted] = await db
		.insert(medicines)
		.values({ name, genericName: genericName || null, price })
		.returning({ id: medicines.id });
	return inserted.id;
};

const seedMedicines = async (
	rows: z.infer<typeof medicineRowSchema>[],
): Promise<Map<number, string>> => {
	const map = new Map<number, string>();
	for (const row of rows) {
		const medicineId = await upsertMedicine(
			row.Name,
			row["Technical Name"],
			row.Price,
		);
		map.set(row.line, medicineId);
		console.log(
			`  medicine line=${row.line} name=${row.Name} id=${medicineId}`,
		);
	}
	return map;
};

const seedRepRoutes = async (
	rows: z.infer<typeof repRouteRowSchema>[],
	userMap: Map<number, string>,
	routeMap: Map<number, string>,
): Promise<void> => {
	for (const row of rows) {
		const repId = userMap.get(row["Assigned User's ID"]);
		if (!repId) {
			throw new Error(
				`rep_routes line ${row.line}: User line ${row["Assigned User's ID"]} not found`,
			);
		}
		const routeId = routeMap.get(row["Route ID"]);
		if (!routeId) {
			throw new Error(
				`rep_routes line ${row.line}: Route line ${row["Route ID"]} not found`,
			);
		}
		await db.insert(repRoutes).values({ repId, routeId }).onConflictDoNothing();
		console.log(`  rep_route line=${row.line} rep=${repId} → route=${routeId}`);
	}
};

const seedRepMedicines = async (
	rows: z.infer<typeof repMedicineRowSchema>[],
	userMap: Map<number, string>,
	medicineMap: Map<number, string>,
): Promise<void> => {
	for (const row of rows) {
		const repId = userMap.get(row["Assigned User's ID"]);
		if (!repId) {
			throw new Error(
				`rep_medicines line ${row.line}: User line ${row["Assigned User's ID"]} not found`,
			);
		}
		const medicineId = medicineMap.get(row["Medicine ID"]);
		if (!medicineId) {
			throw new Error(
				`rep_medicines line ${row.line}: Medicine line ${row["Medicine ID"]} not found`,
			);
		}
		await db
			.insert(repMedicines)
			.values({ repId, medicineId })
			.onConflictDoNothing();
		console.log(
			`  rep_medicine line=${row.line} rep=${repId} → medicine=${medicineId}`,
		);
	}
};

const main = async () => {
	const authBaseUrl = requireEnv("VITE_NEON_AUTH_URL");
	requireEnv("DATABASE_URL");

	console.log("→ users.csv");
	const userRows = await loadCsv("users.csv", userRowSchema);
	const userMap = await seedUsers(userRows, authBaseUrl);

	console.log("→ routes.csv");
	const routeRows = await loadCsv("routes.csv", routeRowSchema);
	const routeMap = await seedRoutes(routeRows, userMap);

	console.log("→ pharmacies.csv");
	const pharmacyRows = await loadCsv("pharmacies.csv", pharmacyRowSchema);
	await seedPharmacies(pharmacyRows, routeMap);

	console.log("→ medicines.csv");
	const medicineRows = await loadCsv("medicines.csv", medicineRowSchema);
	const medicineMap = await seedMedicines(medicineRows);

	console.log("→ rep_routes.csv");
	const repRouteRows = await loadCsv("rep_routes.csv", repRouteRowSchema);
	await seedRepRoutes(repRouteRows, userMap, routeMap);

	console.log("→ rep_medicines.csv");
	const repMedicineRows = await loadCsv(
		"rep_medicines.csv",
		repMedicineRowSchema,
	);
	await seedRepMedicines(repMedicineRows, userMap, medicineMap);

	console.log(
		`✓ seed complete: ${userRows.length} users, ${routeRows.length} routes, ${pharmacyRows.length} pharmacies, ${medicineRows.length} medicines, ${repRouteRows.length} rep_routes, ${repMedicineRows.length} rep_medicines`,
	);
};

main().catch((error) => {
	console.error("✗ seed failed:", error);
	process.exit(1);
});
