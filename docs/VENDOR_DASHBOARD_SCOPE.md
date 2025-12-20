# Vendor Dashboard — Scope Definition (MVP)

Version: 1.0  
Status: SCOPE FROZEN  
Audience: Product, Frontend, Backend  
Last Updated: 2025-12-20

---

## 1. Purpose

This document defines the **non-negotiable scope** of the Vendor Dashboard for the MVP release.

Its goal is to:
- Prevent scope creep
- Align frontend and backend expectations
- Enable deterministic delivery
- Avoid mid-build feature additions

Any functionality not explicitly listed here is **out of scope** for MVP.

---

## 2. Core Principles

- Mobile-first, tablet-compatible
- High-frequency operational usage
- Zero learning curve for restaurant staff
- Polling-based updates (no real-time sockets)
- SaaS-grade clarity, not analytics-heavy

---

## 3. Dashboard Tabs (MVP)

### 3.1 Dashboard (Overview)

**Purpose:**  
Provide real-time operational awareness at a glance.

**Features:**
- Today’s key counters
  - Orders today
  - Revenue today
  - Active orders (live count)
- Order status summary
  - New
  - Preparing
  - Ready
  - Completed
- System indicators
  - Menu status (Published / Draft)
  - OCR pending approvals (count, if any)

**UX Rules:**
- No charts beyond simple bars or counters
- No historical views
- Click-through shortcuts to:
  - Orders
  - Menu
- Mobile-first layout

---

### 3.2 Orders

**Purpose:**  
Primary operational screen for daily order handling.

**Features:**
- Order list with polling-based refresh
- Status-based filters or tabs
  - New
  - Preparing
  - Ready
  - Completed
- Order detail drawer / panel
  - Items with quantities
  - Table or session reference
  - Special instructions
- Status actions
  - Accept → Prepare → Ready → Complete

**Explicitly Excluded:**
- Payments
- Refunds
- Delivery / ETA tracking
- Order editing after placement
- Customer communication

---

### 3.3 Menu

**Purpose:**  
Manage menu lifecycle with OCR-assisted onboarding.

#### 3.3.1 Published Menu
- View categories and items
- Availability toggle (enable / disable item)
- Price visibility
  - Read-only if menu is frozen

#### 3.3.2 Draft / OCR Review
- View parsed OCR items
- Assign items to categories
- Approve or reject parsed items
- Persist matching rules (optional, MVP-safe)

#### 3.3.3 Manual Add (Optional, MVP-safe)
- Add item name
- Assign category
- Set price
- Toggle availability

---

## 4. Explicit Exclusions (Global)

The following are **intentionally excluded** from MVP:

- Authentication & roles
- Staff management
- Analytics & reports
- Inventory management
- Taxes, discounts, coupons
- Payment settlement
- Order cancellation by vendor
- Multi-branch management
- Real-time sockets
- Notifications (push / SMS / email)

---

## 5. Backend Expectations

- Polling-based APIs only
- Deterministic status transitions
- No side effects outside defined flows
- Strict validation at API boundaries
- No partial writes

---

## 6. Frontend Expectations

- Clear state boundaries per tab
- No cross-tab hidden dependencies
- Graceful empty states
- Loading and error states are mandatory
- No placeholder UI beyond MVP scope

---

## 7. Change Control

Any change to this document requires:
- Explicit version bump
- Written approval
- Impact assessment

Until then, this scope is **final and locked**.

---

## 8. Definition of Done (Vendor Dashboard MVP)

- All tabs implemented exactly as scoped
- No excluded features partially implemented
- Backend APIs stable and documented
- Mobile usability verified
- Polling behavior verified under load

---

END OF DOCUMENT
