import { Link } from "@tanstack/react-router";
import { Plus, Search } from "lucide-react";

export function OrdersHeader() {
	return (
		<div className="flex flex-col gap-[16px] px-[16px] pb-[16px] pt-[24px]">
			<div className="flex items-center justify-between">
				<h1 className="font-sans text-display-md font-semibold text-ink">
					Orders
				</h1>
				<Link
					to="/orders/new"
					className="flex items-center gap-2 rounded-full bg-primary px-4 py-2.5 font-sans text-body-md font-medium text-on-primary active:bg-primary-active"
					aria-label="Create new order"
				>
					<Plus size={16} strokeWidth={2} />
					New Order
				</Link>
			</div>
			<label className="flex items-center gap-3 rounded-full border border-hairline bg-canvas px-4 py-3">
				<Search size={18} strokeWidth={1.5} className="shrink-0 text-muted" />
				<input
					type="search"
					placeholder="Search Orders"
					className="flex-1 bg-transparent font-sans text-body-md text-ink outline-none placeholder:text-muted"
					aria-label="Search orders"
				/>
			</label>
		</div>
	);
}
