import { useInfiniteQuery } from "@tanstack/react-query";
import { BottomTabBar } from "#/features/dashboard/components/BottomTabBar";
import { useTRPC } from "#/integrations/trpc/react";
import { OrdersHeader } from "./OrdersHeader";
import { OrdersList } from "./OrdersList";
import { OrdersListSkeleton } from "./OrdersListSkeleton";

export function OrdersScreen() {
	const trpc = useTRPC();

	const {
		data,
		isPending,
		isError,
		hasNextPage,
		isFetchingNextPage,
		fetchNextPage,
	} = useInfiniteQuery(
		trpc.orders.list.infiniteQueryOptions({ limit: 15 }, {
			getNextPageParam: (lastPage: {
				nextCursor: { createdAt: string; id: string } | null;
			}) => lastPage.nextCursor ?? undefined,
			initialPageParam: undefined,
		} as never),
	);

	const allOrders = data?.pages.flatMap((page) => page.items) ?? [];

	return (
		<div className="flex h-dvh flex-col bg-canvas">
			<OrdersHeader />

			<main className="flex flex-1 flex-col overflow-y-auto">
				{isPending ? (
					<OrdersListSkeleton />
				) : isError ? (
					<div className="flex flex-col items-center justify-center px-4 py-16">
						<p className="font-sans text-body-md text-error">
							Failed to load orders.
						</p>
					</div>
				) : (
					<OrdersList
						orders={allOrders}
						hasNextPage={hasNextPage}
						isFetchingNextPage={isFetchingNextPage}
						fetchNextPage={fetchNextPage}
					/>
				)}
			</main>

			<BottomTabBar />
		</div>
	);
}
