import { RedirectToSignIn, SignedIn } from "@neondatabase/auth-ui";
import { createFileRoute } from "@tanstack/react-router";
import { AdminGuard } from "#/features/admin/components/AdminGuard";
import { InventoryScreen } from "#/features/admin/inventory/components/InventoryScreen";

export const Route = createFileRoute("/admin/inventory")({
	component: AdminInventory,
});

function AdminInventory() {
	return (
		<>
			<SignedIn>
				<AdminGuard>
					<InventoryScreen />
				</AdminGuard>
			</SignedIn>
			<RedirectToSignIn />
		</>
	);
}
