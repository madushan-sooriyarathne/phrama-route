interface TopNavProps {
	role?: string;
}

export function TopNav({ role = "REP" }: TopNavProps) {
	return (
		<header className="flex items-center justify-between border-b border-hairline bg-canvas px-[16px] py-[12px]">
			<span className="font-sans text-label-md font-semibold text-ink">
				PharmaRoute
			</span>
			<div className="flex items-center justify-center rounded-full bg-surface-strong px-3 py-1">
				<span className="font-sans text-body-md font-medium uppercase tracking-widest text-muted">
					{role}
				</span>
			</div>
		</header>
	);
}
