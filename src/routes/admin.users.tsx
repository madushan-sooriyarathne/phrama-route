import { RedirectToSignIn, SignedIn } from "@neondatabase/auth-ui";
import { createFileRoute } from "@tanstack/react-router";
import { AdminGuard } from "#/features/admin/components/AdminGuard";
import { UsersScreen } from "#/features/admin/users/components/UsersScreen";

export const Route = createFileRoute("/admin/users")({ component: AdminUsers });

function AdminUsers() {
	return (
		<>
			<SignedIn>
				<AdminGuard>
					<UsersScreen />
				</AdminGuard>
			</SignedIn>
			<RedirectToSignIn />
		</>
	);
}
