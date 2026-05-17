import { describe, expect, it } from "vitest";
import { isAdmin, isSuperAdmin, type UserRole } from "./role";

describe("isAdmin", () => {
	it.each<[UserRole, boolean]>([
		["super_admin", true],
		["admin", true],
		["rep", false],
	])("returns %s -> %s", (role, expected) => {
		expect(isAdmin(role)).toBe(expected);
	});

	it("returns false for undefined", () => {
		expect(isAdmin(undefined)).toBe(false);
	});

	it("returns false for unknown string", () => {
		expect(isAdmin("guest" as UserRole)).toBe(false);
	});
});

describe("isSuperAdmin", () => {
	it.each<[UserRole, boolean]>([
		["super_admin", true],
		["admin", false],
		["rep", false],
	])("returns %s -> %s", (role, expected) => {
		expect(isSuperAdmin(role)).toBe(expected);
	});

	it("returns false for undefined", () => {
		expect(isSuperAdmin(undefined)).toBe(false);
	});
});
