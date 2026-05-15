interface StatCardProps {
	label: string;
	value: string;
}

export function StatCard({ label, value }: StatCardProps) {
	return (
		<div className="flex flex-1 basis-0 flex-col gap-2 rounded-lg bg-surface-soft p-4">
			<span className="font-sans text-body-md text-muted">{label}</span>
			<span className="font-display text-total-sum font-semibold text-ink">
				{value}
			</span>
		</div>
	);
}
