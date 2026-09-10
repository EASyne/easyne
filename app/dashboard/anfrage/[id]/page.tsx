import { createServerSupabaseClient } from "../../../utils/supabase-server";
import { redirect } from "next/navigation";

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

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold text-slate-900">
          Kundenanfrage
        </h1>

        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-violet-600">
            {request.costomer_mail}
          </p>

          <h2 className="mt-2 text-xl font-bold text-slate-900">
            {request.subject}
          </h2>

          <p className="mt-4 text-slate-600">
            {request.message}
          </p>
        </div>
      </div>
    </main>
  );
}