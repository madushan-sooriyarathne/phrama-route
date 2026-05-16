import { Minus, Plus } from "lucide-react";

export type MedicineItemData = {
	id: string;
	name: string;
	genericName: string | null;
	price: string;
	stockStatus: string;
};

interface MedicineItemProps {
	medicine: MedicineItemData;
	quantity: number;
	onIncrement: (medicineId: string) => void;
	onDecrement: (medicineId: string) => void;
}

export function MedicineItem({
	medicine,
	quantity,
	onIncrement,
	onDecrement,
}: MedicineItemProps) {
	const unitPrice = Number(medicine.price);
	const lineTotal = quantity * unitPrice;
	const outOfStock = medicine.stockStatus === "out_of_stock";

	return (
		<div className="flex items-center gap-[16px] px-[16px] py-[16px]">
			<div className="flex flex-1 flex-col gap-0.5 overflow-hidden">
				<p className="truncate font-sans text-label-md text-ink">
					{medicine.name}
				</p>
				{medicine.genericName ? (
					<p className="truncate font-sans text-body-md text-muted">
						{medicine.genericName}
					</p>
				) : null}
				<div className="flex items-baseline gap-2">
					<span className="font-display text-pricing-display text-ink">
						LKR{" "}
						{unitPrice.toLocaleString("en-LK", { minimumFractionDigits: 2 })}
					</span>
					{quantity > 0 ? (
						<span className="font-display text-body-md text-muted">
							× {quantity} ={" "}
							<span className="text-ink">
								LKR{" "}
								{lineTotal.toLocaleString("en-LK", {
									minimumFractionDigits: 2,
								})}
							</span>
						</span>
					) : null}
				</div>
				{outOfStock ? (
					<span className="font-sans text-body-md text-error">
						Out of stock
					</span>
				) : null}
			</div>

			<div className="flex shrink-0 items-center gap-3">
				<button
					type="button"
					onClick={() => onDecrement(medicine.id)}
					disabled={quantity === 0}
					aria-label={`Decrease quantity of ${medicine.name}`}
					className="flex h-[48px] w-[48px] items-center justify-center rounded-full border border-hairline bg-canvas text-ink transition-colors active:bg-surface-soft disabled:cursor-not-allowed disabled:text-muted"
				>
					<Minus size={18} strokeWidth={1.5} />
				</button>

				<span className="w-8 text-center font-display text-label-md text-ink">
					{quantity}
				</span>

				<button
					type="button"
					onClick={() => onIncrement(medicine.id)}
					disabled={outOfStock}
					aria-label={`Increase quantity of ${medicine.name}`}
					className="flex h-[48px] w-[48px] items-center justify-center rounded-full bg-primary text-on-primary transition-colors active:bg-primary-active disabled:cursor-not-allowed disabled:opacity-50"
				>
					<Plus size={18} strokeWidth={1.5} />
				</button>
			</div>
		</div>
	);
}
