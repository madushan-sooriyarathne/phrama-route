export type QuantityMap = Map<string, number>;

export function increment(map: QuantityMap, medicineId: string): QuantityMap {
	const next = new Map(map);
	next.set(medicineId, (next.get(medicineId) ?? 0) + 1);
	return next;
}

export function decrement(map: QuantityMap, medicineId: string): QuantityMap {
	const current = map.get(medicineId) ?? 0;
	if (current <= 1) {
		const next = new Map(map);
		next.delete(medicineId);
		return next;
	}
	const next = new Map(map);
	next.set(medicineId, current - 1);
	return next;
}

export function computeGrandTotal(
	quantities: QuantityMap,
	prices: Map<string, number>,
): number {
	let total = 0;
	for (const [id, qty] of quantities) {
		total += qty * (prices.get(id) ?? 0);
	}
	return total;
}
