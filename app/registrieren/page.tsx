"use client";

import { useState } from "react";
export default function RegistrierenPage() {
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
async function handleRegister() {
  if (!companyName.trim() || !email.trim() || !password.trim()) {
    alert("Bitte füllen Sie alle Felder aus.");
    return;
  }

  if (password.length < 8) {
    alert("Das Passwort muss mindestens 8 Zeichen lang sein.");
    return;
  }
  const response = await fetch("/api/register", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    companyName,
    email,
    password,
  }),
});

const data = await response.json();

if (!response.ok) {
  alert(data.error || "Registrierung fehlgeschlagen.");
  return;
}

alert("Unternehmen wurde erfolgreich registriert.");
}
  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold text-slate-900">
          Unternehmen registrieren
        </h1>

        <p className="mt-2 text-slate-600">
          Erstellen Sie Ihren EASyne-Zugang für Ihr Unternehmen.
        </p>

        <div className="mt-6">
          <label className="text-sm font-semibold text-slate-900">
            Unternehmen
          </label>

          <input
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="Muster GmbH"
            className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-violet-500"
          />
        </div>

        <div className="mt-5">
          <label className="text-sm font-semibold text-slate-900">
            E-Mail
          </label>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@unternehmen.ch"
            className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-violet-500"
          />
        </div>

        <div className="mt-5">
          <label className="text-sm font-semibold text-slate-900">
            Passwort
          </label>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-violet-500"
          />
        </div>

        <button
          type="button"
          onClick={handleRegister}
          className="mt-6 w-full rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 px-4 py-3 font-semibold text-white transition hover:opacity-90"
        >
          Unternehmen registrieren
        </button>
      </div>
    </main>
  );
}