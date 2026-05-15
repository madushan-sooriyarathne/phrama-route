import { AccountView } from "@neondatabase/auth-ui";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/account/$pathname")({
	component: Account,
});

function Account() {
	const { pathname } = Route.useParams();
	return (
		<div className="flex justify-center items-center min-h-screen">
			<AccountView pathname={pathname} />
		</div>
	);
}
