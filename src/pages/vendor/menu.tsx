"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import MenuUploader from "@/components/vendor/menu/MenuUploader";
import MenuList from "@/components/vendor/menu/MenuList";

import {
  getCurrentMenuSnapshot,
  type MenuSnapshot,
} from "@/api/vendorMenu";

/* ============================================================
   PAGE — VENDOR MENU (UPLOAD VISIBILITY)
============================================================ */

export default function VendorMenuPage() {
  const [loading, setLoading] = useState(true);
  const [snapshot, setSnapshot] = useState<MenuSnapshot | null>(null);
  const [error, setError] = useState("");

  /* ============================================================
     AUTH GUARD
  ============================================================ */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/vendor/login";
    }
  }, []);

  /* ============================================================
     LOAD CURRENT SNAPSHOT
  ============================================================ */
  useEffect(() => {
    let cancelled = false;

    async function loadMenu() {
      try {
        setLoading(true);
        setError("");

        const data = await getCurrentMenuSnapshot();
        if (cancelled) return;

        setSnapshot(data);
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
         EMPTY STATE — UPLOAD ENTRY POINT
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
              Status: <strong>Draft (Not Live)</strong>
            </span>
          </div>

          <MenuList items={snapshot.items} />

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
