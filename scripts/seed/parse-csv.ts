import { parse } from "csv-parse/sync";

export type CsvRow = {
	line: number;
	[column: string]: string | number;
};

export const parseCsv = (text: string): CsvRow[] => {
	const records = parse(text, {
		columns: (header: string[]) => header.map((h) => h.trim()),
		skip_empty_lines: true,
		trim: true,
	}) as Record<string, string>[];

	return records.map((record, index) => ({
		...record,
		line: index + 1,
	}));
};

export const buildLineMap = <T extends { line: number }>(
	rows: T[],
	ids: string[],
): Map<number, string> => {
	if (rows.length !== ids.length) {
		throw new Error(
			`buildLineMap length mismatch: rows=${rows.length} ids=${ids.length}`,
		);
	}
	const map = new Map<number, string>();
	for (let i = 0; i < rows.length; i++) {
		map.set(rows[i].line, ids[i]);
	}
	return map;
};
