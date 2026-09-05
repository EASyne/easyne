"use client";

import { useEffect, useRef, useState } from "react";

export default function Home() {
  const [message, setMessage] = useState("");
const [result, setResult] = useState<string | null>(null);
const [loading, setLoading] = useState(false);
const [copied, setCopied] = useState(false);
const [error, setError] = useState("");
const resultRef = useRef<HTMLDivElement | null>(null);
const messageRef = useRef<HTMLTextAreaElement>(null);
useEffect(() => {
  if (result && resultRef.current) {
    resultRef.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }
}, [result]);
  const problems = [
    {
      title: "E-Mails & Anfragen",
      text: "Wichtige Anfragen gehen unter oder werden zu spät beantwortet.",
    },
    {
      title: "Dateneingabe",
      text: "Daten werden manuell übertragen, geprüft und in verschiedene Systeme eingepflegt.",
    },
    {
      title: "Follow-ups",
      text: "Nachfassen bei Kunden kostet Zeit und wird im Alltag schnell vergessen.",
    },
    {
      title: "Dokumente & Reports",
      text: "Berichte, Auswertungen und Dokumente werden immer wieder manuell erstellt.",
    },
    {
      title: "Prozesse & Übergaben",
      text: "Informationen gehen verloren und Abläufe sind oft unnötig kompliziert.",
    },
  ];

  const steps = [
    {
      number: "01",
      title: "Prozess analysieren",
      text: "Wir schauen gemeinsam auf Ihre Abläufe und finden das größte Automatisierungspotenzial.",
    },
    {
      number: "02",
      title: "Lösung entwickeln",
      text: "Wir entwerfen eine maßgeschneiderte Automation passend zu Ihrem Unternehmen.",
    },
    {
      number: "03",
      title: "Umsetzen & testen",
      text: "Wir bauen die Lösung, testen sie gründlich und integrieren sie in Ihren Alltag.",
    },
    {
      number: "04",
      title: "Entlastung starten",
      text: "Sie sparen Zeit, reduzieren Fehler und gewinnen Kapazität für wichtigere Aufgaben.",
    },
  ];

  return (
    <main className="min-h-screen bg-white text-slate-950">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#070b1c]/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <a href="#" className="group flex items-center gap-3">
  <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-indigo-500 via-violet-500 to-purple-600 shadow-lg shadow-indigo-500/20">
    <span className="relative z-10 text-lg font-black text-white">E</span>
    <div className="absolute inset-0 translate-y-full bg-white/15 transition duration-300 group-hover:translate-y-0" />
  </div>

  <div className="flex items-baseline">
    <span className="text-2xl font-bold tracking-tight text-white">EASy</span>
    <span className="text-2xl font-light tracking-tight text-indigo-400">ne</span>
  </div>
</a>

          <nav className="hidden items-center gap-8 text-sm text-slate-300 md:flex">
            <a href="#leistungen" className="transition hover:text-white">
              Leistungen
            </a>
            <a href="#ablauf" className="transition hover:text-white">
              So funktioniert&apos;s
            </a>
            <a href="#kontakt" className="transition hover:text-white">
              Kontakt
            </a>
          </nav>

          <a
            href="#analyse"
            className="rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 px-3 py-2 md:px-5 md:py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:scale-[1.02]"
          >
            Kostenlose Analyse
          </a>
        </div>
      </header>

      <section className="relative overflow-hidden bg-gradient-to-b from-[#f7f8ff] to-white">
        <div className="absolute inset-x-0 top-0 -z-0 h-96 bg-[radial-gradient(circle_at_75%_25%,rgba(99,102,241,0.14),transparent_35%)]" />

        <div className="relative mx-auto grid max-w-7xl gap-14 px-6 py-10 lg:grid-cols-2 lg:items-center lg:px-8 lg:py-14">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-indigo-600 shadow-sm">
              Automatisierung, die wirklich entlastet
            </div>

            <h1 className="max-w-3xl text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl">
              Wir nehmen Ihrem Unternehmen{" "}
              <span className="bg-gradient-to-r from-indigo-500 to-violet-600 bg-clip-text text-transparent">
                repetitive Arbeit
              </span>{" "}
              ab.
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-600">
              EASyne automatisiert wiederkehrende Prozesse – von
              Kundenanfragen und E-Mails bis zu Datenerfassung und Follow-ups.
              Damit Ihr Team mehr Zeit für das Wesentliche hat.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <a
                href="#kontakt"
                className="rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 px-6 py-4 text-center font-semibold text-white shadow-xl shadow-indigo-500/20 transition hover:-translate-y-0.5"
              >
                Kostenlose Prozessanalyse
              </a>

              <a
                href="#ablauf"
                className="rounded-xl border border-slate-300 bg-white px-6 py-4 text-center font-semibold text-slate-900 transition hover:border-slate-400"
              >
                So funktioniert&apos;s
              </a>
            </div>

            <div className="mt-9 flex flex-wrap gap-x-8 gap-y-4 text-sm text-slate-600">
              <span>✓ Mehr Zeit sparen</span>
              <span>✓ Fehler reduzieren</span>
              <span>✓ Schneller reagieren</span>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-10 rounded-full bg-indigo-200/40 blur-3xl" />

            <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-5 shadow-2xl shadow-slate-300/50">
              <div className="rounded-[1.5rem] bg-[#080d22] p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">EASyne Workflow</p>
                    <h2 className="mt-1 text-xl font-semibold">
                      Kundenanfrage automatisch bearbeiten
                    </h2>
                  </div>

                  <div className="h-3 w-3 rounded-full bg-emerald-400" />
                </div>

                <div className="mt-8 space-y-4">
                  {[
                    "Neue Anfrage empfangen",
                    "Daten automatisch erfassen",
                    "Anfrage kategorisieren",
                    "Antwort vorbereiten",
                    "Team benachrichtigen",
                  ].map((item, index) => (
                    <div
                      key={item}
                      className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4"
                    >
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-500 font-semibold">
                        {index + 1}
                      </div>
                      <span className="text-sm text-slate-200">{item}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-5 rounded-2xl bg-emerald-400/10 p-4 text-sm text-emerald-300">
                  ✓ Prozess erfolgreich automatisiert
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="leistungen" className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-indigo-600">
          Das kennen Sie?
        </p>

        <h2 className="mt-4 max-w-3xl text-4xl font-bold tracking-tight">
          Zu viel manuelle Arbeit kostet Zeit und Geld.
        </h2>

        <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-5">
          {problems.map((problem) => (
            <div
              key={problem.title}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-xl text-indigo-600">
                ✦
              </div>

              <h3 className="font-semibold">{problem.title}</h3>

              <p className="mt-3 text-sm leading-6 text-slate-600">
                {problem.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#070b1c] text-white">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-24 lg:grid-cols-[1.1fr_1fr] lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-indigo-400">
              Unsere Lösung
            </p>

            <h2 className="mt-4 max-w-2xl text-4xl font-bold leading-tight">
              Automatisierungen, die Ihr Unternehmen{" "}
              <span className="text-indigo-400">wirklich voranbringen.</span>
            </h2>

            <p className="mt-6 max-w-2xl leading-7 text-slate-400">
              Wir analysieren Ihre Prozesse, entwickeln maßgeschneiderte
              Automationen und integrieren sie nahtlos in Ihre bestehenden
              Systeme.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-3">
            {[
              ["01", "Prozesse verstehen"],
              ["02", "Automationen bauen"],
              ["03", "Entlastung genießen"],
            ].map(([number, title]) => (
              <div
                key={title}
                className="rounded-2xl border border-white/10 bg-white/5 p-6"
              >
                <div className="text-sm font-semibold text-indigo-400">
                  {number}
                </div>
                <h3 className="mt-8 font-semibold">{title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>
<section id="analyse" className="scroll-mt-28 bg-slate-50">
  <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
    <div className="mx-auto max-w-3xl text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-indigo-600">
        Live Demo
      </p>

      <h2 className="mt-4 text-4xl font-bold tracking-tight">
        Testen Sie EASyne selbst.
      </h2>

      <p className="mt-5 text-lg leading-8 text-slate-600">
        Geben Sie eine typische Kundenanfrage ein. EASyne analysiert sie und
        bereitet die wichtigsten Informationen automatisch auf.
      </p>
    </div>

    <div
  className="mx-auto mt-12 max-w-4xl rounded-3xl border border-slate-200 bg-white p-6 shadow..."
>
      <label className="text-sm font-semibold text-slate-900">
        Beispiel-Kundenanfrage
      </label>

      <textarea
      ref={messageRef}
      maxLength={3000}
      value={message}
onChange={(e) => setMessage(e.target.value)}
        className="mt-3 min-h-44 w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 p-5 text-slate-900 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
        placeholder="Hallo, ich interessiere mich für Ihre Dienstleistung und hätte gerne nächste Woche einen Termin..."
      />
<p className="mt-2 text-right text-sm text-slate-500">
  {message.length} / 3000 Zeichen
</p>
      <button
      disabled={loading}
  onClick={async () => {
    setError("");
    if (!message.trim()) {
  setError("Bitte geben Sie zuerst eine Kundenanfrage ein.");
  return;
}
    try {
    setLoading(true);
    const response = await fetch("/api/analyze", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ message }),
});

const data = await response.json();
if (!response.ok || !data.success) {
  setError(data.error || "Die KI-Analyse konnte nicht durchgeführt werden.");
  setResult("");
  setLoading(false);
  return;
}
console.log(data);
setError("");
setResult(
  data.analysis
    ? `Kategorie: ${data.analysis.category}
Name: ${data.analysis.name}
E-Mail: ${data.analysis.email}
Priorität: ${data.analysis.priority}
Erkanntes Anliegen: ${data.analysis.intent}

Antwortvorschlag:
${data.analysis.reply}`
    : data.error ?? "Unbekannter API-Fehler"
);
setLoading(false);
} catch (error) {
  setError("Die KI-Analyse konnte nicht durchgeführt werden.");
  setLoading(false);
}
return;
    const text = message.toLowerCase();
const emailMatch = message.match(
  /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i
);

const nameMatch = message.match(
  /(?:ich heiße|mein name ist|ich bin)\s+([A-ZÄÖÜ][a-zäöüß]+(?:\s+[A-ZÄÖÜ][a-zäöüß]+)?)/i
);

const detectedEmail = emailMatch?.[0] ?? "Nicht erkannt";
const detectedName = nameMatch?.[1] ?? "Nicht erkannt";
let detectedPriority = "Normal";

if (
  text.includes("dringend") ||
  text.includes("sofort") ||
  text.includes("schnellstmöglich") ||
  text.includes("eilig")
) {
  detectedPriority = "Hoch";
}

if (
  text.includes("notfall") ||
  text.includes("sofortige hilfe") ||
  text.includes("funktioniert gar nicht")
) {
  detectedPriority = "Sehr hoch";
}
    if (!text.trim()) return;

    if (
      text.includes("rechnung") ||
      text.includes("zahlung") ||
      text.includes("bezahlt")
    ) {
      setResult(
        `Kategorie: Rechnung / Zahlung
        Name: ${detectedName}
E-Mail: ${detectedEmail}
Priorität: ${detectedPriority}
Erkanntes Anliegen: Frage zu einer Rechnung oder Zahlung

Antwortvorschlag:
Vielen Dank für Ihre Nachricht. Wir prüfen Ihre Rechnung bzw. Zahlung und melden uns schnellstmöglich mit einer Rückmeldung bei Ihnen.`
      );
    } else if (
      text.includes("termin") ||
      text.includes("meeting") ||
      text.includes("besprechen")
    ) {
      setResult(
        `Kategorie: Kundenanfrage
        Name: ${detectedName}
E-Mail: ${detectedEmail}
Priorität: ${detectedPriority}
Erkanntes Anliegen: Termin / Beratung

Antwortvorschlag:
Vielen Dank für Ihre Anfrage. Gerne besprechen wir Ihr Anliegen persönlich mit Ihnen und finden einen passenden Termin.`
      );
    } else if (
      text.includes("problem") ||
      text.includes("beschwerde") ||
      text.includes("funktioniert nicht")
    ) {
      setResult(
        `Kategorie: Support / Beschwerde
Name: ${detectedName}
E-Mail: ${detectedEmail}
Priorität: ${detectedPriority}
Erkanntes Anliegen: Problem oder dringende Rückfrage

Antwortvorschlag:
Vielen Dank für Ihre Nachricht. Wir schauen uns das Problem so schnell wie möglich an und melden uns zeitnah mit einer Lösung bei Ihnen.`
      );
    } else {
      setResult(
        `Kategorie: Allgemeine Anfrage
        Name: ${detectedName}
E-Mail: ${detectedEmail}
Priorität: ${detectedPriority}
Erkanntes Anliegen: Allgemeine Kontaktaufnahme

Antwortvorschlag:
Vielen Dank für Ihre Nachricht. Wir haben Ihre Anfrage erhalten und melden uns schnellstmöglich persönlich bei Ihnen.`
      );
    }
  }}
  className="mt-5 w-full rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 px-6 py-4 font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:-translate-y-0.5"
>
  {loading ? "KI analysiert..." : "Anfrage analysieren"}
</button>
{error && (
  <div className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-300">
    <p className="font-semibold">
  {error === "Bitte geben Sie zuerst eine Kundenanfrage ein."
    ? "Eingabe erforderlich"
    : "Analyse fehlgeschlagen"}
</p>
    <p className="mt-1 text-sm">{error}</p>
  </div>
)}
{result && (
  <div
  ref={resultRef}
  className="mt-6 scroll-mt-36 whitespace-pre-line rounded-3xl ..."
>
    <div className="grid gap-6">
 <div className="grid gap-2 md:grid-cols-2">
  {result
    .split("Antwortvorschlag:")[0]
    .trim()
    .split("\n")
    .map((line) => {
      const [label, ...rest] = line.split(":");
      const value = rest.join(":").trim();
      const isPriority = label === "Priorität";

      const priorityStyle =
        value === "Sehr hoch"
          ? "bg-red-100 text-red-700 border-red-200"
          : value === "Hoch"
            ? "bg-orange-100 text-orange-700 border-orange-200"
            : "bg-emerald-100 text-emerald-700 border-emerald-200";

      return (
        <div
          key={line}
          className="rounded-2xl border border-slate-200 bg-slate-50 p-1"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
            {label}
          </p>

          {isPriority ? (
            <span
              className={`mt-2 inline-flex rounded-full border px-3 py-1 text-sm font-semibold ${priorityStyle}`}
            >
              {value}
            </span>
          ) : (
            <p className="mt-2 font-semibold text-slate-900">
              {value}
            </p>
          )}
        </div>
      );
    })}
</div>

  <div className="rounded-2xl bg-slate-950 p-6 text-white">
    <p className="mb-3 text-sm font-semibold text-indigo-400">
      Antwortvorschlag
    </p>

    <p className="whitespace-pre-line leading-7 text-slate-200">
      {result.split("Antwortvorschlag:")[1]?.trim()}
    </p>
    <button
  onClick={async () => {
  await navigator.clipboard.writeText(
    result.split("Antwortvorschlag:")[1]?.trim() ?? ""
  );

  setCopied(true);

  setTimeout(() => {
    setCopied(false);
  }, 2000);
}}
  className="mt-4 rounded-lg bg-indigo-500 px-4 py-2 text-sm font-semibold text-white"
>
  {copied ? "✓ Erfolgreich kopiert" : "Antwort kopieren"}
</button>
<button
  onClick={() => {
    setMessage("");
    setResult("");
    setError("");
    setCopied(false);
    messageRef.current?.focus();
    messageRef.current?.scrollIntoView({
  behavior: "smooth",
  block: "center",
});
  }}
  className="mt-3 rounded-lg border border-white/20 px-4 py-2 text-sm font-semibold text-white"
>
  Neue Anfrage
</button>
  </div>
</div>
  </div>
)}
    </div>
  </div>
</section>
      <section id="ablauf" className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-indigo-600">
          So funktioniert&apos;s
        </p>

        <h2 className="mt-4 text-4xl font-bold tracking-tight">
          In 4 Schritten zu mehr Zeit fürs Kerngeschäft.
        </h2>

        <div className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => (
            <div key={step.number}>
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-violet-600 font-semibold text-white">
                {step.number}
              </div>

              <h3 className="text-lg font-semibold">{step.title}</h3>

              <p className="mt-3 text-sm leading-6 text-slate-600">
                {step.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section id="kontakt" className="px-6 pb-24 lg:px-8">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-gradient-to-r from-[#0b1030] via-[#171057] to-[#3020a6] px-8 py-12 text-white shadow-2xl md:px-14 md:py-16">
          <div className="grid gap-10 lg:grid-cols-[1.3fr_auto] lg:items-center">
            <div>
              <h2 className="max-w-3xl text-4xl font-bold leading-tight">
                Bereit, Ihrem Unternehmen die Routinearbeit abzunehmen?
              </h2>

              <p className="mt-5 max-w-2xl leading-7 text-indigo-100">
                Lassen Sie uns gemeinsam herausfinden, welches
                Automatisierungspotenzial in Ihren Prozessen steckt.
              </p>
            </div>

            <a
              href="mailto:ermal.easyne@outlook.com"
              className="rounded-xl bg-white px-7 py-4 text-center font-semibold text-slate-950 transition hover:scale-[1.02]"
            >
              Kostenlose Analyse sichern →
            </a>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <span>© 2026 EASyne</span>
          <span>Automatisierung für moderne Unternehmen.</span>
        </div>
      </footer>
    </main>
  );
}