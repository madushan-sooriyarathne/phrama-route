import { AuthView } from "@neondatabase/auth-ui";
import { createFileRoute } from "@tanstack/react-router";

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
			{/* Geometric accent — CSS-only, no images */}
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

function Auth() {
	const { pathname } = Route.useParams();

	return (
		<div className="flex h-dvh bg-canvas overflow-hidden">
			{/* Desktop: left brand panel */}
			<BrandPanel />

			{/* Form panel — full width on mobile, right half on desktop */}
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
					{/* Mobile-only logo */}
					<div className="lg:hidden mb-10">
						<PharmaRouteLogo />
						<p className="mt-4 font-sans text-body-md text-muted">
							Your field, optimised.
						</p>
					</div>

					{/* Auth form — themed via CSS token bridge in styles.css */}
					<AuthView pathname={pathname} />

					{/* Mobile footer */}
					<p className="lg:hidden mt-10 font-sans text-body-md text-muted/60 text-center">
						© 2025 PharmaRoute
					</p>
				</div>
			</main>
		</div>
	);
}
