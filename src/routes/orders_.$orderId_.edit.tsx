import { createFileRoute } from "@tanstack/react-router";
import { AuthGuard } from "#/features/auth/components/AuthGuard";
import { EditOrderScreen } from "#/features/orders/components/EditOrderScreen";

export const Route = createFileRoute("/orders_/$orderId_/edit")({
	component: EditOrderPage,
});

function EditOrderPage() {
	const { orderId } = Route.useParams();

	return (
		<AuthGuard>
			<EditOrderScreen orderId={orderId} />
		</AuthGuard>
	);
}
