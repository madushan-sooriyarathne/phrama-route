import { StatusPill } from "#/features/dashboard/components/StatusPill";
import type { OrderStatus } from "../utils/groupOrdersByDate";

interface OrderRowProps {
	displayId: string;
	pharmacyName: string;
	totalAmount: number;
	createdAt: string;
	status: OrderStatus;
}

function formatAmount(amount: number): string {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
	}).format(amount);
}

function formatTime(isoString: string): string {
	return new Date(isoString).toLocaleTimeString("en-US", {
		hour: "numeric",
		minute: "2-digit",
		hour12: true,
	});
}

export function OrderRow({
	displayId,
	pharmacyName,
	totalAmount,
	createdAt,
	status,
}: OrderRowProps) {
	return (
		<div className="flex flex-col gap-2 py-4">
			<div className="flex items-center justify-between">
				<span className="font-sans text-label-md font-semibold text-ink">
					{pharmacyName}
				</span>
				<span className="font-display text-label-md font-semibold text-ink">
					{formatAmount(totalAmount)}
				</span>
			</div>
			<div className="flex items-center justify-between">
				<span className="font-sans text-body-md text-muted">
					{formatTime(createdAt)} · {displayId}
				</span>
				<StatusPill status={status} />
			</div>
		</div>
	);
}
