import { ChevronDown, Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export type SelectOption = {
	id: string;
	label: string;
	sublabel?: string;
};

interface SearchableSelectProps {
	id?: string;
	options: SelectOption[];
	value: string | null;
	onChange: (id: string) => void;
	placeholder: string;
	disabled?: boolean;
	isLoading?: boolean;
}

export function SearchableSelect({
	id,
	options,
	value,
	onChange,
	placeholder,
	disabled = false,
	isLoading = false,
}: SearchableSelectProps) {
	const [open, setOpen] = useState(false);
	const [query, setQuery] = useState("");
	const containerRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);

	const selected = options.find((o) => o.id === value) ?? null;

	const filtered = query
		? options.filter((o) => o.label.toLowerCase().includes(query.toLowerCase()))
		: options;

	useEffect(() => {
		function handleClickOutside(e: MouseEvent) {
			if (
				containerRef.current &&
				!containerRef.current.contains(e.target as Node)
			) {
				setOpen(false);
				setQuery("");
			}
		}
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	function handleOpen() {
		if (disabled || isLoading) return;
		setOpen(true);
		setQuery("");
		setTimeout(() => inputRef.current?.focus(), 0);
	}

	function handleSelect(option: SelectOption) {
		onChange(option.id);
		setOpen(false);
		setQuery("");
	}

	function handleKeyDown(e: React.KeyboardEvent) {
		if (e.key === "Escape") {
			setOpen(false);
			setQuery("");
		}
	}

	return (
		<div ref={containerRef} className="relative">
			<button
				id={id}
				type="button"
				onClick={handleOpen}
				disabled={disabled || isLoading}
				aria-haspopup="listbox"
				aria-expanded={open}
				className={[
					"flex min-h-[48px] w-full items-center justify-between gap-2 rounded-sm px-4 py-3 font-sans text-label-md transition-colors",
					disabled || isLoading
						? "cursor-not-allowed border-0 bg-surface-soft text-muted"
						: "cursor-pointer border border-hairline bg-canvas text-ink active:bg-surface-soft",
				].join(" ")}
			>
				<span className={selected ? "text-ink" : "text-muted"}>
					{selected ? selected.label : placeholder}
				</span>
				{isLoading ? (
					<Loader2 size={16} className="shrink-0 animate-spin text-muted" />
				) : (
					<ChevronDown
						size={16}
						strokeWidth={1.5}
						className={`shrink-0 transition-transform ${open ? "rotate-180" : ""} ${disabled ? "text-muted" : "text-ink"}`}
					/>
				)}
			</button>

			{open ? (
				<div
					role="listbox"
					className="absolute left-0 right-0 top-full z-50 mt-1 max-h-64 overflow-y-auto rounded-md border border-hairline bg-canvas shadow-sm"
				>
					<div className="border-b border-hairline px-4 py-2">
						<input
							ref={inputRef}
							type="text"
							value={query}
							onChange={(e) => setQuery(e.target.value)}
							onKeyDown={handleKeyDown}
							placeholder="Search..."
							className="w-full bg-transparent font-sans text-body-md text-ink outline-none placeholder:text-muted"
						/>
					</div>

					{filtered.length === 0 ? (
						<p className="px-4 py-3 font-sans text-body-md text-muted">
							No results
						</p>
					) : (
						filtered.map((option) => (
							<button
								key={option.id}
								type="button"
								role="option"
								aria-selected={option.id === value}
								onClick={() => handleSelect(option)}
								className={[
									"flex min-h-[48px] w-full flex-col items-start justify-center gap-0.5 px-4 py-3 text-left transition-colors",
									option.id === value
										? "bg-surface-soft"
										: "hover:bg-surface-soft active:bg-surface-strong",
								].join(" ")}
							>
								<span className="font-sans text-label-md text-ink">
									{option.label}
								</span>
								{option.sublabel ? (
									<span className="font-sans text-body-md text-muted">
										{option.sublabel}
									</span>
								) : null}
							</button>
						))
					)}
				</div>
			) : null}
		</div>
	);
}
