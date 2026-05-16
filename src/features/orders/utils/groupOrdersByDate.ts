export type OrderStatus = "pending" | "completed" | "cancelled";

export interface OrderItem {
	id: string;
	displayId: string;
	pharmacyName: string;
	totalAmount: number;
	createdAt: string;
	status: OrderStatus;
}

export interface DateGroup {
	dateLabel: string;
	orders: OrderItem[];
}

export function groupOrdersByDate(orders: OrderItem[]): DateGroup[] {
	const groups = new Map<string, OrderItem[]>();

	for (const order of orders) {
		const label = toDateLabel(new Date(order.createdAt));
		const existing = groups.get(label);
		if (existing) {
			existing.push(order);
		} else {
			groups.set(label, [order]);
		}
	}

	return Array.from(groups.entries()).map(([dateLabel, items]) => ({
		dateLabel,
		orders: items,
	}));
}

function toDateLabel(date: Date): string {
	const now = new Date();
	const todayStart = startOfDay(now);
	const yesterdayStart = new Date(todayStart);
	yesterdayStart.setDate(yesterdayStart.getDate() - 1);
	const orderStart = startOfDay(date);

	if (orderStart.getTime() === todayStart.getTime()) {
		return `TODAY, ${formatMonthDay(date)}`;
	}
	if (orderStart.getTime() === yesterdayStart.getTime()) {
		return `YESTERDAY, ${formatMonthDay(date)}`;
	}
	return `${formatWeekday(date)}, ${formatMonthDay(date)}`;
}

function startOfDay(date: Date): Date {
	const d = new Date(date);
	d.setHours(0, 0, 0, 0);
	return d;
}

function formatMonthDay(date: Date): string {
	return date
		.toLocaleDateString("en-US", { month: "short", day: "numeric" })
		.toUpperCase();
}

function formatWeekday(date: Date): string {
	return date.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase();
}
