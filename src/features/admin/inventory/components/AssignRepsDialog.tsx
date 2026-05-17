import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { useTRPC } from "#/integrations/trpc/react";

interface AssignRepsDialogProps {
	medicineId: string;
	medicineName: string;
	onClose: () => void;
}

export function AssignRepsDialog({
	medicineId,
	medicineName,
	onClose,
}: AssignRepsDialogProps) {
	const trpc = useTRPC();
	const qc = useQueryClient();

	const usersQuery = useQuery(trpc.admin.listUsers.queryOptions());
	const assignedQuery = useQuery(
		trpc.admin.listRepsForMedicine.queryOptions({ medicineId }),
	);

	const [selected, setSelected] = useState<Set<string>>(new Set());
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (assignedQuery.data) setSelected(new Set(assignedQuery.data));
	}, [assignedQuery.data]);

	useEffect(() => {
		const onKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") onClose();
		};
		document.addEventListener("keydown", onKey);
		return () => document.removeEventListener("keydown", onKey);
	}, [onClose]);

	const reps = useMemo(
		() => usersQuery.data?.filter((u) => u.role === "rep") ?? [],
		[usersQuery.data],
	);

	const assignMut = useMutation(
		trpc.admin.assignMedicineToReps.mutationOptions({
			onSuccess: () => {
				qc.invalidateQueries({
					queryKey: trpc.admin.listRepsForMedicine.queryKey({ medicineId }),
				});
				onClose();
			},
			onError: (e) => setError(e.message),
		}),
	);

	const toggle = (id: string) => {
		setSelected((prev) => {
			const next = new Set(prev);
			if (next.has(id)) next.delete(id);
			else next.add(id);
			return next;
		});
	};

	const handleSave = () => {
		assignMut.mutate({ medicineId, repIds: [...selected] });
	};

	return (
		<div
			role="dialog"
			aria-modal="true"
			aria-labelledby="assign-reps-title"
			className="fixed inset-0 z-50 flex items-end bg-black/40 sm:items-center sm:justify-center"
			onClick={(e) => {
				if (e.target === e.currentTarget) onClose();
			}}
			onKeyDown={(e) => {
				if (e.key === "Escape") onClose();
			}}
		>
			<div className="flex max-h-[80dvh] w-full max-w-md flex-col rounded-t-[16px] bg-canvas pt-[8px] sm:rounded-[16px]">
				<div className="mb-[4px] h-1 w-10 rounded-full bg-hairline mx-auto sm:hidden" />
				<div className="px-[16px] pt-[12px]">
					<h2
						id="assign-reps-title"
						className="font-sans text-title-lg font-semibold text-ink"
					>
						Assign reps
					</h2>
					<p className="mt-1 font-sans text-body-md text-muted">
						{medicineName}
					</p>
				</div>

				<div className="mt-[16px] flex-1 overflow-y-auto border-y border-hairline">
					{usersQuery.isPending || assignedQuery.isPending ? (
						<div className="flex flex-col gap-2 p-4">
							{[1, 2, 3].map((i) => (
								<div
									key={i}
									className="h-12 animate-pulse rounded-md bg-surface-soft"
								/>
							))}
						</div>
					) : reps.length === 0 ? (
						<p className="px-4 py-8 text-center font-sans text-body-md text-muted">
							No reps available.
						</p>
					) : (
						<ul className="flex flex-col divide-y divide-hairline">
							{reps.map((rep) => {
								const checked = selected.has(rep.id);
								return (
									<li key={rep.id}>
										<label className="flex h-[56px] items-center gap-3 px-[16px]">
											<input
												type="checkbox"
												checked={checked}
												onChange={() => toggle(rep.id)}
												className="h-5 w-5 accent-primary"
											/>
											<span className="flex flex-1 flex-col">
												<span className="font-sans text-label-md font-medium text-ink">
													{rep.name}
												</span>
												<span className="font-sans text-body-md text-muted">
													{rep.email}
												</span>
											</span>
										</label>
									</li>
								);
							})}
						</ul>
					)}
				</div>

				<div className="flex flex-col gap-[12px] p-[16px]">
					{error ? (
						<p className="font-sans text-body-md text-error">{error}</p>
					) : null}
					<button
						type="button"
						onClick={handleSave}
						disabled={assignMut.isPending}
						className="flex h-[48px] w-full items-center justify-center rounded-lg bg-primary font-sans text-button font-medium text-on-primary disabled:opacity-60"
					>
						{assignMut.isPending ? "Saving..." : "Save assignments"}
					</button>
					<button
						type="button"
						onClick={onClose}
						className="flex h-[48px] w-full items-center justify-center rounded-lg border border-hairline bg-canvas font-sans text-button font-medium text-ink active:bg-surface-soft"
					>
						Cancel
					</button>
				</div>
			</div>
		</div>
	);
}
