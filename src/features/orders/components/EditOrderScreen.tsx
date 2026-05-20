import { useMutation, useQuery } from "@tanstack/react-query";
import { Link, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { TopNav } from "#/features/dashboard/components/TopNav";
import { useTRPC } from "#/integrations/trpc/react";
import { authClient } from "#/lib/auth-client";
import { computeGrandTotal, decrement, increment } from "../utils/orderItems";
import { DiscardDialog } from "./DiscardDialog";
import { MedicineList } from "./MedicineList";
import { OrderSummaryBar } from "./OrderSummaryBar";
import { SearchableSelect, type SelectOption } from "./SearchableSelect";

interface EditOrderScreenProps {
	orderId: string;
}

type OrderItemInput = {
	medicineId: string;
	quantity: number;
	unitPrice: number;
};

export function EditOrderScreen({ orderId }: EditOrderScreenProps) {
	const trpc = useTRPC();
	const router = useRouter();

	const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);
	const [selectedPharmacyId, setSelectedPharmacyId] = useState<string | null>(
		null,
	);
	const [quantities, setQuantities] = useState<Map<string, number>>(new Map());
	const [initialized, setInitialized] = useState(false);
	const [showDiscardDialog, setShowDiscardDialog] = useState(false);

	const { data: session } = authClient.useSession();
	const {
		data: order,
		isPending: isOrderPending,
		isError: isOrderError,
	} = useQuery(trpc.orders.get.queryOptions({ id: orderId }));

	// Sync states with loaded order
	useEffect(() => {
		if (order && !initialized) {
			setSelectedRouteId(order.routeId);
			setSelectedPharmacyId(order.pharmacyId);
			const qMap = new Map<string, number>();
			for (const item of order.items) {
				qMap.set(item.medicineId, item.quantity);
			}
			setQuantities(qMap);
			setInitialized(true);
		}
	}, [order, initialized]);

	const assignedRoutes = useQuery(trpc.orders.getAssignedRoutes.queryOptions());
	const pharmaciesForRoute = useQuery(
		trpc.orders.getPharmaciesForRoute.queryOptions(
			{ routeId: selectedRouteId ?? "" },
			{ enabled: !!selectedRouteId },
		),
	);
	const assignedMedicines = useQuery(
		trpc.orders.getAssignedMedicines.queryOptions(),
	);

	const updateOrder = useMutation(trpc.orders.update.mutationOptions());

	const routeOptions: SelectOption[] =
		assignedRoutes.data?.map((r) => ({ id: r.id, label: r.routeName })) ?? [];

	const pharmacyOptions: SelectOption[] =
		pharmaciesForRoute.data?.map((p) => ({
			id: p.id,
			label: p.name,
			sublabel: p.address,
		})) ?? [];

	const medicines = assignedMedicines.data ?? [];

	const priceMap = new Map(medicines.map((m) => [m.id, Number(m.price)]));
	const grandTotal = computeGrandTotal(quantities, priceMap);

	const activeItems: OrderItemInput[] = [...quantities.entries()]
		.filter(([, qty]) => qty > 0)
		.map(([medicineId, quantity]) => {
			const medicine = medicines.find((m) => m.id === medicineId);
			return {
				medicineId,
				quantity,
				unitPrice: Number(medicine?.price ?? 0),
			};
		});

	const canSave =
		!!selectedRouteId && !!selectedPharmacyId && activeItems.length > 0;

	function handleRouteChange(routeId: string) {
		setSelectedRouteId(routeId);
		setSelectedPharmacyId(null);
		setQuantities(new Map());
	}

	function handleIncrement(medicineId: string) {
		setQuantities((prev) => increment(prev, medicineId));
	}

	function handleDecrement(medicineId: string) {
		setQuantities((prev) => decrement(prev, medicineId));
	}

	async function handleSave() {
		if (!selectedRouteId || !selectedPharmacyId || activeItems.length === 0)
			return;

		try {
			await updateOrder.mutateAsync({
				id: orderId,
				routeId: selectedRouteId,
				pharmacyId: selectedPharmacyId,
				items: activeItems,
			});
			router.navigate({ to: "/orders/$orderId", params: { orderId } });
		} catch {
			// isError is set reactively by TanStack Query
		}
	}

	function handleDiscardConfirm() {
		router.navigate({ to: "/orders/$orderId", params: { orderId } });
	}

	if (isOrderPending) {
		return (
			<div className="flex h-dvh flex-col bg-canvas">
				<TopNav
					role={(session?.user as { role?: string })?.role}
					backHref={`/orders/${orderId}`}
				/>
				<div className="flex flex-1 items-center justify-center">
					<div className="h-8 w-8 animate-pulse rounded-full bg-surface-strong" />
				</div>
			</div>
		);
	}

	if (isOrderError || !order) {
		return (
			<div className="flex h-dvh flex-col bg-canvas">
				<TopNav
					role={(session?.user as { role?: string })?.role}
					backHref="/orders"
				/>
				<div className="flex flex-1 flex-col items-center justify-center p-[16px]">
					<p className="font-sans text-body-md text-error">
						Failed to load order for editing.
					</p>
					<Link
						to="/orders"
						className="mt-4 font-sans text-body-md font-medium text-link"
					>
						Back to orders
					</Link>
				</div>
			</div>
		);
	}

	return (
		<div className="flex h-dvh flex-col bg-canvas">
			<TopNav
				role={(session?.user as { role?: string })?.role}
				backHref={`/orders/${orderId}`}
			/>

			<main className="flex flex-1 flex-col overflow-y-auto">
				<div className="flex flex-col gap-[16px] px-[16px] pb-[24px] pt-[24px]">
					<h1 className="font-sans text-display-md font-semibold text-ink">
						Edit Order
					</h1>

					<div className="flex flex-col gap-[16px]">
						<div className="flex flex-col gap-[6px]">
							<label
								htmlFor="route-select"
								className="font-sans text-label-md font-medium text-ink"
							>
								Route
							</label>
							<SearchableSelect
								id="route-select"
								options={routeOptions}
								value={selectedRouteId}
								onChange={handleRouteChange}
								placeholder="Select a route"
								isLoading={assignedRoutes.isPending}
							/>
						</div>

						<div className="flex flex-col gap-[6px]">
							<label
								htmlFor="pharmacy-select"
								className="font-sans text-label-md font-medium text-ink"
							>
								Pharmacy
							</label>
							<SearchableSelect
								id="pharmacy-select"
								options={pharmacyOptions}
								value={selectedPharmacyId}
								onChange={setSelectedPharmacyId}
								placeholder="Select a pharmacy"
								disabled={!selectedRouteId}
								isLoading={!!selectedRouteId && pharmaciesForRoute.isPending}
							/>
						</div>
					</div>
				</div>

				{selectedPharmacyId && medicines.length > 0 ? (
					<div className="px-[16px] pb-[24px]">
						<MedicineList
							medicines={medicines}
							quantities={quantities}
							onIncrement={handleIncrement}
							onDecrement={handleDecrement}
						/>
					</div>
				) : selectedPharmacyId && assignedMedicines.isPending ? (
					<div className="px-[16px]">
						<div className="h-32 animate-pulse rounded-md bg-signature-cream" />
					</div>
				) : selectedPharmacyId && medicines.length === 0 ? (
					<div className="px-[16px]">
						<p className="font-sans text-body-md text-muted">
							No medicines assigned to you.
						</p>
					</div>
				) : null}

				{updateOrder.isError ? (
					<p className="px-[16px] pb-[16px] font-sans text-body-md text-error">
						Failed to save order updates. Please try again.
					</p>
				) : null}
			</main>

			<OrderSummaryBar
				grandTotal={grandTotal}
				canSave={canSave}
				isSaving={updateOrder.isPending}
				onSave={handleSave}
				onDiscard={() => setShowDiscardDialog(true)}
			/>

			{showDiscardDialog ? (
				<DiscardDialog
					onConfirm={handleDiscardConfirm}
					onCancel={() => setShowDiscardDialog(false)}
				/>
			) : null}
		</div>
	);
}
