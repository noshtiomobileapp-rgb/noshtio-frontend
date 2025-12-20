/* ------------------------------------------------------------------
   UI Design Tokens (MVP-safe)
   Global Visual Hierarchy — FINAL
------------------------------------------------------------------- */

export const spacing = {
  xs: "0.25rem",   // 4px
  sm: "0.5rem",    // 8px
  md: "1rem",      // 16px
  lg: "1.5rem",    // 24px
};

/* ------------------------------------------------------------------
   Typography
   ------------------------------------------------------------------
   Changes:
   - meta contrast increased: text-gray-500 → text-gray-600
   - no font-size changes
------------------------------------------------------------------- */
export const text = {
  title: "text-base font-semibold text-gray-900",
  body: "text-sm text-gray-800",
  meta: "text-xs text-gray-600",
};

/* ------------------------------------------------------------------
   Buttons
   ------------------------------------------------------------------
   Rules enforced:
   - primary: used ONCE per screen only
   - ghost: all secondary actions
   - ghost has:
       • no background
       • lighter font weight
------------------------------------------------------------------- */
export const button = {
  primary:
    "bg-black text-white rounded-md px-4 py-2 font-semibold disabled:opacity-50",

  ghost:
    "bg-transparent text-gray-600 font-medium rounded-md px-3 py-1 hover:text-black active:text-black",
};
