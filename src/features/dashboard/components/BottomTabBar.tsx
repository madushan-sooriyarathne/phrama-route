import { Link, useRouterState } from "@tanstack/react-router";
import { ClipboardList, Home, Map as MapIcon, User } from "lucide-react";
import { useProfileSheet } from "#/features/profile/context/ProfileSheetContext";

type LinkTab = {
	kind: "link";
	label: string;
	icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
	to: string;
};

type ButtonTab = {
	kind: "button";
	label: string;
	icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
	action: "profile";
};

type Tab = LinkTab | ButtonTab;

const TABS: Tab[] = [
	{ kind: "link", label: "Home", icon: Home, to: "/" },
	{ kind: "link", label: "Routes", icon: MapIcon, to: "/routes" },
	{ kind: "link", label: "Orders", icon: ClipboardList, to: "/orders" },
	{ kind: "button", label: "Profile", icon: User, action: "profile" },
];

export function BottomTabBar() {
	const pathname = useRouterState({
		select: (s) => s.location.pathname,
	});
	const { open: profileOpen, openSheet } = useProfileSheet();

	return (
		<nav
			aria-label="Main navigation"
			className="flex shrink-0 items-center justify-around border-t border-hairline bg-canvas pb-[24px] pl-[16px] pr-[16px] pt-[12px]"
		>
			{TABS.map((tab) => {
				const Icon = tab.icon;
				if (tab.kind === "link") {
					const isActive = pathname === tab.to;
					return (
						<Link
							key={tab.label}
							to={tab.to}
							className={`flex flex-col items-center gap-1 ${isActive ? "text-ink" : "text-muted"}`}
							aria-current={isActive ? "page" : undefined}
						>
							<Icon size={24} strokeWidth={1.5} />
							<span className="font-sans text-[10px] leading-none">
								{tab.label}
							</span>
						</Link>
					);
				}

				return (
					<button
						key={tab.label}
						type="button"
						onClick={openSheet}
						aria-expanded={profileOpen}
						aria-haspopup="dialog"
						className={`flex flex-col items-center gap-1 ${profileOpen ? "text-ink" : "text-muted"}`}
					>
						<Icon size={24} strokeWidth={1.5} />
						<span className="font-sans text-[10px] leading-none">
							{tab.label}
						</span>
					</button>
				);
			})}
		</nav>
	);
}
