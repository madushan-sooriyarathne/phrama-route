import { StatusPill } from "./StatusPill";

type OrderStatus = "pending" | "completed" | "cancelled";

interface OrderRowProps {
	pharmacyName: string;
	amount: number;
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
	const date = new Date(isoString);
	const isToday = date.toDateString() === new Date().toDateString();
	const timeStr = date.toLocaleTimeString("en-US", {
		hour: "numeric",
		minute: "2-digit",
		hour12: true,
	});
	return isToday ? `Today, ${timeStr}` : date.toLocaleDateString("en-US");
}

export function OrderRow({
	pharmacyName,
	amount,
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
					{formatAmount(amount)}
				</span>
			</div>
			<div className="flex items-center justify-between">
				<span className="font-sans text-body-md text-muted">
					{formatTime(createdAt)}
				</span>
				<StatusPill status={status} />
			</div>
		</div>
	);
}
