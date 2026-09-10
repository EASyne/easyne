"use client";

import { useState } from "react";

export default function AnfragePage() {
    const [answer, setAnswer] = useState(
  "Guten Tag, vielen Dank für Ihre Anfrage. Gerne können wir einen Termin für nächste Woche vereinbaren. Teilen Sie uns bitte mit, welcher Tag und welche Uhrzeit für Sie am besten passen."
);
const [accepted, setAccepted] = useState(false);
const [sent, setSent] = useState(false);
  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <h1 className="text-3xl font-bold text-slate-900">
  Kundenanfrage
</h1>

<div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
  <p className="text-sm font-semibold text-violet-600">
    max.mustermann@example.ch
  </p>

  <h2 className="mt-2 text-xl font-bold text-slate-900">
    Anfrage für einen Termin
  </h2>

  <p className="mt-4 text-slate-600">
    Kunde möchte nächste Woche einen Termin vereinbaren.
  </p>
</div>
     <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
  <p className="text-sm font-semibold text-violet-600">
    EASyne KI-Analyse
  </p>

  <h2 className="mt-2 text-xl font-bold text-slate-900">
    Analyse der Kundenanfrage
  </h2>
  <div className="mt-6">
  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
    Kategorie
  </p>
  <p className="mt-1 font-semibold text-slate-900">
    Terminvereinbarung
  </p>
</div>
<div className="mt-6">
  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
    Dringlichkeit
  </p>
  <p className="mt-1 font-semibold text-slate-900">
    Normal
  </p>
</div>
<div className="mt-6">
  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
    Antwortvorschlag
  </p>

   <textarea
  value={answer}
  onChange={(e) => setAnswer(e.target.value)}
  className="mt-2 min-h-32 w-full rounded-xl bg-slate-50 p-4 text-slate-700 outline-none ring-violet-300 focus:ring-2"
/>
</div>
<button
  type="button"
  onClick={() => setAccepted(true)}
  className="mt-4 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
>
  Antwort übernehmen
</button>
{accepted && (
  <button
    type="button"
    onClick={() => setSent(true)}
    className="ml-3 mt-4 rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-violet-700"
  >
    Antwort senden
  </button>
  )}
  {sent && (
  <p className="mt-4 text-sm font-semibold text-emerald-600">
    Test: Antwort wurde erfolgreich übernommen.
  </p>
)}
</div>   
    </main>
  );
}