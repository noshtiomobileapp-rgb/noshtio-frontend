"use client";
import { useState } from "react";

type TabType = "login" | "register" | "forgot";

export default function VendorAuthPage() {
  const [activeTab, setActiveTab] = useState<TabType>("login");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">

        {/* Tabs */}
        <div className="flex justify-between mb-6 border-b">
          <button
            className={`pb-2 ${activeTab === "login" ? "border-b-2 border-black font-semibold" : ""}`}
            onClick={() => setActiveTab("login")}
          >
            Sign In
          </button>

          <button
            className={`pb-2 ${activeTab === "register" ? "border-b-2 border-black font-semibold" : ""}`}
            onClick={() => setActiveTab("register")}
          >
            Sign Up
          </button>

          <button
            className={`pb-2 ${activeTab === "forgot" ? "border-b-2 border-black font-semibold" : ""}`}
            onClick={() => setActiveTab("forgot")}
          >
            Forgot
          </button>
        </div>

        {/* Forms */}
        {activeTab === "login" && <VendorLoginForm />}
        {activeTab === "register" && <VendorRegisterForm />}
        {activeTab === "forgot" && <VendorForgotPassword />}
      </div>
    </div>
  );
}

/* ================= LOGIN ================= */

function VendorLoginForm() {
  return (
    <form className="space-y-4">
      <input type="email" placeholder="Vendor Email" className="w-full border p-2 rounded" />
      <input type="password" placeholder="Password" className="w-full border p-2 rounded" />
      <button className="w-full bg-black text-white py-2 rounded">
        Sign In
      </button>
    </form>
  );
}

/* ================= REGISTER ================= */

function VendorRegisterForm() {
  return (
    <form className="space-y-4">
      <input type="text" placeholder="Business Name" className="w-full border p-2 rounded" />
      <input type="email" placeholder="Vendor Email" className="w-full border p-2 rounded" />
      <input type="password" placeholder="Password" className="w-full border p-2 rounded" />
      <button className="w-full bg-black text-white py-2 rounded">
        Create Vendor Account
      </button>
    </form>
  );
}

/* ================= FORGOT ================= */

function VendorForgotPassword() {
  return (
    <form className="space-y-4">
      <input type="email" placeholder="Enter your email" className="w-full border p-2 rounded" />
      <button className="w-full bg-black text-white py-2 rounded">
        Send Reset Link
      </button>
    </form>
  );
}