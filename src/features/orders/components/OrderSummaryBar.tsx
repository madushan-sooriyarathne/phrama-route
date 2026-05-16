interface OrderSummaryBarProps {
	grandTotal: number;
	canSave: boolean;
	isSaving: boolean;
	onSave: () => void;
	onDiscard: () => void;
}

export function OrderSummaryBar({
	grandTotal,
	canSave,
	isSaving,
	onSave,
	onDiscard,
}: OrderSummaryBarProps) {
	return (
		<div className="shrink-0 border-t border-hairline bg-primary px-[16px] pb-[32px] pt-[16px] shadow-[0_-4px_16px_rgba(0,0,0,0.08)]">
			<div className="flex items-center justify-between gap-4">
				<div className="flex flex-col">
					<span className="font-sans text-body-md text-on-primary/60">
						Total
					</span>
					<span className="font-display text-total-sum font-semibold text-on-primary">
						LKR{" "}
						{grandTotal.toLocaleString("en-LK", { minimumFractionDigits: 2 })}
					</span>
				</div>

				<div className="flex items-center gap-[12px]">
					<button
						type="button"
						onClick={onDiscard}
						disabled={isSaving}
						className="flex h-[48px] items-center justify-center rounded-lg border border-on-primary/30 px-5 font-sans text-button font-medium text-on-primary active:border-on-primary/60 disabled:opacity-50"
					>
						Discard
					</button>
					<button
						type="button"
						onClick={onSave}
						disabled={!canSave || isSaving}
						className="flex h-[48px] items-center justify-center rounded-lg bg-on-primary px-5 font-sans text-button font-medium text-primary active:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
					>
						{isSaving ? "Saving…" : "Save Order"}
					</button>
				</div>
			</div>
		</div>
	);
}
