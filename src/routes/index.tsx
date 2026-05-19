import { createFileRoute } from "@tanstack/react-router";
import { AuthGuard } from "#/features/auth/components/AuthGuard";
import { DashboardScreen } from "#/features/dashboard/components/DashboardScreen";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
	return (
		<AuthGuard>
			<DashboardScreen />
		</AuthGuard>
	);
}
