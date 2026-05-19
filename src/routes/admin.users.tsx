import { createFileRoute } from "@tanstack/react-router";
import { AdminGuard } from "#/features/admin/components/AdminGuard";
import { UsersScreen } from "#/features/admin/users/components/UsersScreen";
import { AuthGuard } from "#/features/auth/components/AuthGuard";

export const Route = createFileRoute("/admin/users")({ component: AdminUsers });

function AdminUsers() {
	return (
		<AuthGuard>
			<AdminGuard>
				<UsersScreen />
			</AdminGuard>
		</AuthGuard>
	);
}
