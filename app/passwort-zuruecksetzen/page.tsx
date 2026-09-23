"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../utils/supabase";

export default function PasswortZuruecksetzenPage() {
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const supabase = createClient();
  const router = useRouter();
useEffect(() => {
  async function checkRecoverySession() {
    const { data } = await supabase.auth.getSession();

    if (!data.session) {
      alert(
        "Der Link zum Zurücksetzen des Passworts ist ungültig oder abgelaufen. Bitte fordern Sie einen neuen Link an."
      );
      router.push("/login");
    }
  }

  checkRecoverySession();
}, [supabase, router]);
  async function handleResetPassword() {
    if (password.length < 8) {
      alert("Das Passwort muss mindestens 8 Zeichen lang sein.");
      return;
    }

    if (password !== passwordConfirm) {
      alert("Die Passwörter stimmen nicht überein.");
      return;
    }

    setLoading(true);

    const { data, error } = await supabase.auth.updateUser({
      password,
    });
    
    setLoading(false);

    if (error) {
      alert(
        "Das Passwort konnte nicht geändert werden. Bitte fordern Sie einen neuen Link an."
      );
      return;
    }

    alert("Ihr Passwort wurde erfolgreich geändert.");
    router.push("/login");
  }

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold text-slate-900">
          Neues Passwort
        </h1>

        <p className="mt-2 text-slate-600">
          Legen Sie ein neues Passwort für Ihr EASyne-Konto fest.
        </p>

        <div className="mt-6">
          <label className="text-sm font-semibold text-slate-900">
            Neues Passwort
          </label>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mindestens 8 Zeichen"
            className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-violet-500"
          />
        </div>

        <div className="mt-5">
          <label className="text-sm font-semibold text-slate-900">
            Passwort wiederholen
          </label>

          <input
            type="password"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            placeholder="Passwort erneut eingeben"
            className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-violet-500"
          />
        </div>

        <button
          type="button"
          onClick={handleResetPassword}
          disabled={loading}
          className="mt-6 w-full rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 px-4 py-3 font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "Wird gespeichert..." : "Passwort ändern"}
        </button>
      </div>
    </main>
  );
}