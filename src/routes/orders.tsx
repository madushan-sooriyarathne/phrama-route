import { createFileRoute } from "@tanstack/react-router";
import { AuthGuard } from "#/features/auth/components/AuthGuard";
import { OrdersScreen } from "#/features/orders/components/OrdersScreen";

export const Route = createFileRoute("/orders")({ component: OrdersPage });

function OrdersPage() {
	return (
		<AuthGuard>
			<OrdersScreen />
		</AuthGuard>
	);
}
