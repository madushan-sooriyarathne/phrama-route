// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

afterEach(cleanup);

vi.mock("#/lib/auth-client", () => ({
	authClient: { signOut: vi.fn() },
}));

vi.mock("@tanstack/react-router", () => ({
	Link: ({
		children,
		...rest
	}: { children: ReactNode } & Record<string, unknown>) => {
		const { to, params, onClick, className } = rest as {
			to?: string;
			params?: Record<string, string>;
			onClick?: () => void;
			className?: string;
		};
		const href =
			to && params
				? Object.entries(params).reduce(
						(acc, [k, v]) => acc.replace(`$${k}`, v),
						to,
					)
				: (to ?? "#");
		return (
			<a href={href} onClick={onClick} className={className}>
				{children}
			</a>
		);
	},
}));

import { ProfileMenu } from "./ProfileMenu";

function renderMenu(userRole: string | undefined) {
	return render(<ProfileMenu role={userRole} onNavigate={() => {}} />);
}

describe("ProfileMenu", () => {
	it("shows only Account settings for rep role", () => {
		renderMenu("rep");
		expect(screen.getByText("Account settings")).toBeTruthy();
		expect(screen.queryByText("Users")).toBeNull();
		expect(screen.queryByText("Inventory")).toBeNull();
	});

	it("shows all admin items for admin role", () => {
		renderMenu("admin");
		expect(screen.getByText("Account settings")).toBeTruthy();
		expect(screen.getByText("Users")).toBeTruthy();
		expect(screen.getByText("Inventory")).toBeTruthy();
	});

	it("shows all admin items for super_admin role", () => {
		renderMenu("super_admin");
		expect(screen.getByText("Users")).toBeTruthy();
		expect(screen.getByText("Inventory")).toBeTruthy();
	});

	it("hides admin items when role missing", () => {
		renderMenu(undefined);
		expect(screen.queryByText("Users")).toBeNull();
		expect(screen.queryByText("Inventory")).toBeNull();
	});

	it("renders Account settings link with settings pathname", () => {
		renderMenu("rep");
		const link = screen.getByText("Account settings").closest("a");
		expect(link?.getAttribute("href")).toBe("/account/settings");
	});
});
