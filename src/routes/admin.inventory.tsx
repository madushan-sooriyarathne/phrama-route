import { createFileRoute } from "@tanstack/react-router";
import { AdminGuard } from "#/features/admin/components/AdminGuard";
import { InventoryScreen } from "#/features/admin/inventory/components/InventoryScreen";
import { AuthGuard } from "#/features/auth/components/AuthGuard";

export const Route = createFileRoute("/admin/inventory")({
	component: AdminInventory,
});

function AdminInventory() {
	return (
		<AuthGuard>
			<AdminGuard>
				<InventoryScreen />
			</AdminGuard>
		</AuthGuard>
	);
}
