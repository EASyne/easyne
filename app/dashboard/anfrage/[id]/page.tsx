import { createServerSupabaseClient } from "../../../utils/supabase-server";
import { redirect } from "next/navigation";
import ResponseEditor from "./ResponseEditor";
export default async function AnfrageDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: request } = await supabase
    .from("customer_requests")
    .select("*")
    .eq("id", id)
    .single();

  if (!request) {
    return <main className="p-6">Anfrage nicht gefunden.</main>;
  }
const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

const response = await fetch(`${baseUrl}/api/analyze`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    message: request.message,
    language: "Deutsch",
  }),
  cache: "no-store",
});

const data = await response.json();
const analysis = data.analysis;
  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold text-slate-900">
          Kundenanfrage
        </h1>

        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-violet-600">
            {request.costumer_mail}
          </p>

          <h2 className="mt-2 text-xl font-bold text-slate-900">
            {request.subject}
          </h2>

          <p className="mt-4 text-slate-600">
            {request.message}
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
      {analysis?.category}
    </p>
  </div>

  <div className="mt-6">
    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
      Dringlichkeit
    </p>
    <p className="mt-1 font-semibold text-slate-900">
      {analysis?.priority}
    </p>
  </div>

  <div className="mt-6">
    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
      Anliegen
    </p>
    <p className="mt-1 text-slate-700">
      {analysis?.intent}
    </p>
  </div>

  <ResponseEditor
  initialReply={analysis?.reply ?? ""}
  requestId={Number(id)}
  initialStatus={request.status ?? "neu"}
/>
</div>
      </div>
    </main>
  );
}