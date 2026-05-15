import { Link } from "@tanstack/react-router";
import { OrderRow } from "./OrderRow";

type OrderStatus = "pending" | "completed" | "cancelled";

interface Order {
	id: string;
	pharmacyName: string;
	amount: number;
	createdAt: string;
	status: OrderStatus;
}

interface RecentOrdersSectionProps {
	orders: Order[];
}

export function RecentOrdersSection({ orders }: RecentOrdersSectionProps) {
	return (
		<section className="flex flex-col px-4">
			<div className="flex items-center justify-between pb-2">
				<h2 className="font-sans text-title-lg font-semibold text-ink">
					Recent Orders
				</h2>
				<Link
					to="/orders"
					className="font-sans text-body-md font-medium text-link"
				>
					View All
				</Link>
			</div>

			<div className="flex flex-col divide-y divide-hairline">
				{orders.length === 0 ? (
					<p className="py-6 font-sans text-body-md text-muted">
						No orders yet today.
					</p>
				) : (
					orders.map((order) => (
						<OrderRow
							key={order.id}
							pharmacyName={order.pharmacyName}
							amount={order.amount}
							createdAt={order.createdAt}
							status={order.status}
						/>
					))
				)}
			</div>
		</section>
	);
}
