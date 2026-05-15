import { Link, useRouterState } from "@tanstack/react-router";
import { ClipboardList, Home, Map as MapIcon, User } from "lucide-react";

type Tab = {
	label: string;
	icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
	to: string;
};

const TABS: Tab[] = [
	{ label: "Home", icon: Home, to: "/" },
	{ label: "Routes", icon: MapIcon, to: "/routes" },
	{ label: "Orders", icon: ClipboardList, to: "/orders" },
	{ label: "Profile", icon: User, to: "/profile" },
];

export function BottomTabBar() {
	const pathname = useRouterState({
		select: (s) => s.location.pathname,
	});

	return (
		<nav
			aria-label="Main navigation"
			className="flex shrink-0 items-center justify-around border-t border-hairline bg-canvas pb-[24px] pl-[16px] pr-[16px] pt-[12px]"
		>
			{TABS.map(({ label, icon: Icon, to }) => {
				const isActive = pathname === to;
				return (
					<Link
						key={label}
						to={to}
						className={`flex flex-col items-center gap-1 ${isActive ? "text-ink" : "text-muted"}`}
						aria-current={isActive ? "page" : undefined}
					>
						<Icon size={24} strokeWidth={1.5} />
						<span className="font-sans text-[10px] leading-none">{label}</span>
					</Link>
				);
			})}
		</nav>
	);
}
