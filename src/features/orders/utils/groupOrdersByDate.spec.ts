import { describe, expect, it } from "vitest";
import {
	groupOrdersByDate,
	type OrderItem,
	type OrderStatus,
} from "./groupOrdersByDate";

function makeOrder(
	overrides: Partial<OrderItem> & { createdAt: string },
): OrderItem {
	return {
		id: crypto.randomUUID(),
		displayId: "#ORD-001",
		pharmacyName: "Test Pharmacy",
		totalAmount: 100,
		status: "completed" as OrderStatus,
		...overrides,
	};
}

function isoOnDaysAgo(daysAgo: number): string {
	const d = new Date();
	d.setDate(d.getDate() - daysAgo);
	d.setHours(10, 0, 0, 0);
	return d.toISOString();
}

describe("groupOrdersByDate", () => {
	it("returns empty array for empty input", () => {
		const result = groupOrdersByDate([]);
		expect(result).toEqual([]);
	});

	it("labels today's orders as TODAY", () => {
		const order = makeOrder({ createdAt: isoOnDaysAgo(0) });
		const [group] = groupOrdersByDate([order]);
		expect(group.dateLabel).toMatch(/^TODAY,/);
	});

	it("labels yesterday's orders as YESTERDAY", () => {
		const order = makeOrder({ createdAt: isoOnDaysAgo(1) });
		const [group] = groupOrdersByDate([order]);
		expect(group.dateLabel).toMatch(/^YESTERDAY,/);
	});

	it("labels older orders with a weekday prefix", () => {
		const order = makeOrder({ createdAt: isoOnDaysAgo(5) });
		const [group] = groupOrdersByDate([order]);
		expect(group.dateLabel).not.toMatch(/^TODAY/);
		expect(group.dateLabel).not.toMatch(/^YESTERDAY/);
		expect(group.dateLabel).toMatch(/^[A-Z]{3},/);
	});

	it("groups multiple orders on the same day into one group", () => {
		const today = isoOnDaysAgo(0);
		const orders = [
			makeOrder({ createdAt: today, pharmacyName: "A" }),
			makeOrder({ createdAt: today, pharmacyName: "B" }),
		];
		const result = groupOrdersByDate(orders);
		expect(result).toHaveLength(1);
		expect(result[0].orders).toHaveLength(2);
	});

	it("produces separate groups for different days", () => {
		const orders = [
			makeOrder({ createdAt: isoOnDaysAgo(0) }),
			makeOrder({ createdAt: isoOnDaysAgo(1) }),
			makeOrder({ createdAt: isoOnDaysAgo(5) }),
		];
		const result = groupOrdersByDate(orders);
		expect(result).toHaveLength(3);
	});

	it("preserves all order data within each group", () => {
		const order = makeOrder({
			createdAt: isoOnDaysAgo(0),
			pharmacyName: "City Care Pharmacy",
			totalAmount: 1240,
			status: "completed",
		});
		const [group] = groupOrdersByDate([order]);
		const [item] = group.orders;
		expect(item.pharmacyName).toEqual("City Care Pharmacy");
		expect(item.totalAmount).toEqual(1240);
		expect(item.status).toEqual("completed");
	});

	it("handles a single order correctly", () => {
		const order = makeOrder({ createdAt: isoOnDaysAgo(2) });
		const result = groupOrdersByDate([order]);
		expect(result).toHaveLength(1);
		expect(result[0].orders).toHaveLength(1);
	});
});
