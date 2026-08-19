# Awesome Pizza — E2E Testing Strategy & Manual Test Cases

Based on exploration of `http://localhost:3000/`, the app has three functional areas:

1. **Menu** — list of pizzas (image, name, description, +/- quantity stepper).
2. **Your Order** — customer name input, cart (list of items + qty, remove), total item count, "Place Order" button.
3. **Order Management** — order ID input + "Look Up Order", which after a successful order auto-populates and displays order details (Order ID, Customer, Status, Items) with status-transition actions (`Mark as Delivering` → `Mark as Delivered`, `Cancel Order`).

There's also a dark/light theme toggle (🌙/☀️) in the header. Errors/success messages render as a status banner (e.g. "Order placed successfully...", "Order not found: ...", "Please enter an order ID"). Order lookups hit a backend API (observed a 404 network response for unknown IDs), so this is a full-stack app, not purely client-side.

## 1. E2E Testing Strategy

### Objectives
- Validate the complete customer journey: browse menu → build cart → place order → track/manage order status.
- Catch regressions in cart math (quantities/totals), form validation, and API-backed order lookup/status transitions.
- Ensure the UI behaves consistently across browsers/viewports and in both light/dark themes.

### Test Layers
| Layer | Purpose | Tooling |
|---|---|---|
| Manual exploratory/functional | Fast coverage of new features & edge cases before automation | Human tester (see test cases below) |
| E2E UI automation | Regression safety net for critical user flows | Playwright (`@playwright/test`, already scaffolded in this repo) |
| API/contract tests | Validate order create/lookup/status endpoints independent of UI | Playwright `request` fixture or dedicated API test suite |
| Visual/responsive checks | Catch layout breakage across viewports & themes | Playwright screenshots / trace viewer |
| Accessibility checks | Ensure forms/buttons are usable via keyboard & screen readers | `@axe-core/playwright` |

### Recommended Coverage Areas
1. **Menu browsing** — pizza cards render with image, name, description, quantity control defaulting to 0.
2. **Cart management** — increment/decrement, remove item, quantity floor at 0, running "Total Items" count, empty-cart state.
3. **Order placement** — form validation (name required, cart non-empty → "Place Order" enabled/disabled), success flow, cart/name reset after order, auto-populated Order ID + auto-displayed order confirmation.
4. **Order lookup** — valid ID, empty ID (client-side validation message), unknown ID (404 → "Order not found" message).
5. **Order status lifecycle** — RECEIVED → DELIVERING → DELIVERED, `Cancel Order` availability/disappearance per state.
6. **Theme toggle** — icon/state switch and persistence (check if it persists across reload — verify via localStorage or cookie).
7. **Cross-browser** — existing `playwright.config.ts` already targets Chromium, Firefox, WebKit; add mobile viewport projects if the layout is responsive.
8. **Negative/edge cases** — special characters/very long names, rapid double-clicks on Place Order (duplicate-order prevention), page refresh mid-order, network failure handling.

### Test Data Management
- Use uniquely generated customer names/order IDs per test run (e.g. timestamp suffix) to avoid collisions, since order IDs appear to be server-generated (`order-<timestamp>-<n>`).
- If a backend/DB is involved, prefer an isolated test environment or API-level cleanup after each test rather than relying on UI-only teardown.

### Automation Recommendations (for this repo)
- Add `data-testid` attributes to key elements (pizza card, qty buttons, cart line items, Place Order button, Order ID input, status banner) — current DOM relies on generic `<div>`s, which makes selectors brittle.
- Set `baseURL: 'http://localhost:3000'` and enable the `webServer` block in [playwright.config.ts](playwright.config.ts) so tests can boot the app automatically in CI.
- Structure automated specs by feature: `tests/menu.spec.ts`, `tests/cart.spec.ts`, `tests/order-placement.spec.ts`, `tests/order-lookup.spec.ts`, `tests/order-status.spec.ts`, `tests/theme.spec.ts`.
- Use Page Object Model to wrap menu/cart/order-management sections given the app has three distinct regions.

### Exit Criteria
- All Critical/High priority manual cases pass on latest build.
- Automated smoke suite (place order + lookup + status transition) green on all 3 browser projects.
- No open Sev1/Sev2 defects in cart totals, order placement, or status transitions.

