import { useMutation, useQuery } from "@tanstack/react-query";
import { Link, useRouter } from "@tanstack/react-router";
import { Edit, Printer, Trash } from "lucide-react";
import { useState } from "react";
import { StatusPill } from "#/features/dashboard/components/StatusPill";
import { TopNav } from "#/features/dashboard/components/TopNav";
import { useTRPC } from "#/integrations/trpc/react";
import { authClient } from "#/lib/auth-client";
import { DeleteOrderDialog } from "./DeleteOrderDialog";

interface OrderDetailsScreenProps {
	orderId: string;
}

function formatAmount(amount: number): string {
	return `LKR ${amount.toLocaleString("en-LK", { minimumFractionDigits: 2 })}`;
}

export function OrderDetailsScreen({ orderId }: OrderDetailsScreenProps) {
	const trpc = useTRPC();
	const router = useRouter();
	const [showDeleteDialog, setShowDeleteDialog] = useState(false);

	const { data: session } = authClient.useSession();
	const {
		data: order,
		isPending,
		isError,
	} = useQuery(trpc.orders.get.queryOptions({ id: orderId }));

	const deleteOrder = useMutation(trpc.orders.delete.mutationOptions());

	async function handleDeleteConfirm() {
		try {
			await deleteOrder.mutateAsync({ id: orderId });
			router.navigate({ to: "/orders" });
		} catch {
			// error state is handled by query
		}
	}

	if (isPending) {
		return (
			<div className="flex h-dvh flex-col bg-canvas">
				<TopNav
					role={(session?.user as { role?: string })?.role}
					backHref="/orders"
				/>
				<div className="flex flex-1 items-center justify-center">
					<div className="h-8 w-8 animate-pulse rounded-full bg-surface-strong" />
				</div>
			</div>
		);
	}

	if (isError || !order) {
		return (
			<div className="flex h-dvh flex-col bg-canvas">
				<TopNav
					role={(session?.user as { role?: string })?.role}
					backHref="/orders"
				/>
				<div className="flex flex-1 flex-col items-center justify-center p-[16px]">
					<p className="font-sans text-body-md text-error">
						Failed to load order details.
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

	const orderDate = new Date(order.createdAt);
	const dateString = orderDate.toLocaleDateString("en-US", {
		weekday: "long",
		year: "numeric",
		month: "long",
		day: "numeric",
	});
	const timeString = orderDate.toLocaleTimeString("en-US", {
		hour: "numeric",
		minute: "2-digit",
		hour12: true,
	});

	return (
		<div className="flex h-dvh flex-col bg-canvas print:h-auto print:bg-white">
			{/* Header - Hidden on print */}
			<div className="print:hidden">
				<TopNav
					role={(session?.user as { role?: string })?.role}
					backHref="/orders"
				/>
			</div>

			<main className="flex flex-1 flex-col overflow-y-auto p-[16px] print:overflow-visible print:p-0">
				<div className="flex flex-col gap-[24px] pb-[40px] print:gap-[16px]">
					{/* Order Title & Status */}
					<div className="flex items-center justify-between border-b border-hairline pb-[16px]">
						<div>
							<h1 className="font-sans text-display-md font-semibold text-ink print:text-title-lg">
								{order.displayId}
							</h1>
							<p className="font-sans text-body-md text-muted">
								Placed on {dateString} at {timeString}
							</p>
						</div>
						<StatusPill status={order.status} />
					</div>

					{/* Metadata Cards */}
					<div className="grid grid-cols-1 gap-[16px] md:grid-cols-2 print:grid-cols-2">
						<div className="rounded-lg border border-hairline bg-canvas p-[16px] print:border-none print:p-0">
							<h3 className="font-sans text-body-md font-medium tracking-wider text-muted uppercase">
								Pharmacy
							</h3>
							<p className="mt-1 font-sans text-label-md font-semibold text-ink">
								{order.pharmacyName}
							</p>
							<p className="mt-1 font-sans text-body-md text-body">
								{order.pharmacyAddress}
							</p>
						</div>

						<div className="rounded-lg border border-hairline bg-canvas p-[16px] print:border-none print:p-0">
							<h3 className="font-sans text-body-md font-medium tracking-wider text-muted uppercase">
								Logistics & Route
							</h3>
							<p className="mt-1 font-sans text-label-md font-semibold text-ink">
								{order.routeName}
							</p>
							<p className="mt-1 font-sans text-body-md text-body">
								Representative: {order.repName}
							</p>
						</div>
					</div>

					{/* Order Items Table */}
					<div>
						<h3 className="mb-[12px] font-sans text-body-md font-medium tracking-wider text-muted uppercase">
							Medicines Ordered
						</h3>
						<div className="overflow-hidden rounded-lg border border-hairline print:border-none print:rounded-none">
							<table className="w-full border-collapse text-left">
								<thead>
									<tr className="border-b border-hairline bg-surface-soft bg-opacity-50 font-sans text-body-md font-medium text-muted print:bg-transparent">
										<th className="p-[12px] print:px-0">Item</th>
										<th className="p-[12px] text-right print:px-0">Price</th>
										<th className="p-[12px] text-center print:px-0">Qty</th>
										<th className="p-[12px] text-right print:px-0">Total</th>
									</tr>
								</thead>
								<tbody className="divide-y divide-hairline font-sans text-body-md text-ink">
									{order.items.map((item) => (
										<tr
											key={item.id}
											className="print:break-inside-avoid print:border-b print:border-hairline"
										>
											<td className="p-[12px] print:px-0 print:py-2">
												<p className="font-medium">{item.medicineName}</p>
												{item.genericName && (
													<p className="text-body-md text-muted">
														{item.genericName}
													</p>
												)}
											</td>
											<td className="p-[12px] text-right font-display print:px-0 print:py-2">
												{formatAmount(item.unitPrice)}
											</td>
											<td className="p-[12px] text-center font-display print:px-0 print:py-2">
												{item.quantity}
											</td>
											<td className="p-[12px] text-right font-display font-medium print:px-0 print:py-2">
												{formatAmount(item.lineTotal)}
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>

					{/* Grand Total */}
					<div className="flex justify-end rounded-lg bg-surface-soft p-[16px] print:bg-transparent print:p-0 print:border-t print:border-hairline print:pt-4">
						<div className="flex items-center gap-[24px]">
							<span className="font-sans text-label-md font-semibold text-ink uppercase">
								Grand Total
							</span>
							<span className="font-display text-total-sum font-bold text-ink">
								{formatAmount(order.totalAmount)}
							</span>
						</div>
					</div>

					{/* Print & Action Buttons - Hidden on print */}
					<div className="mt-[16px] flex flex-col gap-[12px] print:hidden">
						<button
							type="button"
							onClick={() => window.print()}
							className="flex h-[48px] w-full items-center justify-center gap-2 rounded-lg border border-hairline bg-canvas font-sans text-button font-medium text-ink active:bg-surface-soft"
						>
							<Printer size={18} strokeWidth={1.5} />
							Print Order / PDF
						</button>

						<div className="flex gap-[12px]">
							<Link
								to="/orders/$orderId/edit"
								params={{ orderId: orderId }}
								className="flex h-[48px] flex-1 items-center justify-center gap-2 rounded-lg border border-hairline bg-canvas font-sans text-button font-medium text-ink active:bg-surface-soft"
							>
								<Edit size={18} strokeWidth={1.5} />
								Edit Order
							</Link>

							<button
								type="button"
								onClick={() => setShowDeleteDialog(true)}
								className="flex h-[48px] flex-1 items-center justify-center gap-2 rounded-lg border border-hairline bg-canvas font-sans text-button font-medium text-error active:bg-error/5"
							>
								<Trash size={18} strokeWidth={1.5} />
								Delete Order
							</button>
						</div>
					</div>
				</div>
			</main>

			{/* Delete Confirmation Dialog */}
			{showDeleteDialog && (
				<DeleteOrderDialog
					onConfirm={handleDeleteConfirm}
					onCancel={() => setShowDeleteDialog(false)}
					isDeleting={deleteOrder.isPending}
				/>
			)}
		</div>
	);
}
