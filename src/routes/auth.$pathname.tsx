import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { authClient } from "#/lib/auth-client";

export const Route = createFileRoute("/auth/$pathname")({
	component: Auth,
});

function PharmaRouteLogo({ dark = false }: { dark?: boolean }) {
	return (
		<div className="flex flex-col gap-1">
			<span
				className={`font-sans text-label-md font-medium tracking-widest uppercase ${dark ? "text-on-primary/60" : "text-muted"}`}
			>
				PharmaRoute
			</span>
			<div
				className="w-8 h-px"
				style={{
					backgroundColor: dark
						? "rgba(255,255,255,0.2)"
						: "var(--color-hairline)",
				}}
			/>
		</div>
	);
}

function BrandPanel() {
	return (
		<aside
			className="hidden lg:flex lg:w-1/2 shrink-0 flex-col justify-between bg-primary text-on-primary p-16 relative overflow-hidden"
			aria-hidden="true"
		>
			<div className="absolute bottom-0 right-0 w-96 h-96 rounded-full opacity-5 bg-on-primary translate-x-1/2 translate-y-1/2" />
			<div className="absolute bottom-32 right-32 w-48 h-48 rounded-full opacity-5 bg-on-primary" />
			<PharmaRouteLogo dark />
			<div className="flex flex-col gap-6 relative z-10">
				<h1 className="font-sans text-display-md font-normal leading-tight text-on-primary max-w-xs">
					Close more.{" "}
					<span className="text-on-primary/60">Travel smarter.</span>
				</h1>
				<p className="font-sans text-body-md text-on-primary/50 max-w-sm leading-relaxed">
					Your complete field sales platform. Manage routes, pharmacies, and
					orders — all from one place.
				</p>
			</div>
			<div className="relative z-10">
				<p className="font-sans text-body-md text-on-primary/30">
					© 2025 PharmaRoute
				</p>
			</div>
		</aside>
	);
}

function SignInForm() {
	const navigate = useNavigate();
	const [error, setError] = useState<string | null>(null);
	const [pending, setPending] = useState(false);
	const emailRef = useRef<HTMLInputElement>(null);
	const passwordRef = useRef<HTMLInputElement>(null);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);
		setPending(true);

		try {
			const email = emailRef.current?.value ?? "";
			const password = passwordRef.current?.value ?? "";

			const { error: authError } = await authClient.signIn.email({
				email,
				password,
			});

			if (authError) {
				setError(
					authError.message ?? "Sign-in failed. Check your credentials.",
				);
				return;
			}

			await navigate({ to: "/" });
		} catch {
			setError("Unable to reach the server. Please try again.");
		} finally {
			setPending(false);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="flex flex-col gap-5">
			<div className="flex flex-col gap-1">
				<h2 className="font-sans text-title-lg font-semibold text-ink">
					Sign in
				</h2>
				<p className="font-sans text-body-md text-muted">
					Enter your credentials to access PharmaRoute.
				</p>
			</div>

			{error && (
				<p
					role="alert"
					className="font-sans text-body-md text-error bg-error/5 border border-error/20 rounded-md px-3 py-2"
				>
					{error}
				</p>
			)}

			<div className="flex flex-col gap-3">
				<label className="flex flex-col gap-1.5">
					<span className="font-sans text-body-md font-medium text-ink">
						Email
					</span>
					<input
						ref={emailRef}
						type="email"
						required
						autoComplete="email"
						placeholder="you@example.com"
						className="h-11 rounded-md border border-hairline bg-canvas px-3 font-sans text-body-md text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
					/>
				</label>

				<label className="flex flex-col gap-1.5">
					<span className="font-sans text-body-md font-medium text-ink">
						Password
					</span>
					<input
						ref={passwordRef}
						type="password"
						required
						autoComplete="current-password"
						placeholder="••••••••"
						className="h-11 rounded-md border border-hairline bg-canvas px-3 font-sans text-body-md text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
					/>
				</label>
			</div>

			<button
				type="submit"
				disabled={pending}
				className="h-11 rounded-md bg-primary font-sans text-button font-medium text-on-primary transition-colors active:bg-primary-active disabled:opacity-50"
			>
				{pending ? "Signing in…" : "Sign in"}
			</button>
		</form>
	);
}

function Auth() {
	return (
		<div className="flex h-dvh bg-canvas overflow-hidden">
			<BrandPanel />
			<main className="flex flex-1 flex-col items-center justify-center px-4 overflow-y-auto lg:px-16">
				<div
					className="w-full max-w-sm"
					style={{
						animationName: "fadeIn",
						animationDuration: "200ms",
						animationTimingFunction: "ease-out",
						animationFillMode: "both",
					}}
				>
					<div className="lg:hidden mb-10">
						<PharmaRouteLogo />
						<p className="mt-4 font-sans text-body-md text-muted">
							Your field, optimised.
						</p>
					</div>

					<SignInForm />

					<p className="lg:hidden mt-10 font-sans text-body-md text-muted/60 text-center">
						© 2025 PharmaRoute
					</p>
				</div>
			</main>
		</div>
	);
}
