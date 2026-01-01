"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { vendorFetch } from "@/lib/vendorApi";
import MenuUploader from "@/components/vendor/menu/MenuUploader";

/* ============================================================
   TYPES (STEP-SAFE)
============================================================ */

type MenuItem = {
  _id: string;
  name: string;
  price: number | null;
};

type MenuSnapshot = {
  snapshotId: string;
  items: MenuItem[];
  status: "DRAFT";
};

/* ============================================================
   PAGE — VENDOR MENU (UPLOAD STEP)
============================================================ */

export default function VendorMenuPage() {
  const [loading, setLoading] = useState(true);
  const [snapshot, setSnapshot] = useState<MenuSnapshot | null>(null);
  const [error, setError] = useState<string>("");

  /* ============================================================
     AUTH GUARD (PAGE-LEVEL)
  ============================================================ */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/vendor/login";
    }
  }, []);

  /* ============================================================
     LOAD CURRENT DRAFT SNAPSHOT
  ============================================================ */
  useEffect(() => {
    let cancelled = false;

    async function loadMenu() {
      try {
        setLoading(true);
        setError("");

        const res = await vendorFetch<any>(
          "/api/vendor/menu/current"
        );

        if (cancelled) return;

        if (res && res.snapshotId) {
          setSnapshot({
            snapshotId: res.snapshotId,
            items: res.items || [],
            status: "DRAFT",
          });
        } else {
          // No snapshot exists yet
          setSnapshot(null);
        }
      } catch (err: any) {
        if (cancelled) return;

        if (err?.message === "Unauthorized") {
          window.location.href = "/vendor/login";
          return;
        }

        setError(
          "Unable to load menu at the moment. Please try again."
        );
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadMenu();
    return () => {
      cancelled = true;
    };
  }, []);

  /* ============================================================
     STATES
  ============================================================ */

  if (loading) {
    return (
      <div className="text-sm text-gray-500">
        Loading menu…
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-sm text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ========================================================
         EMPTY STATE — UPLOAD ENTRY POINT (THIS STEP)
      ======================================================== */}
      {!snapshot && (
        <div className="border rounded p-6 space-y-3">
          <h2 className="text-lg font-semibold">
            No menu created yet
          </h2>

          <p className="text-sm text-gray-600">
            Upload your restaurant menu to start setting up
            your items.
          </p>

          <MenuUploader
            onUploaded={(snapshotId) =>
              setSnapshot({
                snapshotId,
                items: [],
                status: "DRAFT",
              })
            }
          />
        </div>
      )}

      {/* ========================================================
         DRAFT EXISTS (READ-ONLY)
      ======================================================== */}
      {snapshot && (
        <>
          <div className="flex items-center justify-between">
            <span className="text-sm">
              Status:{" "}
              <strong>Draft (Not Live)</strong>
            </span>
          </div>

          {/* ITEMS */}
          {snapshot.items.length === 0 ? (
            <div className="text-sm text-gray-600">
              No items extracted yet.
            </div>
          ) : (
            <ul className="border rounded divide-y">
              {snapshot.items.map((item) => (
                <li
                  key={item._id}
                  className="p-3 flex justify-between text-sm"
                >
                  <span>{item.name}</span>
                  <span>
                    {item.price != null
                      ? `₹${item.price}`
                      : "—"}
                  </span>
                </li>
              ))}
            </ul>
          )}

          {/* PREVIEW */}
          <Link
            href={`/vendor/menu/preview/${snapshot.snapshotId}`}
            className="inline-block text-blue-600 underline text-sm"
          >
            Preview Menu
          </Link>
        </>
      )}
    </div>
  );
}
