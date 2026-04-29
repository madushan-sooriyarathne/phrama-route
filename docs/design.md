## Overview

PharmaRoute follows a "Quietly Editorial" design language, balancing the clinical precision required for pharmaceutical sales with a mobile-first, high-utility field interface. The base atmosphere is a **white canvas**, utilizing dark ink type, generous whitespace, and near-black primary actions. This system avoids aggressive gradients or heavy shadows, instead relying on **signature surface cards** in `{colors.signature-coral}`, `{colors.signature-forest}`, and `{colors.signature-cream}` to differentiate between user roles and critical workflow states (like order confirmation or inventory alerts).

The core of the app—the cascading order workflow—is designed like a print catalog: high-contrast headers, clear labels, and Inter Display for numerical data to signal "commercial precision." The interface never fights for attention; it guides the Sales Rep through Date, Route, and Pharmacy selection using a strict vertical rhythm of `{spacing.lg}` (24px) between form elements.

**Key Characteristics:**
- **Primary Action:** The "Submit Order" button is `{colors.primary}` (near-black) with white text and a `{rounded.lg}` (12px) corner.
- **Workflow Pacing:** The cascading selection (Date → Route → Pharmacy) uses a white canvas. Once a pharmacy is selected, the inventory loads on `{colors.signature-cream}` cards to visually distinguish the "Action" phase of the visit.
- **Data Dialect:** All pricing and quantities use **Inter Display** at `{typography.pricing-display}` weights (475 / 575) to ensure legibility in bright field environments.
- **Role Distinction:** Admin surfaces utilize `{colors.surface-soft}` (light gray) to distinguish "Management" views from the "Active Sales" views.
- **Mobile-First Rhythm:** Vertical rhythm is locked to `{spacing.md}` (16px) for form clusters and `{spacing.section}` (96px) for major dashboard transitions.

## Colors

