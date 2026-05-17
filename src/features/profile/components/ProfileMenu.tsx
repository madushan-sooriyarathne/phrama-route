import { Link } from "@tanstack/react-router";
import {
	ChevronRight,
	LogOut,
	type LucideIcon,
	Package,
	Settings,
	Users as UsersIcon,
} from "lucide-react";
import { authClient } from "#/lib/auth-client";
import { isAdmin, type UserRole } from "#/lib/role";

type MenuItem = {
	label: string;
	to: string;
	params?: Record<string, string>;
	icon: LucideIcon;
	requiresAdmin?: boolean;
};

const MENU_ITEMS: MenuItem[] = [
	{
		label: "Account settings",
		to: "/account/$pathname",
		params: { pathname: "settings" },
		icon: Settings,
	},
	{
		label: "Users",
		to: "/admin/users",
		icon: UsersIcon,
		requiresAdmin: true,
	},
	{
		label: "Inventory",
		to: "/admin/inventory",
		icon: Package,
		requiresAdmin: true,
	},
];

interface ProfileMenuProps {
	role: UserRole | string | null | undefined;
	onNavigate: () => void;
}

export function ProfileMenu({ role, onNavigate }: ProfileMenuProps) {
	const items = MENU_ITEMS.filter(
		(item) => !item.requiresAdmin || isAdmin(role),
	);

	return (
		<nav aria-label="Profile menu" className="flex flex-col">
			<ul className="flex flex-col divide-y divide-hairline">
				{items.map(({ label, to, params, icon: Icon }) => (
					<li key={`${to}-${label}`}>
						<Link
							to={to}
							params={params}
							onClick={onNavigate}
							className="flex h-[56px] items-center justify-between px-[16px] text-ink active:bg-surface-soft"
						>
							<span className="flex items-center gap-3">
								<Icon size={20} strokeWidth={1.5} />
								<span className="font-sans text-label-md font-medium">
									{label}
								</span>
							</span>
							<ChevronRight
								size={18}
								strokeWidth={1.5}
								className="text-muted"
							/>
						</Link>
					</li>
				))}
			</ul>

			<div className="border-t border-hairline px-[16px] py-[16px]">
				<button
					type="button"
					onClick={() => {
						void authClient.signOut();
						onNavigate();
					}}
					className="flex h-[48px] w-full items-center justify-center gap-2 rounded-md border border-hairline bg-canvas font-sans text-button font-medium text-ink active:bg-surface-soft"
				>
					<LogOut size={18} strokeWidth={1.5} />
					Sign out
				</button>
			</div>
		</nav>
	);
}
