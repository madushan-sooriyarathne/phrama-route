import type { UserRole } from "#/lib/role";

interface RolePillProps {
	role: UserRole | string;
}

const LABELS: Record<UserRole, string> = {
	super_admin: "SUPER ADMIN",
	admin: "ADMIN",
	rep: "REP",
};

const CLASSES: Record<UserRole, string> = {
	super_admin: "bg-signature-forest text-on-primary",
	admin: "bg-surface-strong text-ink",
	rep: "bg-surface-soft text-muted",
};

export function RolePill({ role }: RolePillProps) {
	const key = (role as UserRole) in LABELS ? (role as UserRole) : "rep";
	return (
		<span
			className={`rounded-full px-2 py-0.5 font-sans text-[10px] font-medium uppercase tracking-widest ${CLASSES[key]}`}
		>
			{LABELS[key]}
		</span>
	);
}
