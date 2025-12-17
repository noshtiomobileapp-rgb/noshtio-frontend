"use client";

import React, { useEffect, useState } from "react";

export default function ProfileSettings({ vendor }: { vendor?: any }) {
  const [draft, setDraft] = useState<any>(vendor || {});
  const [saving, setSaving] = useState(false);
  useEffect(() => setDraft(vendor || {}), [vendor]);

  async function handleSave() {
    setSaving(true);
    try {
      // try to persist – adapt endpoint if you have one
      await fetch("http://localhost:4000/api/vendors/profile", {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      }).catch(() => null);
      alert("Profile saved (if backend endpoint exists).");
    } catch (e) {
      alert("Failed to save profile");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 max-w-3xl">
      <h2 className="text-xl font-semibold mb-4">Profile & Settings</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm">Business Name</label>
          <input className="w-full border rounded px-3 py-2" value={draft.businessName || draft.name || ""} onChange={(e) => setDraft({ ...draft, businessName: e.target.value })} />
        </div>
        <div>
          <label className="text-sm">Phone</label>
          <input className="w-full border rounded px-3 py-2" value={draft.mobile || ""} onChange={(e) => setDraft({ ...draft, mobile: e.target.value })} />
        </div>
        <div>
          <label className="text-sm">Email</label>
          <input className="w-full border rounded px-3 py-2" value={draft.email || ""} onChange={(e) => setDraft({ ...draft, email: e.target.value })} />
        </div>
        <div>
          <label className="text-sm">GST / Tax ID</label>
          <input className="w-full border rounded px-3 py-2" value={draft.gst || ""} onChange={(e) => setDraft({ ...draft, gst: e.target.value })} />
        </div>

        <div className="md:col-span-2">
          <label className="text-sm">Address</label>
          <textarea className="w-full border rounded px-3 py-2" value={draft.address || ""} onChange={(e) => setDraft({ ...draft, address: e.target.value })} />
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <button className="px-4 py-2 border rounded" onClick={() => setDraft(vendor)}>Reset</button>
        <button className="px-4 py-2 bg-slate-800 text-white rounded" onClick={handleSave} disabled={saving}>{saving ? "Saving..." : "Save"}</button>
      </div>
    </div>
  );
}
