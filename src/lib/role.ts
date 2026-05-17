export type UserRole = "super_admin" | "admin" | "rep";

const ADMIN_ROLES: ReadonlySet<UserRole> = new Set(["super_admin", "admin"]);

export function isAdmin(role: UserRole | string | null | undefined): boolean {
	if (!role) return false;
	return ADMIN_ROLES.has(role as UserRole);
}

export function isSuperAdmin(
	role: UserRole | string | null | undefined,
): boolean {
	return role === "super_admin";
}

export const USER_ROLES: readonly UserRole[] = [
	"super_admin",
	"admin",
	"rep",
] as const;
