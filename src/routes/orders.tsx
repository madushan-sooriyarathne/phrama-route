import { RedirectToSignIn, SignedIn } from "@neondatabase/auth-ui";
import { createFileRoute } from "@tanstack/react-router";
import { OrdersScreen } from "#/features/orders/components/OrdersScreen";

export const Route = createFileRoute("/orders")({ component: OrdersPage });

function OrdersPage() {
	return (
		<>
			<SignedIn>
				<OrdersScreen />
			</SignedIn>
			<RedirectToSignIn />
		</>
	);
}
