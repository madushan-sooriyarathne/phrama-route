import { AuthView } from "@neondatabase/auth-ui";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/auth/$pathname")({
	component: Auth,
});

function Auth() {
	const { pathname } = Route.useParams();
	return (
		<div className="flex justify-center items-center min-h-screen">
			<AuthView pathname={pathname} />
		</div>
	);
}
