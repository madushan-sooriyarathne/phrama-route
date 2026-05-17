import { NeonAuthUIProvider } from "@neondatabase/auth-ui";
import { TanStackDevtools } from "@tanstack/react-devtools";
import type { QueryClient } from "@tanstack/react-query";
import {
	createRootRouteWithContext,
	HeadContent,
	Outlet,
	Scripts,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import type { TRPCOptionsProxy } from "@trpc/tanstack-react-query";
import { ProfileSheet } from "#/features/profile/components/ProfileSheet";
import { ProfileSheetProvider } from "#/features/profile/context/ProfileSheetContext";
import type { TRPCRouter } from "#/integrations/trpc/router";
import { authClient } from "#/lib/auth-client";
import TanStackQueryDevtools from "../integrations/tanstack-query/devtools";
import appCss from "../styles.css?url";

interface MyRouterContext {
	queryClient: QueryClient;

	trpc: TRPCOptionsProxy<TRPCRouter>;
}

function NotFoundComponent() {
	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-canvas p-4 text-center">
			<h1 className="text-display-lg font-bold text-ink mb-2">404</h1>
			<p className="text-body-md text-muted mb-6">
				The page you're looking for doesn't exist.
			</p>
			<a
				href="/"
				className="px-4 py-2 bg-primary text-on-primary rounded-md text-button hover:bg-primary-active transition-colors"
			>
				Go back home
			</a>
		</div>
	);
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
	head: () => ({
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			{
				title: "PharmaRoute",
			},
		],
		links: [
			{
				rel: "stylesheet",
				href: appCss,
			},
		],
	}),
	notFoundComponent: NotFoundComponent,
	component: () => <Outlet />,
	shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<head>
				<HeadContent />
			</head>
			<body>
				<NeonAuthUIProvider authClient={authClient} signUp={false}>
					<ProfileSheetProvider>
						{children}
						<ProfileSheet />
					</ProfileSheetProvider>
				</NeonAuthUIProvider>
				<TanStackDevtools
					config={{
						position: "bottom-right",
					}}
					plugins={[
						{
							name: "Tanstack Router",
							render: <TanStackRouterDevtoolsPanel />,
						},
						TanStackQueryDevtools,
					]}
				/>
				<Scripts />
			</body>
		</html>
	);
}
