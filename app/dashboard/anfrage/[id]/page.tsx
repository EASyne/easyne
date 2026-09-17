import { createServerSupabaseClient } from "../../../utils/supabase-server";
import { analyzeRequest } from "../../../utils/analyze-request";
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
  const { data: customerHistory } = await supabase
  .from("customer_requests")
  .select("id, created_at, subject, status")
  .eq("costumer_mail", request.costumer_mail)
  .neq("id", request.id)
  .order("created_at", { ascending: false });
  let analysis = null;

if (
  request.ai_category &&
  request.ai_priority &&
  request.ai_intent &&
  request.ai_reply
) {
  analysis = {
    category: request.ai_category,
    priority: request.ai_priority,
    intent: request.ai_intent,
    reply: request.ai_reply,
  };
}
if (!analysis) {
const data = {
  analysis: await analyzeRequest(request.message, "Deutsch"),
};
analysis = data.analysis;
if (analysis) {
  await supabase
    .from("customer_requests")
    .update({
      ai_category: analysis.category,
      ai_priority: analysis.priority,
      ai_intent: analysis.intent,
      ai_reply: analysis.reply,
    })
    .eq("id", id);
}
}
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
        {customerHistory && customerHistory.length > 0 && (
  <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
    <p className="text-sm font-semibold text-violet-600">
      Kundenverlauf
    </p>

    <h2 className="mt-2 text-xl font-bold text-slate-900">
      Frühere Anfragen
    </h2>

    <div className="mt-4 space-y-3">
      {customerHistory.map((item) => (
        <a
          key={item.id}
          href={`/dashboard/anfrage/${item.id}`}
          className="block rounded-xl border border-slate-200 p-4 transition hover:border-violet-300"
        >
          <p className="font-semibold text-slate-900">
            {item.subject}
          </p>

          <p className="mt-1 text-sm text-slate-500">
            {new Date(item.created_at).toLocaleDateString("de-CH")} ·{" "}
            {item.status === "erledigt" ? "Erledigt" : "Offen"}
          </p>
        </a>
      ))}
    </div>
  </div>
)}
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
  initialSent={Boolean(request.reply_sent_at)}
/>
</div>
      </div>
    </main>
  );
}