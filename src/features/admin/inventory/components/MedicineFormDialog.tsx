import { useEffect, useState } from "react";

type StockStatus = "in_stock" | "out_of_stock" | "low_stock";

export type MedicineFormMode =
	| { kind: "create" }
	| {
			kind: "edit";
			medicine: {
				id: string;
				name: string;
				genericName: string | null;
				price: number;
				stockStatus: string;
			};
	  };

interface MedicineFormDialogProps {
	mode: MedicineFormMode;
	isSubmitting: boolean;
	error: string | null;
	onSubmit: (data: {
		name: string;
		genericName: string | null;
		price: number;
		stockStatus: StockStatus;
	}) => void;
	onCancel: () => void;
}

const STOCK_OPTIONS: { value: StockStatus; label: string }[] = [
	{ value: "in_stock", label: "In stock" },
	{ value: "low_stock", label: "Low stock" },
	{ value: "out_of_stock", label: "Out of stock" },
];

export function MedicineFormDialog({
	mode,
	isSubmitting,
	error,
	onSubmit,
	onCancel,
}: MedicineFormDialogProps) {
	const isEdit = mode.kind === "edit";
	const [name, setName] = useState(isEdit ? mode.medicine.name : "");
	const [genericName, setGenericName] = useState(
		isEdit ? (mode.medicine.genericName ?? "") : "",
	);
	const [price, setPrice] = useState(isEdit ? String(mode.medicine.price) : "");
	const [stockStatus, setStockStatus] = useState<StockStatus>(
		isEdit
			? ((mode.medicine.stockStatus as StockStatus) ?? "in_stock")
			: "in_stock",
	);

	useEffect(() => {
		const onKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") onCancel();
		};
		document.addEventListener("keydown", onKey);
		return () => document.removeEventListener("keydown", onKey);
	}, [onCancel]);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		const numericPrice = Number(price);
		if (!Number.isFinite(numericPrice) || numericPrice <= 0) return;
		onSubmit({
			name: name.trim(),
			genericName: genericName.trim() || null,
			price: numericPrice,
			stockStatus,
		});
	};

	return (
		<div
			role="dialog"
			aria-modal="true"
			aria-labelledby="medicine-form-title"
			className="fixed inset-0 z-50 flex items-end bg-black/40 sm:items-center sm:justify-center"
			onClick={(e) => {
				if (e.target === e.currentTarget) onCancel();
			}}
			onKeyDown={(e) => {
				if (e.key === "Escape") onCancel();
			}}
		>
			<form
				onSubmit={handleSubmit}
				className="w-full max-w-md rounded-t-[16px] bg-canvas px-[16px] pb-[24px] pt-[24px] sm:rounded-[16px]"
			>
				<div className="mb-[4px] h-1 w-10 rounded-full bg-hairline mx-auto sm:hidden" />
				<h2
					id="medicine-form-title"
					className="mt-[12px] font-sans text-title-lg font-semibold text-ink"
				>
					{isEdit ? "Edit medicine" : "Add medicine"}
				</h2>

				<div className="mt-[24px] flex flex-col gap-[16px]">
					<label className="flex flex-col gap-1">
						<span className="font-sans text-body-md font-medium text-ink">
							Name
						</span>
						<input
							type="text"
							value={name}
							onChange={(e) => setName(e.target.value)}
							required
							className="h-[44px] rounded-md border border-hairline bg-canvas px-3 font-sans text-label-md text-ink"
						/>
					</label>

					<label className="flex flex-col gap-1">
						<span className="font-sans text-body-md font-medium text-ink">
							Generic name (optional)
						</span>
						<input
							type="text"
							value={genericName}
							onChange={(e) => setGenericName(e.target.value)}
							className="h-[44px] rounded-md border border-hairline bg-canvas px-3 font-sans text-label-md text-ink"
						/>
					</label>

					<label className="flex flex-col gap-1">
						<span className="font-sans text-body-md font-medium text-ink">
							Price
						</span>
						<input
							type="number"
							step="0.01"
							min="0.01"
							value={price}
							onChange={(e) => setPrice(e.target.value)}
							required
							className="h-[44px] rounded-md border border-hairline bg-canvas px-3 font-display text-label-md text-ink"
						/>
					</label>

					<label className="flex flex-col gap-1">
						<span className="font-sans text-body-md font-medium text-ink">
							Stock status
						</span>
						<select
							value={stockStatus}
							onChange={(e) => setStockStatus(e.target.value as StockStatus)}
							className="h-[44px] rounded-md border border-hairline bg-canvas px-3 font-sans text-label-md text-ink"
						>
							{STOCK_OPTIONS.map((o) => (
								<option key={o.value} value={o.value}>
									{o.label}
								</option>
							))}
						</select>
					</label>

					{error ? (
						<p className="font-sans text-body-md text-error">{error}</p>
					) : null}
				</div>

				<div className="mt-[24px] flex flex-col gap-[12px]">
					<button
						type="submit"
						disabled={isSubmitting}
						className="flex h-[48px] w-full items-center justify-center rounded-lg bg-primary font-sans text-button font-medium text-on-primary disabled:opacity-60"
					>
						{isSubmitting
							? "Saving..."
							: isEdit
								? "Save changes"
								: "Add medicine"}
					</button>
					<button
						type="button"
						onClick={onCancel}
						className="flex h-[48px] w-full items-center justify-center rounded-lg border border-hairline bg-canvas font-sans text-button font-medium text-ink active:bg-surface-soft"
					>
						Cancel
					</button>
				</div>
			</form>
		</div>
	);
}
