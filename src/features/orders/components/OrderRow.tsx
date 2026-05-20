import { Link } from "@tanstack/react-router";
import { StatusPill } from "#/features/dashboard/components/StatusPill";
import type { OrderStatus } from "../utils/groupOrdersByDate";

interface OrderRowProps {
	id: string;
	displayId: string;
	pharmacyName: string;
	totalAmount: number;
	createdAt: string;
	status: OrderStatus;
}

function formatAmount(amount: number): string {
	return `LKR ${amount.toLocaleString("en-LK", { minimumFractionDigits: 2 })}`;
}

function formatTime(isoString: string): string {
	return new Date(isoString).toLocaleTimeString("en-US", {
		hour: "numeric",
		minute: "2-digit",
		hour12: true,
	});
}

export function OrderRow({
	id,
	displayId,
	pharmacyName,
	totalAmount,
	createdAt,
	status,
}: OrderRowProps) {
	return (
		<Link
			to="/orders/$orderId"
			params={{ orderId: id }}
			className="flex flex-col gap-2 py-4 hover:bg-surface-soft/50 active:bg-surface-soft rounded-md transition-colors px-2 -mx-2 block"
		>
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
		</Link>
	);
}
