interface DiscardDialogProps {
	onConfirm: () => void;
	onCancel: () => void;
}

export function DiscardDialog({ onConfirm, onCancel }: DiscardDialogProps) {
	return (
		<div
			role="dialog"
			aria-modal="true"
			aria-labelledby="discard-dialog-title"
			className="fixed inset-0 z-50 flex items-end bg-black/40"
			onClick={(e) => {
				if (e.target === e.currentTarget) onCancel();
			}}
			onKeyDown={(e) => {
				if (e.key === "Escape") onCancel();
			}}
		>
			<div className="w-full rounded-t-[16px] bg-canvas px-[16px] pb-[40px] pt-[24px]">
				<div className="mb-[4px] h-1 w-10 rounded-full bg-hairline mx-auto" />

				<h2
					id="discard-dialog-title"
					className="mt-[20px] font-sans text-title-lg font-semibold text-ink"
				>
					Discard order?
				</h2>
				<p className="mt-[8px] font-sans text-body-md text-body">
					All selections and quantities will be lost.
				</p>

				<div className="mt-[32px] flex flex-col gap-[12px]">
					<button
						type="button"
						onClick={onConfirm}
						className="flex h-[48px] w-full items-center justify-center rounded-lg font-sans text-button font-medium text-error"
					>
						Discard
					</button>
					<button
						type="button"
						onClick={onCancel}
						className="flex h-[48px] w-full items-center justify-center rounded-lg border border-hairline bg-canvas font-sans text-button font-medium text-ink active:bg-surface-soft"
					>
						Cancel
					</button>
				</div>
			</div>
		</div>
	);
}
