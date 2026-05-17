import { describe, expect, it } from "vitest";
import { buildLineMap, parseCsv } from "./parse-csv.ts";

describe(parseCsv.name, () => {
	it("strips header and indexes rows by 1-based line number", () => {
		const text = "name,email\nAlice,a@x.com\nBob,b@x.com\n";
		const rows = parseCsv(text);
		expect(rows).toEqual([
			{ line: 1, name: "Alice", email: "a@x.com" },
			{ line: 2, name: "Bob", email: "b@x.com" },
		]);
	});

	it("handles quoted fields containing commas", () => {
		const text = 'name,address\n"Acme, Inc.","12 Main St, Apt 4"\n';
		const rows = parseCsv(text);
		expect(rows).toEqual([
			{ line: 1, name: "Acme, Inc.", address: "12 Main St, Apt 4" },
		]);
	});

	it("handles CRLF line endings", () => {
		const text = "a,b\r\n1,2\r\n3,4\r\n";
		const rows = parseCsv(text);
		expect(rows).toEqual([
			{ line: 1, a: "1", b: "2" },
			{ line: 2, a: "3", b: "4" },
		]);
	});

	it("trims whitespace around values", () => {
		const text = "name, email\n Alice , a@x.com \n";
		const rows = parseCsv(text);
		expect(rows).toEqual([{ line: 1, name: "Alice", email: "a@x.com" }]);
	});

	it("returns empty array when only header present", () => {
		const text = "name,email\n";
		expect(parseCsv(text)).toEqual([]);
	});
});

describe(buildLineMap.name, () => {
	it("maps 1-based line numbers to provided ids", () => {
		const rows = [
			{ line: 1, name: "Alice" },
			{ line: 2, name: "Bob" },
		];
		const ids = ["uuid-a", "uuid-b"];
		const map = buildLineMap(rows, ids);
		expect(map.get(1)).toBe("uuid-a");
		expect(map.get(2)).toBe("uuid-b");
		expect(map.size).toBe(2);
	});

	it("throws when ids length differs from rows length", () => {
		expect(() => buildLineMap([{ line: 1 }], ["a", "b"])).toThrow();
	});
});
