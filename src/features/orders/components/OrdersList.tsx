import { useEffect, useRef } from "react";
import { groupOrdersByDate, type OrderItem } from "../utils/groupOrdersByDate";
import { OrderDateGroup } from "./OrderDateGroup";

interface OrdersListProps {
	orders: OrderItem[];
	hasNextPage: boolean;
	isFetchingNextPage: boolean;
	fetchNextPage: () => void;
}

export function OrdersList({
	orders,
	hasNextPage,
	isFetchingNextPage,
	fetchNextPage,
}: OrdersListProps) {
	const sentinelRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const sentinel = sentinelRef.current;
		if (!sentinel) return;

		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0]?.isIntersecting && hasNextPage && !isFetchingNextPage) {
					fetchNextPage();
				}
			},
			{ threshold: 0.1 },
		);

		observer.observe(sentinel);
		return () => observer.disconnect();
	}, [hasNextPage, isFetchingNextPage, fetchNextPage]);

	const groups = groupOrdersByDate(orders);

	if (orders.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center px-4 py-16">
				<p className="font-sans text-body-md text-muted">No orders yet.</p>
			</div>
		);
	}

	return (
		<div className="flex flex-col px-4 pb-6">
			{groups.map((group) => (
				<OrderDateGroup key={group.dateLabel} group={group} />
			))}

			<div ref={sentinelRef} className="py-2">
				{isFetchingNextPage && (
					<div className="flex justify-center py-4">
						<div className="h-4 w-4 animate-spin rounded-full border-2 border-surface-strong border-t-ink" />
					</div>
				)}
				{!hasNextPage && orders.length > 0 && (
					<p className="text-center font-sans text-body-md text-muted">
						All orders loaded
					</p>
				)}
			</div>
		</div>
	);
}
