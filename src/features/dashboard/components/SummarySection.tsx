import { StatCard } from "./StatCard";

interface SummarySectionProps {
	routeName: string | null;
	pharmaciesVisited: number;
	totalPharmacies: number;
	totalSales: number;
}

function formatSales(amount: number): string {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
		maximumFractionDigits: 0,
	}).format(amount);
}

export function SummarySection({
	routeName,
	pharmaciesVisited,
	totalPharmacies,
	totalSales,
}: SummarySectionProps) {
	const routeLabel = routeName ? `Today · ${routeName}` : "Today";

	return (
		<section className="flex flex-col gap-6 px-4 py-8">
			<div className="flex flex-col gap-2">
				<p className="font-sans text-body-md font-medium uppercase tracking-widest text-muted">
					{routeLabel}
				</p>
				<h1 className="font-sans text-display-md font-normal text-ink">
					Overview
				</h1>
			</div>

			<div className="flex gap-4">
				<StatCard
					label="Pharmacies"
					value={`${pharmaciesVisited} / ${totalPharmacies}`}
				/>
				<StatCard label="Total Sales" value={formatSales(totalSales)} />
			</div>
		</section>
	);
}
