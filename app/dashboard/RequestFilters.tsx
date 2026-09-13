"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function RequestFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const search = searchParams.get("search") ?? "";
  const status = searchParams.get("status") ?? "alle";
  const priority = searchParams.get("priority") ?? "alle";

  function updateParams(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());

    if (!value || value === "alle") {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    router.replace(`/dashboard?${params.toString()}`);
  }

  return (
    <div className="mb-6 flex flex-col gap-3 md:flex-row">
      <input
        type="text"
        placeholder="Kundenanfragen durchsuchen..."
        defaultValue={search}
        onChange={(e) => updateParams("search", e.target.value)}
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none focus:border-violet-400"
      />

      <select
        value={status}
        onChange={(e) => updateParams("status", e.target.value)}
        className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none focus:border-violet-400"
      >
        <option value="alle">Alle Status</option>
        <option value="neu">Neu</option>
        <option value="erledigt">Erledigt</option>
      </select>

      <select
        value={priority}
        onChange={(e) => updateParams("priority", e.target.value)}
        className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none focus:border-violet-400"
      >
        <option value="alle">Alle Prioritäten</option>
        <option value="Niedrig">Niedrig</option>
        <option value="Normal">Normal</option>
        <option value="Hoch">Hoch</option>
        <option value="Sehr hoch">Sehr hoch</option>
      </select>
    </div>
  );
}