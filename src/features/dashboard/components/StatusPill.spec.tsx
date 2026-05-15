// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { StatusPill } from "./StatusPill";

describe("StatusPill", () => {
	it("renders DRAFT label for pending status", () => {
		render(<StatusPill status="pending" />);
		expect(screen.getByText("DRAFT")).toBeTruthy();
	});

	it("renders COMPLETED label for completed status", () => {
		render(<StatusPill status="completed" />);
		expect(screen.getByText("COMPLETED")).toBeTruthy();
	});

	it("renders CANCELLED label for cancelled status", () => {
		render(<StatusPill status="cancelled" />);
		expect(screen.getByText("CANCELLED")).toBeTruthy();
	});

	it("applies cream background for pending status", () => {
		const { container } = render(<StatusPill status="pending" />);
		const pill = container.firstElementChild as HTMLElement;
		expect(pill.style.backgroundColor).toBe("rgb(255, 243, 224)");
	});

	it("applies light-green background for completed status", () => {
		const { container } = render(<StatusPill status="completed" />);
		const pill = container.firstElementChild as HTMLElement;
		expect(pill.style.backgroundColor).toBe("rgb(240, 253, 244)");
	});

	it("applies no inline background for cancelled status", () => {
		const { container } = render(<StatusPill status="cancelled" />);
		const pill = container.firstElementChild as HTMLElement;
		expect(pill.style.backgroundColor).toBe("");
	});
});
