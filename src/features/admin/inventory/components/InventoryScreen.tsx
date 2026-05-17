import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useTRPC } from "#/integrations/trpc/react";
import { AdminHeader } from "../../components/AdminHeader";
import { AssignRepsDialog } from "./AssignRepsDialog";
import {
	MedicineFormDialog,
	type MedicineFormMode,
} from "./MedicineFormDialog";
import { MedicineRow } from "./MedicineRow";

export function InventoryScreen() {
	const trpc = useTRPC();
	const qc = useQueryClient();

	const medicinesQuery = useQuery(trpc.admin.listMedicines.queryOptions());

	const [formMode, setFormMode] = useState<MedicineFormMode | null>(null);
	const [assignTarget, setAssignTarget] = useState<{
		id: string;
		name: string;
	} | null>(null);
	const [error, setError] = useState<string | null>(null);

	const invalidate = () =>
		qc.invalidateQueries({ queryKey: trpc.admin.listMedicines.queryKey() });

	const createMut = useMutation(
		trpc.admin.createMedicine.mutationOptions({
			onSuccess: () => {
				setFormMode(null);
				setError(null);
				invalidate();
			},
			onError: (e) => setError(e.message),
		}),
	);

	const updateMut = useMutation(
		trpc.admin.updateMedicine.mutationOptions({
			onSuccess: () => {
				setFormMode(null);
				setError(null);
				invalidate();
			},
			onError: (e) => setError(e.message),
		}),
	);

	const deleteMut = useMutation(
		trpc.admin.deleteMedicine.mutationOptions({
			onSuccess: () => invalidate(),
		}),
	);

	const handleSubmit = (data: {
		name: string;
		genericName: string | null;
		price: number;
		stockStatus: "in_stock" | "out_of_stock" | "low_stock";
	}) => {
		if (!formMode) return;
		if (formMode.kind === "create") {
			createMut.mutate({
				name: data.name,
				genericName: data.genericName ?? undefined,
				price: data.price,
				stockStatus: data.stockStatus,
			});
		} else {
			updateMut.mutate({
				id: formMode.medicine.id,
				name: data.name,
				genericName: data.genericName,
				price: data.price,
				stockStatus: data.stockStatus,
			});
		}
	};

	const handleDelete = (id: string, name: string) => {
		if (!window.confirm(`Delete ${name}? This cannot be undone.`)) return;
		deleteMut.mutate({ id });
	};

	return (
		<div className="flex h-dvh flex-col bg-canvas">
			<AdminHeader
				title="Inventory"
				actionLabel="Add medicine"
				onAction={() => {
					setError(null);
					setFormMode({ kind: "create" });
				}}
			/>

			<main className="flex flex-1 flex-col overflow-y-auto">
				{medicinesQuery.isPending ? (
					<div className="flex flex-col gap-2 p-4">
						{[1, 2, 3].map((i) => (
							<div
								key={i}
								className="h-16 animate-pulse rounded-md bg-surface-soft"
							/>
						))}
					</div>
				) : medicinesQuery.isError ? (
					<div className="px-4 py-8">
						<p className="font-sans text-body-md text-error">
							Failed to load medicines.
						</p>
					</div>
				) : medicinesQuery.data.length === 0 ? (
					<div className="px-4 py-16 text-center">
						<p className="font-sans text-body-md text-muted">
							No medicines yet.
						</p>
					</div>
				) : (
					<ul className="flex flex-col divide-y divide-hairline">
						{medicinesQuery.data.map((m) => (
							<MedicineRow
								key={m.id}
								medicine={m}
								onEdit={() => {
									setError(null);
									setFormMode({ kind: "edit", medicine: m });
								}}
								onAssign={() => setAssignTarget({ id: m.id, name: m.name })}
								onDelete={() => handleDelete(m.id, m.name)}
							/>
						))}
					</ul>
				)}
			</main>

			{formMode ? (
				<MedicineFormDialog
					mode={formMode}
					isSubmitting={createMut.isPending || updateMut.isPending}
					error={error}
					onSubmit={handleSubmit}
					onCancel={() => {
						setFormMode(null);
						setError(null);
					}}
				/>
			) : null}

			{assignTarget ? (
				<AssignRepsDialog
					medicineId={assignTarget.id}
					medicineName={assignTarget.name}
					onClose={() => setAssignTarget(null)}
				/>
			) : null}
		</div>
	);
}
