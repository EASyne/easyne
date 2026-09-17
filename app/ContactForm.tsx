"use client";

import { FormEvent, useState } from "react";

export default function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setSuccess(false);
    setError("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    const response = await fetch("/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: formData.get("name"),
        email: formData.get("email"),
        company: formData.get("company"),
        message: formData.get("message"),
      }),
    });

    if (!response.ok) {
  const data = await response.json().catch(() => null);

  setError(
    data?.error ||
      "Nachricht konnte nicht gesendet werden. Bitte versuchen Sie es erneut."
  );

  setLoading(false);
  return;
}

    form.reset();
    setSuccess(true);
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <input
          type="text"
          name="name"
          placeholder="Name"
          required
          className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white outline-none placeholder:text-indigo-200 focus:border-violet-300"
        />

        <input
          type="email"
          name="email"
          placeholder="E-Mail"
          required
          className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white outline-none placeholder:text-indigo-200 focus:border-violet-300"
        />
      </div>

      <input
        type="text"
        name="company"
        placeholder="Unternehmen (optional)"
        className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white outline-none placeholder:text-indigo-200 focus:border-violet-300"
      />

      <textarea
        name="message"
        placeholder="Ihre Nachricht"
        required
        rows={5}
        className="w-full resize-none rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white outline-none placeholder:text-indigo-200 focus:border-violet-300"
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-white px-7 py-4 font-semibold text-slate-950 transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Wird gesendet..." : "Nachricht senden →"}
      </button>

      {success && (
        <p className="text-sm font-medium text-green-300">
          Vielen Dank! Ihre Nachricht wurde erfolgreich gesendet.
        </p>
      )}

      {error && (
        <p className="text-sm font-medium text-red-300">
          {error}
        </p>
      )}
    </form>
  );
}