### Brand & Accent
- **Primary** (`{colors.primary}` — #181d26): Used for primary CTA backgrounds (Place Order), Admin headers, and active navigation icons.
- **Primary Active** (`{colors.primary-active}` — #0d1218): The press state for all primary buttons.

### Surface
- **Canvas** (`{colors.canvas}` — #ffffff): The default background for the order management workflow.
- **Surface Soft** (`{colors.surface-soft}` — #f8fafc): Used for inactive list items in the pharmacy directory.
- **Surface Strong** (`{colors.surface-strong}` — #e0e2e6): Used for Admin-only management cards (Creating Routes/Pharmacies).
- **Hairline** (`{colors.hairline}` — #dddddd): 1px border for input outlines and dividers between medication rows.

### Text
- **Ink** (`{colors.ink}` — #181d26): High-contrast text for headers and primary labels.
- **Body** (`{colors.body}` — #333840): Default color for supporting descriptions and addresses.
- **Muted** (`{colors.muted}` — #41454d): Used for secondary metadata like SKU numbers or "Last Visited" timestamps.
- **On Primary** (`{colors.on-primary}` — #ffffff): Text color sitting on dark buttons or signature cards.

### Signature Workflow Surfaces
These colors define the state of the sales process.
- **Success Forest** (`{colors.signature-forest}` — #0a2e0e): Background for "Order Completed" screens or stock availability indicators.
- **Alert Coral** (`{colors.signature-coral}` — #aa2d00): Used for "Out of Stock" notices or overdue pharmacy balances.
- **Inventory Cream** (`{colors.signature-cream}` — #f5e9d4): The soft beige surface used specifically for the "Available Medicines" list to group orderable items.

### Semantic
- **Link** (`{colors.link}` — #1b61c9): For navigational links (e.g., "View Pharmacy History").
- **Success** (`{colors.success}` — #006400): Standard success state text.
- **Error** (`{colors.error}` — #aa2d00): Validation error text.

## Typography

### Font Family
The app uses **Haas Grotesk** for all UI labels, navigation, and headers. The **Inter Display** (Variable) font is used exclusively for numerical data—prices, quantities, and dates—to provide a "commercial precision" dialect.

### Hierarchy

| Token | Size | Weight | Line Height | Use |
|---|---|---|---|---|
| `{typography.display-lg}` | 40px | 400 | 1.2 | Screen Hero Headlines (e.g., "Place New Order") |
| `{typography.display-md}` | 32px | 400 | 1.2 | Section Headers (e.g., "Assigned Routes") |
| `{typography.title-lg}` | 24px | 400 | 1.35 | Pharmacy Names in lists |
| `{typography.label-md}` | 16px | 500 | 1.4 | Form Labels (Date, Route, Rep) |
| `{typography.button}` | 16px | 500 | 1.4 | Main CTA labels |
| `{typography.body-md}` | 14px | 400 | 1.25 | Standard UI text and metadata |
| `{typography.pricing-display}` | 20px | 575 | 1.1 | Unit prices and Line Totals (Inter Display) |
| `{typography.total-sum}` | 32px | 575 | 1.1 | Order Grand Total (Inter Display) |

## Layout

### Spacing System
- **Base unit:** 4px.
- **Tokens:** `{spacing.xs}` 8px · `{spacing.sm}` 12px · `{spacing.md}` 16px · `{spacing.lg}` 24px · `{spacing.xl}` 32px · `{spacing.section}` 96px.
- **Internal Padding:** Inventory cards use `{spacing.md}` (16px); Signature workflow cards use `{spacing.xl}` (32px).
- **Vertical Rhythm:** Form inputs are spaced at `{spacing.md}` (16px) internally, with `{spacing.xl}` (32px) between logical groups.

### Grid & Container
- **Mobile Container:** Full-width with `{spacing.md}` (16px) horizontal gutters.
- **Desktop (Admin):** Max content width of 1280px with a 240px fixed left navigation rail.

## Elevation & Depth

| Level | Treatment | Use |
|---|---|---|
| Flat | No shadow | Background surfaces and headers. |
| Hairline | 1px `{colors.hairline}` | Input borders and secondary "Edit" buttons. |
| Workflow Card | No shadow; color contrast | Used for `{colors.signature-cream}` inventory items. |
| Sticky Bottom | Soft 8% alpha black shadow | The "Total Amount" bar that sticks to the bottom of the order screen. |

## Shapes

### Border Radius Scale

| Token | Value | Use |
|---|---|---|
| `{rounded.sm}` | 6px | Text inputs and quantity selectors. |
| `{rounded.md}` | 10px | Content cards and medicine list items. |
| `{rounded.lg}` | 12px | Primary buttons (Submit Order) and Dashboard signature cards. |
| `{rounded.full}` | 9999px | User role badges (Admin/Rep). |

## Components

**`top-nav`** — A white bar with `{colors.ink}` branding. Includes a back-button for the order workflow and the current user's role badge at the right.

**`cascading-select`** — A vertical stack of inputs. Until a selection is made (e.g., Date), the subsequent input (Route) is in `{colors.surface-soft}` with `{colors.muted}` text. Once active, it switches to `{colors.canvas}` with a `{colors.hairline}` border.

**`inventory-item-card`** — Background `{colors.signature-cream}`. Includes the medicine name in `{typography.label-md}`, price in `{typography.pricing-display}`, and a numeric input field on the right. A thin divider in `{colors.hairline}` separates multiple items.

**`order-summary-bar`** — A sticky component at the bottom of the viewport. Background `{colors.primary}`, text `{colors.on-primary}`. Left side shows "Total: [Amount]" in `{typography.total-sum}`, right side shows "Complete Order" `{typography.button}`.

**`button-primary`** — Background `{colors.primary}`, text `{colors.on-primary}`, rounded `{rounded.lg}`. Used for final actions.
- Active state: `button-primary-active` (#0d1218).

**`button-secondary`** — Background `{colors.canvas}`, text `{colors.ink}`, 1px hairline border. Used for "Add New Pharmacy" or "Cancel".

## Do's and Don'ts

### Do
- Use Inter Display for every number. It is the "commercial precision" signal of the app.
- Keep the background white for the selection phase. Only move to `{colors.signature-cream}` once the Rep is actively adding items to an order.
- Maintain a minimum 48px touch target for all quantity adjustment buttons (+/-).
- Use `{colors.signature-forest}` for successful order confirmation screens to provide a high-voltage brand moment.

### Don't
- Don't use bold weights for medication names. Use size and color `{colors.ink}` for emphasis.
- Don't add shadows to the inventory list cards. Rely on the cream background for grouping.
- Don't use primary black buttons for "Delete" or "Cancel". Use secondary hairline styles to avoid accidental deletions.
- Don't change the font for numbers. Inter Display must be consistent throughout the sales dialect.

## Responsive Behavior

### Breakpoints
- **Mobile (< 768px):** Primary view. The order summary bar is sticky. Navigation is a bottom tab bar for Reps.
- **Tablet/Desktop (> 1024px):** Admin view. Side-rail navigation. The inventory list can move to a 2-column grid.

### Collapsing Strategy
- On mobile, the "Route" and "Pharmacy" selection fields collapse into a summary header once a pharmacy is chosen to maximize vertical space for the inventory list.