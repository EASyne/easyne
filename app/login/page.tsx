"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../utils/supabase";
export default function LoginPage() {
    const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const supabase = createClient();
const router = useRouter();
async function handleLogin() {
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    alert("E-Mail oder Passwort ist falsch.");
    return;
  }

  router.push("/dashboard");
}
  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold text-slate-900">Firmen-Login</h1>

        <p className="mt-2 text-slate-600">
          Melden Sie sich an, um EASyne für Ihr Unternehmen zu nutzen.
        </p>
      <div className="mt-6">
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
  onClick={handleLogin}
  className="mt-6 w-full rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 px-4 py-3 font-semibold text-white transition hover:opacity-90"
>
  Anmelden
</button>
<p className="mt-4 text-center text-sm text-slate-600">
  Noch kein Konto?{" "}
  <a
    href="/registrieren"
    className="font-semibold text-violet-600 hover:underline"
  >
    Jetzt registrieren
  </a>
</p>
</div>
    </main>
  );
}