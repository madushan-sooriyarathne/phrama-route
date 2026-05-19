import { Navigate } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { authClient } from "#/lib/auth-client";

interface AuthGuardProps {
	children: ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
	const { data: session, isPending } = authClient.useSession();

	if (isPending) {
		return (
			<div className="flex h-dvh items-center justify-center bg-canvas">
				<div className="h-8 w-8 animate-pulse rounded-full bg-surface-strong" />
			</div>
		);
	}

	if (!session?.user) {
		return <Navigate to="/auth/$pathname" params={{ pathname: "sign-in" }} />;
	}

	return <>{children}</>;
}
