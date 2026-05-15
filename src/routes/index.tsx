import { RedirectToSignIn, SignedIn } from "@neondatabase/auth-ui";
import { createFileRoute } from "@tanstack/react-router";
import { DashboardScreen } from "#/features/dashboard/components/DashboardScreen";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
	return (
		<>
			<SignedIn>
				<DashboardScreen />
			</SignedIn>
			<RedirectToSignIn />
		</>
	);
}
