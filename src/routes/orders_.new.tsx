import { RedirectToSignIn, SignedIn } from "@neondatabase/auth-ui";
import { createFileRoute } from "@tanstack/react-router";
import { NewOrderScreen } from "#/features/orders/components/NewOrderScreen";

export const Route = createFileRoute("/orders_/new")({
	component: NewOrderPage,
});

function NewOrderPage() {
	return (
		<>
			<SignedIn>
				<NewOrderScreen />
			</SignedIn>
			<RedirectToSignIn />
		</>
	);
}
