import { Navigate } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { authClient } from "#/lib/auth-client";
import { isAdmin, type UserRole } from "#/lib/role";

interface AdminGuardProps {
	children: ReactNode;
}

export function AdminGuard({ children }: AdminGuardProps) {
	const { data: session, isPending } = authClient.useSession();

	if (isPending) {
		return (
			<div className="flex h-dvh items-center justify-center bg-canvas">
				<div className="h-8 w-8 animate-pulse rounded-full bg-surface-strong" />
			</div>
		);
	}

	const role = (session?.user as { role?: UserRole } | undefined)?.role;
	if (!isAdmin(role)) {
		return <Navigate to="/" />;
	}

	return <>{children}</>;
}
