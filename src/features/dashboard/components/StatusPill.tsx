type OrderStatus = "pending" | "completed" | "cancelled";

interface StatusPillProps {
	status: OrderStatus;
}

type PillConfig = {
	label: string;
	style: React.CSSProperties;
	textClass: string;
};

const PILL_CONFIG: Record<OrderStatus, PillConfig> = {
	pending: {
		label: "DRAFT",
		style: { backgroundColor: "#FFF3E0" },
		textClass: "text-signature-coral",
	},
	completed: {
		label: "COMPLETED",
		style: { backgroundColor: "#F0FDF4" },
		textClass: "text-signature-forest",
	},
	cancelled: {
		label: "CANCELLED",
		style: {},
		textClass: "text-muted",
	},
};

export function StatusPill({ status }: StatusPillProps) {
	const config = PILL_CONFIG[status];

	return (
		<span
			className={`rounded-full px-2 py-0.5 font-sans text-body-md font-medium tracking-widest ${config.textClass} ${status === "cancelled" ? "bg-surface-strong" : ""}`}
			style={config.style}
		>
			{config.label}
		</span>
	);
}
