import { Link } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";

interface TopNavProps {
	role?: string;
	backHref?: string;
}

export function TopNav({ role = "REP", backHref }: TopNavProps) {
	return (
		<header className="flex items-center justify-between border-b border-hairline bg-canvas px-[16px] py-[12px]">
			<div className="flex items-center gap-2">
				{backHref ? (
					<Link
						to={backHref}
						aria-label="Go back"
						className="-ml-1 flex h-10 w-10 items-center justify-center text-ink"
					>
						<ChevronLeft size={24} strokeWidth={1.5} />
					</Link>
				) : null}
				<span className="font-sans text-label-md font-semibold text-ink">
					PharmaRoute
				</span>
			</div>
			<div className="flex items-center justify-center rounded-full bg-surface-strong px-3 py-1">
				<span className="font-sans text-body-md font-medium uppercase tracking-widest text-muted">
					{role}
				</span>
			</div>
		</header>
	);
}
