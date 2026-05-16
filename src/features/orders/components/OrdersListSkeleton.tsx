function SkeletonOrderRow() {
	return (
		<div className="flex flex-col gap-2 py-4">
			<div className="flex items-center justify-between">
				<div className="h-5 w-40 animate-pulse rounded-sm bg-surface-soft" />
				<div className="h-5 w-20 animate-pulse rounded-sm bg-surface-soft" />
			</div>
			<div className="flex items-center justify-between">
				<div className="h-4 w-32 animate-pulse rounded-sm bg-surface-soft" />
				<div className="h-5 w-24 animate-pulse rounded-sm bg-surface-soft" />
			</div>
		</div>
	);
}

function SkeletonDateGroup({ rowCount }: { rowCount: number }) {
	return (
		<div className="flex flex-col">
			<div className="flex items-center gap-3 pt-6 pb-2">
				<div className="h-3.5 w-28 animate-pulse rounded-sm bg-surface-strong" />
				<div className="flex-1 border-t border-hairline" />
			</div>
			<div className="flex flex-col divide-y divide-hairline">
				{(["a", "b", "c", "d", "e"] as const).slice(0, rowCount).map((key) => (
					<SkeletonOrderRow key={key} />
				))}
			</div>
		</div>
	);
}

export function OrdersListSkeleton() {
	return (
		<output aria-live="polite" className="flex flex-col px-4 pb-6">
			<span className="sr-only">Loading orders…</span>
			<SkeletonDateGroup rowCount={3} />
			<SkeletonDateGroup rowCount={2} />
			<SkeletonDateGroup rowCount={3} />
		</output>
	);
}
