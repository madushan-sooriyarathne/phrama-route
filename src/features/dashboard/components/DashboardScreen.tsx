import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "#/integrations/trpc/react";
import { BottomTabBar } from "./BottomTabBar";
import { RecentOrdersSection } from "./RecentOrdersSection";
import { SummarySection } from "./SummarySection";
import { TopNav } from "./TopNav";

function SummarySkeleton() {
	return (
		<section className="flex flex-col gap-[24px] px-[16px] py-[32px]">
			<div className="flex flex-col gap-[8px]">
				<div className="h-3.5 w-32 animate-pulse rounded-sm bg-surface-strong" />
				<div className="h-8 w-48 animate-pulse rounded-sm bg-surface-strong" />
			</div>
			<div className="flex gap-[16px]">
				<div className="h-22 flex-1 animate-pulse rounded-md bg-surface-soft" />
				<div className="h-22 flex-1 animate-pulse rounded-md bg-surface-soft" />
			</div>
		</section>
	);
}

function OrdersSkeleton() {
	return (
		<section className="flex flex-col px-4">
			<div className="flex items-center justify-between pb-2">
				<div className="h-6 w-36 animate-pulse rounded-sm bg-surface-strong" />
				<div className="h-4.5 w-16 animate-pulse rounded-sm bg-surface-strong" />
			</div>
			<div className="flex flex-col divide-y divide-hairline">
				{[1, 2, 3].map((i) => (
					<div key={i} className="flex flex-col gap-2 py-4">
						<div className="flex justify-between">
							<div className="h-5 w-40 animate-pulse rounded-sm bg-surface-soft" />
							<div className="h-5 w-20 animate-pulse rounded-sm bg-surface-soft" />
						</div>
						<div className="flex justify-between">
							<div className="h-4.5 w-28 animate-pulse rounded-sm bg-surface-soft" />
							<div className="h-5 w-24 animate-pulse rounded-sm bg-surface-soft" />
						</div>
					</div>
				))}
			</div>
		</section>
	);
}

export function DashboardScreen() {
	const trpc = useTRPC();

	const summary = useQuery(trpc.dashboard.getSummary.queryOptions());
	const recentOrders = useQuery(trpc.dashboard.getRecentOrders.queryOptions());

	return (
		<div className="flex h-dvh flex-col bg-canvas">
			<TopNav />

			<main className="flex flex-1 flex-col overflow-y-auto">
				{summary.isPending ? (
					<SummarySkeleton />
				) : summary.isError ? (
					<section className="flex flex-col gap-6 px-4 py-8">
						<p className="font-sans text-body-md text-error">
							Failed to load summary.
						</p>
					</section>
				) : (
					<SummarySection
						routeName={summary.data.routeName}
						pharmaciesVisited={summary.data.pharmaciesVisited}
						totalPharmacies={summary.data.totalPharmacies}
						totalSales={summary.data.totalSales}
					/>
				)}

				{recentOrders.isPending ? (
					<OrdersSkeleton />
				) : recentOrders.isError ? (
					<section className="px-4">
						<p className="font-sans text-body-md text-error">
							Failed to load recent orders.
						</p>
					</section>
				) : (
					<RecentOrdersSection orders={recentOrders.data} />
				)}
			</main>

			<BottomTabBar />
		</div>
	);
}
