"use client";

import { useState } from "react";

export default function SubscriptionButton() {
  const [loading, setLoading] = useState(false);

  async function startCheckout() {
    setLoading(true);

    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Checkout konnte nicht gestartet werden.");
        return;
      }

      if (!data.url) {
        alert("Keine Checkout-URL erhalten.");
        return;
      }

      window.location.href = data.url;
    } catch (error) {
      console.error("Stripe checkout error:", error);
      alert("Checkout konnte nicht gestartet werden.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={startCheckout}
      disabled={loading}
      className="rounded-xl bg-violet-600 px-4 py-2 font-semibold text-white disabled:opacity-50"
    >
      {loading ? "Wird geladen..." : "EASyne Business starten"}
    </button>
  );
}