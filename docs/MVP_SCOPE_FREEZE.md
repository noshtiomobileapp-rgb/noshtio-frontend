# MVP Scope Freeze — Non-Negotiable

## Purpose
This document formally locks the scope of the MVP to prevent feature creep and mid-build changes.  
Any requirement not explicitly listed here is **out of scope** and must be deferred.

---

## MVP Functional Scope (ONLY)

The MVP shall support **exactly** the following customer flow:

### 1. Menu
- Display restaurant menu (categories and items)
- Read-only for customers
- Data served from backend menu APIs

### 2. Cart
- Add items to cart
- Remove items from cart
- Update item quantity
- Calculate total amount

### 3. Order
- Place order using:
  - restaurantId
  - sessionId (table / QR session)
  - selected items
- Generate orderId
- Persist order snapshot (menu + prices locked)

### 4. Order Status
- Fetch order status using polling
- Display current order state only
- No real-time updates

✔ This is the **entire MVP surface area**.

---

## Explicitly Out of Scope (Locked Out)

The following are **strictly forbidden** in the MVP:

- No user login / authentication / OTP
- No payments (UPI, card, cash, etc.)
- No coupons / discounts / offers
- No ETA or preparation time
- No WebSockets or real-time push
- No notifications (SMS, WhatsApp, email)
- No order cancellation or refunds
- No ratings or reviews
- No loyalty, wallet, or reward points
- No multi-restaurant cart
- No admin analytics or dashboards

If a feature touches any item above, it **must not be implemented**.

---

## Technical Constraints (Frozen)

- Session-based ordering only (no user accounts)
- Polling-only order status updates
- Backend is the source of truth
- Prices are locked at order creation
- Menu snapshot is stored per order

---

## Enforcement Rules

- Any task must clearly support **Menu → Cart → Order → Status**
- If not, the task is rejected
- “Small”, “quick”, or “nice-to-have” features are still out of scope
- No exceptions without creating a new post-MVP phase

---

## Scope Freeze Confirmation

> The MVP consists only of Menu → Cart → Order → Status.  
> All other features are deferred to post-MVP phases.

**This scope is frozen and non-negotiable.**

---

_Last updated: 2025-12-18_
