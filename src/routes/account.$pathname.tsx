import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { authClient } from "#/lib/auth-client";

export const Route = createFileRoute("/account/$pathname")({
	component: Account,
});

function Account() {
	const navigate = useNavigate();
	const { data: session, isPending } = authClient.useSession();

	const handleSignOut = async () => {
		await authClient.signOut();
		await navigate({ to: "/auth/$pathname", params: { pathname: "sign-in" } });
	};

	if (isPending) {
		return (
			<div className="flex h-dvh items-center justify-center bg-canvas">
				<div className="h-8 w-8 animate-pulse rounded-full bg-surface-strong" />
			</div>
		);
	}

	const user = session?.user;

	return (
		<div className="flex min-h-dvh flex-col bg-canvas">
			<header className="flex items-center border-b border-hairline px-4 py-3">
				<h1 className="font-sans text-label-md font-semibold text-ink">
					Account settings
				</h1>
			</header>

			<main className="flex flex-col gap-6 p-4">
				{user && (
					<section className="flex flex-col gap-1">
						<span className="font-sans text-label-md font-semibold text-ink">
							{user.name}
						</span>
						<span className="font-sans text-body-md text-muted">
							{user.email}
						</span>
					</section>
				)}

				<button
					type="button"
					onClick={handleSignOut}
					className="h-11 rounded-md border border-hairline bg-canvas font-sans text-button font-medium text-ink active:bg-surface-soft"
				>
					Sign out
				</button>
			</main>
		</div>
	);
}
