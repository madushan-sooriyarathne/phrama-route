import * as Sentry from "@sentry/tanstackstart-react";
import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query";
import type { ReactNode } from "react";
import { env } from "./env";
import TanstackQueryProvider, {
	getContext,
} from "./integrations/tanstack-query/root-provider";
import { routeTree } from "./routeTree.gen";

export function getRouter() {
	const context = getContext();

	const router = createTanStackRouter({
		routeTree,
		context,
		scrollRestoration: true,
		defaultPreload: "intent",
		defaultPreloadStaleTime: 0,

		Wrap: (props: { children: ReactNode }) => {
			return (
				<TanstackQueryProvider context={context}>
					{props.children}
				</TanstackQueryProvider>
			);
		},
	});

	setupRouterSsrQueryIntegration({ router, queryClient: context.queryClient });

	if (!router.isServer) {
		Sentry.init({
			dsn: env.VITE_SENTRY_DSN,
			sendDefaultPii: true, // Adds request headers and IP for users
			enableLogs: true, // Enable logs to be sent to Sentry
		});
	}

	return router;
}

declare module "@tanstack/react-router" {
	interface Register {
		router: ReturnType<typeof getRouter>;
	}
}
