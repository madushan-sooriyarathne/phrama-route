import { createFileRoute } from "@tanstack/react-router";
import { AuthGuard } from "#/features/auth/components/AuthGuard";
import { NewOrderScreen } from "#/features/orders/components/NewOrderScreen";

export const Route = createFileRoute("/orders_/new")({
	component: NewOrderPage,
});

function NewOrderPage() {
	return (
		<AuthGuard>
			<NewOrderScreen />
		</AuthGuard>
	);
}
