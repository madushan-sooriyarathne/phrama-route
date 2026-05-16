import { MedicineItem, type MedicineItemData } from "./MedicineItem";

interface MedicineListProps {
	medicines: MedicineItemData[];
	quantities: Map<string, number>;
	onIncrement: (medicineId: string) => void;
	onDecrement: (medicineId: string) => void;
}

export function MedicineList({
	medicines,
	quantities,
	onIncrement,
	onDecrement,
}: MedicineListProps) {
	return (
		<section aria-label="Available medicines">
			<p className="px-[16px] pb-[8px] pt-[24px] font-sans text-body-md font-medium uppercase tracking-widest text-muted">
				Medicines
			</p>
			<div className="rounded-md bg-signature-cream">
				{medicines.map((medicine, index) => (
					<div key={medicine.id}>
						{index > 0 ? <div className="mx-[16px] h-px bg-hairline" /> : null}
						<MedicineItem
							medicine={medicine}
							quantity={quantities.get(medicine.id) ?? 0}
							onIncrement={onIncrement}
							onDecrement={onDecrement}
						/>
					</div>
				))}
			</div>
		</section>
	);
}
