interface DeleteOrderDialogProps {
	onConfirm: () => void;
	onCancel: () => void;
	isDeleting?: boolean;
}

export function DeleteOrderDialog({
	onConfirm,
	onCancel,
	isDeleting = false,
}: DeleteOrderDialogProps) {
	return (
		<div
			role="dialog"
			aria-modal="true"
			aria-labelledby="delete-dialog-title"
			className="fixed inset-0 z-50 flex items-end bg-black/40"
			onClick={(e) => {
				if (e.target === e.currentTarget && !isDeleting) onCancel();
			}}
			onKeyDown={(e) => {
				if (e.key === "Escape" && !isDeleting) onCancel();
			}}
		>
			<div className="w-full rounded-t-[16px] bg-canvas px-[16px] pb-[40px] pt-[24px]">
				<div className="mb-[4px] h-1 w-10 rounded-full bg-hairline mx-auto" />

				<h2
					id="delete-dialog-title"
					className="mt-[20px] font-sans text-title-lg font-semibold text-ink"
				>
					Delete order?
				</h2>
				<p className="mt-[8px] font-sans text-body-md text-body">
					This action cannot be undone. All details and records of this order
					will be permanently deleted.
				</p>

				<div className="mt-[32px] flex flex-col gap-[12px]">
					<button
						type="button"
						onClick={onConfirm}
						disabled={isDeleting}
						className="flex h-[48px] w-full items-center justify-center rounded-lg font-sans text-button font-medium text-error active:bg-error/10 disabled:opacity-50"
					>
						{isDeleting ? "Deleting..." : "Delete Order"}
					</button>
					<button
						type="button"
						onClick={onCancel}
						disabled={isDeleting}
						className="flex h-[48px] w-full items-center justify-center rounded-lg border border-hairline bg-canvas font-sans text-button font-medium text-ink active:bg-surface-soft disabled:opacity-50"
					>
						Cancel
					</button>
				</div>
			</div>
		</div>
	);
}
