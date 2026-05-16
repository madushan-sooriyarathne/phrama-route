import { describe, expect, it } from "vitest";
import { computeGrandTotal, decrement, increment } from "./orderItems";

describe("increment", () => {
	it("sets quantity to 1 for new medicine", () => {
		const result = increment(new Map(), "med-1");
		expect(result.get("med-1")).toEqual(1);
	});

	it("increments existing quantity by 1", () => {
		const initial = new Map([["med-1", 3]]);
		const result = increment(initial, "med-1");
		expect(result.get("med-1")).toEqual(4);
	});

	it("does not mutate the original map", () => {
		const initial = new Map([["med-1", 2]]);
		increment(initial, "med-1");
		expect(initial.get("med-1")).toEqual(2);
	});

	it("does not affect other medicine quantities", () => {
		const initial = new Map([
			["med-1", 2],
			["med-2", 5],
		]);
		const result = increment(initial, "med-1");
		expect(result.get("med-2")).toEqual(5);
	});
});

describe("decrement", () => {
	it("removes medicine when quantity reaches 0 from 1", () => {
		const initial = new Map([["med-1", 1]]);
		const result = decrement(initial, "med-1");
		expect(result.has("med-1")).toBe(false);
	});

	it("decrements quantity by 1 when above 1", () => {
		const initial = new Map([["med-1", 4]]);
		const result = decrement(initial, "med-1");
		expect(result.get("med-1")).toEqual(3);
	});

	it("removes medicine when decrementing from 0", () => {
		const result = decrement(new Map(), "med-1");
		expect(result.has("med-1")).toBe(false);
	});

	it("does not mutate the original map", () => {
		const initial = new Map([["med-1", 3]]);
		decrement(initial, "med-1");
		expect(initial.get("med-1")).toEqual(3);
	});

	it("does not affect other medicine quantities", () => {
		const initial = new Map([
			["med-1", 2],
			["med-2", 7],
		]);
		const result = decrement(initial, "med-1");
		expect(result.get("med-2")).toEqual(7);
	});
});

describe("computeGrandTotal", () => {
	it("returns 0 for empty quantities", () => {
		const prices = new Map([["med-1", 10]]);
		expect(computeGrandTotal(new Map(), prices)).toEqual(0);
	});

	it("computes total for single item", () => {
		const quantities = new Map([["med-1", 3]]);
		const prices = new Map([["med-1", 100]]);
		expect(computeGrandTotal(quantities, prices)).toEqual(300);
	});

	it("sums across multiple items", () => {
		const quantities = new Map([
			["med-1", 2],
			["med-2", 5],
		]);
		const prices = new Map([
			["med-1", 50],
			["med-2", 20],
		]);
		expect(computeGrandTotal(quantities, prices)).toEqual(200);
	});

	it("treats missing price as 0", () => {
		const quantities = new Map([["med-unknown", 3]]);
		const prices = new Map<string, number>();
		expect(computeGrandTotal(quantities, prices)).toEqual(0);
	});
});
