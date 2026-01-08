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
   PAGE — VENDOR MENU (AUTH SAFE + MVP STABLE)
============================================================ */

export default function VendorMenuPage() {
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(true);
  const [snapshot, setSnapshot] =
    useState<MenuSnapshot | null>(null);
  const [error, setError] = useState("");

  /* ============================================================
     AUTH GUARD (CLIENT-ONLY, SINGLE SOURCE OF TRUTH)
  ============================================================ */
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      window.location.assign("/vendor/login");
      return;
    }

    setReady(true);
  }, []);

  /* ============================================================
     LOAD CURRENT MENU SNAPSHOT (AFTER AUTH)
  ============================================================ */
  useEffect(() => {
    if (!ready) return;

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
          localStorage.removeItem("token");
          window.location.assign("/vendor/login");
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
  }, [ready]);

  /* ============================================================
     RENDER GUARDS
  ============================================================ */

  if (!ready) {
    return null; // ⛔ prevents premature execution
  }

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

  /* ============================================================
     MAIN VIEW
  ============================================================ */

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
              Status:{" "}
              <strong>Draft (Not Live)</strong>
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