---

## 2. Manual Test Cases

Priority: **P1** (critical path), **P2** (important), **P3** (edge case/nice-to-have)

### 2.1 Menu Display

| ID | Title | Steps | Expected Result | Priority |
|---|---|---|---|---|
| TC-01 | Menu loads with all items | Navigate to `/` | "Today's Menu" section shows all pizzas (Margherita, Pepperoni, Quattro Stagioni, Vegetarian Delight, BBQ Chicken), each with image, name, description, and qty stepper starting at 0 | P1 |
| TC-02 | Pizza images load correctly | Inspect each menu card | Each pizza has a distinct, correctly loaded image (no broken image icon) | P2 |
| TC-03 | Quantity stepper default state | Load page | Each pizza's quantity shows "0"; "−" has no visible effect (see TC-07) | P2 |

### 2.2 Cart Management

| ID | Title | Steps | Expected Result | Priority |
|---|---|---|---|---|
| TC-04 | Add single item to cart | Click "+" on Margherita once | Quantity shows "1"; Cart section lists "Margherita Pizza — Quantity: 1"; "Total Items: 1" | P1 |
| TC-05 | Add multiple different items | Click "+" on Margherita and Pepperoni | Cart lists both items with correct quantities; "Total Items" reflects sum (e.g. 2) | P1 |
| TC-06 | Increment same item multiple times | Click "+" on Margherita 3 times | Quantity shows "3"; cart line shows "Quantity: 3"; Total Items updates accordingly | P1 |
| TC-07 | Decrement below zero is prevented | With quantity at 0, click "−" | Quantity remains "0"; no negative value, no error | P2 |
| TC-08 | Decrement removes item from cart at 0 | Add 1 Margherita, click "−" to bring back to 0 | Item quantity returns to 0 and item disappears from cart list; Total Items decreases accordingly | P1 |
| TC-09 | Remove item via cart "Remove" button | Add item(s) to cart, click "Remove" next to a cart line | Item is removed from cart and its menu quantity resets to 0; Total Items updates | P1 |
| TC-10 | Empty cart message | Ensure no items added (or remove all) | Cart shows "Your cart is empty" and "Total Items: 0" | P2 |

### 2.3 Order Placement

| ID | Title | Steps | Expected Result | Priority |
|---|---|---|---|---|
| TC-11 | Place Order disabled with empty cart | Load page, don't add items, don't enter name | "Place Order" button is disabled | P1 |
| TC-12 | Place Order disabled with items but no name | Add item(s) to cart, leave name field blank | "Place Order" remains disabled | P1 |
| TC-13 | Place Order disabled with name but empty cart | Enter a name, don't add items | "Place Order" remains disabled | P2 |
| TC-14 | Place Order enabled with valid name + cart | Enter a name and add ≥1 item | "Place Order" button becomes enabled | P1 |
| TC-15 | Successful order placement | With valid name + cart, click "Place Order" | Success banner "Order placed successfully! Order ID: <id>" appears; cart resets to empty; name field clears; menu quantities reset to 0 | P1 |
| TC-16 | Order auto-displayed after placement | Complete TC-15 | Order ID field auto-populates with new order ID; "Order Management" section auto-displays order details: Order ID, Customer name, Status = "RECEIVED", Order Items with correct quantities | P1 |
| TC-17 | Name field accepts special characters | Enter name with special chars/emoji (e.g. `O'Brien-Test 🍕`), place order | Order placed successfully; customer name displayed correctly (no encoding issues/XSS execution) | P2 |
| TC-18 | Name field trims/rejects whitespace-only input | Enter only spaces as name, add item | "Place Order" should remain disabled (validate whether whitespace counts as valid name) | P3 |
| TC-19 | Rapid double-click on Place Order | Click "Place Order" twice quickly | Only one order is created (no duplicate order IDs/entries) | P2 |

### 2.4 Order Lookup

