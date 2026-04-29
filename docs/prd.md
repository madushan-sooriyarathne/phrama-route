# Product Requirements Document (PRD): PharmaRoute Order Management System

## 1. Document Overview
* **Version:** 1.0.0
* **Status:** Draft
* **Date:** 2026-04-29
* **Project Lead:** Gemini (on behalf of the User)

---

## 2. Executive Summary
PharmaRoute is a mobile-first web application designed to streamline the sales and order management process for pharmaceutical sales representatives. The system allows administrators to manage routes, pharmacies, and inventory, while sales reps can efficiently log orders during their daily field visits. The goal is to replace manual or fragmented order-taking processes with a structured, digital workflow.

---

## 3. User Roles & Permissions

| Role | Permissions |
| :--- | :--- |
| **Super Admin** | Manage Admins, View system-wide logs, Global configurations. |
| **Admin** | Manage Sales Reps, Create/Edit/Delete Routes, Pharmacies, and Medicines. Assign medicines to specific Reps. Can also act as a Sales Rep. |
| **Sales Rep** | View assigned routes/pharmacies, View assigned medicines, Create/Edit/Delete their own orders. |

*Note: An Admin can be assigned 'Rep' duties, allowing them to access the Sales Rep interface and manage their own routes.*

---

## 4. Functional Requirements

### 4.1 User & Access Management
* **Authentication:** Secure login for all roles using TypeScript-based auth logic.
* **Role Hierarchy:** Super Admin creates Admins; Admins create Sales Reps.
* **Dual-Role Support:** Ability for an Admin to be flagged as a Rep and assigned to routes.

### 4.2 Master Data Management (Admin Only)
* **Medicine Inventory:** Centralized database of medications including SKU, Name, Description, and Unit Price.
* **Pharmacy Management:** Directory of pharmacies including Name, Location, Contact Person, and License details.
* **Route Management:** Creating named "Routes" which are logical groupings of pharmacies.
* **Assignments:**
    * Assign specific Routes to Sales Reps.
    * Assign specific Medicines to Sales Reps (Sales Reps only see their assigned catalog).

### 4.3 Order Placement Workflow (Sales Rep)
The order placement follows a strict cascading selection logic:
1.  **Date Selection:** User selects the visit date (defaulting to current date).
2.  **Rep Selection:** If an Admin is logged in, they can select any Rep; if a Rep is logged in, their name is pre-selected (or they select from their profile).
3.  **Route Selection:** Loads a dropdown of routes assigned to the selected Rep.
4.  **Pharmacy Selection:** Once a route is picked, the system filters and displays only pharmacies within that route.
5.  **Inventory Selection:**
    * Display list of medicines assigned to the Rep.
    * Input field for 'Quantity' (ETC/Order amount).
    * Real-time calculation of Line Total (Quantity × Price).
    * Live calculation of the Grand Total for the entire order.
6.  **Submission:** Save the order to the database.

### 4.4 Order History & Management
* **List View:** Reps can see a list of their recent orders.
* **Edit/Delete:** Orders can be modified or removed by the creator (Sales Rep) or an Admin.

---

## 5. Technical Specifications

### 5.1 Tech Stack
* **Language:** TypeScript
* **Framework:** [TanStack Start](https://tanstack.com/router/v1/docs/guide/start) (Full-stack React framework using TanStack Router).
* **Styling:** Tailwind CSS (Mobile-first utility-class approach).
* **Linting/Formatting:** Biome (High-performance toolchain for web projects).
* **Database:** PostgreSQL.
* **Database Hosting:** [Neon](https://neon.tech/) (Serverless Postgres).
* **State Management/Data Fetching:** TanStack Query (integrated with Start).

### 5.2 Data Schema (High-Level)
* **Users:** `id, name, email, password_hash, role (super_admin, admin, rep)`
* **Medicines:** `id, name, generic_name, price, stock_status`
* **Pharmacies:** `id, name, address, contact_no`
* **Routes:** `id, route_name, admin_id`
* **Route_Pharmacies:** (Junction table linking Routes to Pharmacies)
* **Rep_Routes:** (Junction table linking Reps to their assigned Routes)
* **Rep_Medicines:** (Junction table linking Reps to their assigned Medicines)
* **Orders:** `id, rep_id, pharmacy_id, route_id, total_amount, status, created_at`
* **Order_Items:** `id, order_id, medicine_id, quantity, unit_price, line_total`

---

## 6. UI/UX Requirements
* **Mobile-First Design:** The primary interface must be optimized for field work on smartphones.
* **Zero Latency Selectors:** Use TanStack Query to pre-fetch or cache route/pharmacy data to ensure the cascading dropdowns feel instantaneous.
* **Form Validation:** Ensure quantities are positive integers and a pharmacy is selected before inventory loads.
* **Visual Feedback:** Clear success/error toasts when saving or deleting orders.

---

## 7. Future Enhancements (Phase 2)
* **Offline Mode:** Ability to take orders without an active internet connection (using IndexedDB or local storage) and sync later.
* **GPS Verification:** Verify the Sales Rep is actually at the pharmacy location when the order is placed.
* **Analytics Dashboard:** Admins can view sales performance per Rep and per Route.
* **PDF Invoicing:** Generate a digital invoice for the pharmacy immediately upon order completion.

---
