import { Pencil, Trash2, UserPlus } from "lucide-react";

const STOCK_LABELS: Record<string, { label: string; className: string }> = {
	in_stock: {
		label: "IN STOCK",
		className: "text-signature-forest",
	},
	low_stock: {
		label: "LOW",
		className: "text-signature-coral",
	},
	out_of_stock: {
		label: "OUT",
		className: "text-error",
	},
};

interface MedicineRowProps {
	medicine: {
		id: string;
		name: string;
		genericName: string | null;
		price: number;
		stockStatus: string;
	};
	onEdit: () => void;
	onAssign: () => void;
	onDelete: () => void;
}

export function MedicineRow({
	medicine,
	onEdit,
	onAssign,
	onDelete,
}: MedicineRowProps) {
	const stock = STOCK_LABELS[medicine.stockStatus] ?? STOCK_LABELS.in_stock;
	return (
		<li className="flex items-center gap-3 px-[16px] py-[12px]">
			<div className="flex flex-1 flex-col gap-0.5">
				<span className="font-sans text-label-md font-medium text-ink">
					{medicine.name}
				</span>
				{medicine.genericName ? (
					<span className="font-sans text-body-md text-muted">
						{medicine.genericName}
					</span>
				) : null}
				<div className="mt-1 flex items-center gap-2">
					<span className="font-display text-pricing-display text-ink">
						${medicine.price.toFixed(2)}
					</span>
					<span
						className={`font-sans text-[10px] font-medium uppercase tracking-widest ${stock.className}`}
					>
						{stock.label}
					</span>
				</div>
			</div>
			<button
				type="button"
				aria-label={`Assign reps for ${medicine.name}`}
				onClick={onAssign}
				className="flex h-9 w-9 items-center justify-center text-muted active:text-ink"
			>
				<UserPlus size={18} strokeWidth={1.5} />
			</button>
			<button
				type="button"
				aria-label={`Edit ${medicine.name}`}
				onClick={onEdit}
				className="flex h-9 w-9 items-center justify-center text-muted active:text-ink"
			>
				<Pencil size={18} strokeWidth={1.5} />
			</button>
			<button
				type="button"
				aria-label={`Delete ${medicine.name}`}
				onClick={onDelete}
				className="flex h-9 w-9 items-center justify-center text-muted active:text-error"
			>
				<Trash2 size={18} strokeWidth={1.5} />
			</button>
		</li>
	);
}
