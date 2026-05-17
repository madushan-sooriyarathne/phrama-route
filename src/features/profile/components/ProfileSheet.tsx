import { X } from "lucide-react";
import { useEffect } from "react";
import { authClient } from "#/lib/auth-client";
import type { UserRole } from "#/lib/role";
import { useProfileSheet } from "../context/ProfileSheetContext";
import { ProfileMenu } from "./ProfileMenu";

function getInitial(name: string | null | undefined): string {
	if (!name) return "U";
	return name.trim().charAt(0).toUpperCase() || "U";
}

export function ProfileSheet() {
	const { open, closeSheet } = useProfileSheet();
	const { data: session, isPending } = authClient.useSession();

	useEffect(() => {
		if (!open) return;
		const onKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") closeSheet();
		};
		document.addEventListener("keydown", onKey);
		document.body.style.overflow = "hidden";
		return () => {
			document.removeEventListener("keydown", onKey);
			document.body.style.overflow = "";
		};
	}, [open, closeSheet]);

	const user = session?.user;
	const role = (user as { role?: UserRole } | undefined)?.role;

	return (
		<div
			aria-hidden={!open}
			className={`fixed inset-0 z-50 ${open ? "pointer-events-auto" : "pointer-events-none"}`}
		>
			<button
				type="button"
				aria-label="Close profile menu"
				onClick={closeSheet}
				tabIndex={open ? 0 : -1}
				className={`absolute inset-0 bg-black/40 transition-opacity duration-200 ${
					open ? "opacity-100" : "opacity-0"
				}`}
			/>

			<aside
				role="dialog"
				aria-modal="true"
				aria-label="Profile"
				className={`absolute right-0 top-0 flex h-dvh w-[88vw] max-w-[360px] flex-col bg-canvas shadow-xl transition-transform duration-200 ease-out ${
					open ? "translate-x-0" : "translate-x-full"
				}`}
			>
				<header className="flex items-center justify-between border-b border-hairline px-[16px] py-[12px]">
					<span className="font-sans text-label-md font-semibold text-ink">
						Profile
					</span>
					<button
						type="button"
						aria-label="Close"
						onClick={closeSheet}
						className="flex h-10 w-10 items-center justify-center text-ink"
					>
						<X size={20} strokeWidth={1.5} />
					</button>
				</header>

				<section className="flex items-center gap-3 border-b border-hairline px-[16px] py-[20px]">
					{isPending ? (
						<>
							<div className="h-12 w-12 animate-pulse rounded-full bg-surface-strong" />
							<div className="flex flex-1 flex-col gap-2">
								<div className="h-4 w-32 animate-pulse rounded-sm bg-surface-strong" />
								<div className="h-3 w-44 animate-pulse rounded-sm bg-surface-soft" />
							</div>
						</>
					) : user ? (
						<>
							{user.image ? (
								<img
									src={user.image}
									alt=""
									className="h-12 w-12 rounded-full object-cover"
								/>
							) : (
								<div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-strong">
									<span className="font-sans text-label-md font-semibold text-ink">
										{getInitial(user.name)}
									</span>
								</div>
							)}
							<div className="flex flex-1 flex-col">
								<span className="font-sans text-label-md font-semibold text-ink">
									{user.name}
								</span>
								<span className="font-sans text-body-md text-muted">
									{user.email}
								</span>
							</div>
						</>
					) : (
						<span className="font-sans text-body-md text-muted">
							Not signed in
						</span>
					)}
				</section>

				<div className="flex flex-1 flex-col overflow-y-auto">
					<ProfileMenu role={role} onNavigate={closeSheet} />
				</div>
			</aside>
		</div>
	);
}
