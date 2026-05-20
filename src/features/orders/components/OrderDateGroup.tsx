import type { DateGroup } from "../utils/groupOrdersByDate";
import { OrderRow } from "./OrderRow";

interface OrderDateGroupProps {
	group: DateGroup;
}

export function OrderDateGroup({ group }: OrderDateGroupProps) {
	return (
		<div className="flex flex-col">
			<div className="flex items-center gap-3 pt-6 pb-2">
				<span className="shrink-0 font-sans text-body-md font-medium tracking-widest text-muted">
					{group.dateLabel}
				</span>
				<hr className="flex-1 border-t border-hairline" />
			</div>
			<div className="flex flex-col divide-y divide-hairline">
				{group.orders.map((order) => (
					<OrderRow
						key={order.id}
						id={order.id}
						displayId={order.displayId}
						pharmacyName={order.pharmacyName}
						totalAmount={order.totalAmount}
						createdAt={order.createdAt}
						status={order.status}
					/>
				))}
			</div>
		</div>
	);
}
