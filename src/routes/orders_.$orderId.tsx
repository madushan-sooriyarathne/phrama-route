import { createFileRoute } from "@tanstack/react-router";
import { AuthGuard } from "#/features/auth/components/AuthGuard";
import { OrderDetailsScreen } from "#/features/orders/components/OrderDetailsScreen";

export const Route = createFileRoute("/orders_/$orderId")({
	component: OrderDetailsPage,
});

function OrderDetailsPage() {
	const { orderId } = Route.useParams();

	return (
		<AuthGuard>
			<OrderDetailsScreen orderId={orderId} />
		</AuthGuard>
	);
}