| ID | Title | Steps | Expected Result | Priority |
|---|---|---|---|---|
| TC-20 | Lookup with empty Order ID | Clear Order ID field, click "Look Up Order" | Validation message "Please enter an order ID" is shown; no API call/crash | P1 |
| TC-21 | Lookup with valid Order ID | Place an order, note its ID, clear field, re-enter same ID, click "Look Up Order" | Order details display correctly matching what was placed | P1 |
| TC-22 | Lookup with unknown Order ID | Enter a made-up ID (e.g. `nonexistent-order-id`), click "Look Up Order" | Error message "Order not found: Order with ID '<id>' not found" is shown; no unhandled exception in console | P1 |
| TC-23 | Lookup with malformed/injection input | Enter special chars or SQL/script-like input (e.g. `' OR 1=1 --`, `<script>alert(1)</script>`) | App treats input as literal string, shows "not found" gracefully; no script execution, no server error leak | P2 |

### 2.5 Order Status Lifecycle

| ID | Title | Steps | Expected Result | Priority |
|---|---|---|---|---|
| TC-24 | New order starts as RECEIVED | Place a new order | Status shows "RECEIVED"; "Mark as Delivering" and "Cancel Order" buttons are visible | P1 |
| TC-25 | Transition RECEIVED → DELIVERING | From a RECEIVED order, click "Mark as Delivering" | Status updates to "DELIVERING"; banner shows "Order status updated to DELIVERING"; "Cancel Order" is no longer available; "Mark as Delivered" button appears | P1 |
| TC-26 | Transition DELIVERING → DELIVERED | From a DELIVERING order, click "Mark as Delivered" | Status updates to "DELIVERED"; no further status-change actions available (terminal state) | P1 |
| TC-27 | Cancel a RECEIVED order | From a RECEIVED order, click "Cancel Order" | Status updates to "CANCELLED" (or equivalent); order removed from active flow / no further actions besides viewing | P1 |
| TC-28 | Cancel not available once DELIVERING | Move order to DELIVERING, confirm cancel option | "Cancel Order" button is not shown/disabled | P2 |
| TC-29 | Re-lookup reflects latest status | Update status, then look up same Order ID again (fresh lookup) | Displayed status matches the latest transition (data persisted server-side) | P2 |

### 2.6 Theme Toggle

| ID | Title | Steps | Expected Result | Priority |
|---|---|---|---|---|
| TC-30 | Toggle dark mode | Click 🌙 toggle button | Theme switches to dark styling; icon changes to ☀️ | P2 |
| TC-31 | Toggle back to light mode | Click ☀️ toggle button again | Theme reverts to light styling; icon changes back to 🌙 | P2 |
| TC-32 | Theme persists on reload | Toggle dark mode, refresh page | Verify whether theme choice persists (localStorage) or resets to default; document actual behavior | P3 |

### 2.7 Cross-Browser / Responsive / Accessibility

| ID | Title | Steps | Expected Result | Priority |
|---|---|---|---|---|
| TC-33 | Full flow on Chromium, Firefox, WebKit | Repeat TC-04, TC-15, TC-21, TC-25 on each browser | Consistent behavior and layout across all three | P1 |
| TC-34 | Mobile viewport layout | Resize to mobile width (e.g. 375px) | Menu, cart, and order management sections remain usable, no overlapping/cut-off content | P2 |
| TC-35 | Keyboard navigation | Use Tab/Enter/Space only to add items, fill name, place order, and look up an order | All interactive elements are reachable and operable via keyboard; focus order is logical | P2 |
| TC-36 | Screen reader labels | Inspect accessible names for inputs/buttons (e.g. via accessibility tree) | "Your Name:", "Order ID:" inputs and all buttons have meaningful accessible names (already appears true from initial audit) | P3 |

### 2.8 Resilience / Non-Functional

| ID | Title | Steps | Expected Result | Priority |
|---|---|---|---|---|
| TC-37 | Backend/API unavailable | Stop backend (if separate from frontend) and attempt to place an order or look up | App shows a graceful error message, not a blank screen or unhandled crash | P2 |
| TC-38 | Slow network | Throttle network (e.g. Playwright `page.route` delay or DevTools throttling) | Loading indicators (if any) show appropriately; no duplicate submissions | P3 |
| TC-39 | Page refresh mid-session | Add items to cart, refresh page before placing order | Cart resets (client-side state) — confirm this is expected behavior, not a bug | P3 |
