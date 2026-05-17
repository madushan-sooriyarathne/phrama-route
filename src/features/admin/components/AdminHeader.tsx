import { Link } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";

interface AdminHeaderProps {
	title: string;
	backHref?: string;
	actionLabel?: string;
	onAction?: () => void;
}

export function AdminHeader({
	title,
	backHref = "/",
	actionLabel,
	onAction,
}: AdminHeaderProps) {
	return (
		<header className="flex items-center justify-between border-b border-hairline bg-canvas px-[16px] py-[12px]">
			<div className="flex items-center gap-2">
				<Link
					to={backHref}
					aria-label="Go back"
					className="-ml-1 flex h-10 w-10 items-center justify-center text-ink"
				>
					<ChevronLeft size={24} strokeWidth={1.5} />
				</Link>
				<span className="font-sans text-label-md font-semibold text-ink">
					{title}
				</span>
			</div>
			{actionLabel && onAction ? (
				<button
					type="button"
					onClick={onAction}
					className="rounded-md bg-primary px-3 py-1.5 font-sans text-body-md font-medium text-on-primary"
				>
					{actionLabel}
				</button>
			) : null}
		</header>
	);
}
