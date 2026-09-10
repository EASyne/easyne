import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "../utils/supabase-server";
import LogoutButton from "./LogoutButton";
export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
const { data: requests, error } = await supabase
  .from("customer_requests")
  .select("*")
  .order("created_at", { ascending: false });
  if (error) {
  console.error("Fehler beim Laden der Kundenanfragen:", error);
}
  if (!user) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center">
     <div className="w-full max-w-6xl px-6 py-10">
  <div className="flex items-center justify-between">
    <div>
      <p className="text-sm font-semibold text-violet-600">EASyne</p>
      <h1 className="text-3xl font-bold text-slate-900">
        Firmen-Dashboard
      </h1>
    </div>

    <LogoutButton />
  </div>
  <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
  <div className="flex items-center justify-between">
    <div>
      <p className="text-sm font-semibold text-violet-600">
        Posteingang
      </p>
      <h2 className="text-2xl font-bold text-slate-900">
        Kundenanfragen
      </h2>
    </div>

    <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600">
      {requests?.length ?? 0} offen
    </span>
  </div>
  {requests?.map((request) => (
  <a
    key={request.id}
    href={`/dashboard/anfrage/${request.id}`}
    className="mt-6 block rounded-xl border border-slate-200 p-4 transition hover:border-violet-300 hover:shadow-sm"
  >
    <p className="font-semibold text-slate-900">
      {request.subject}
    </p>

    <span className="inline-flex rounded-full bg-violet-100 px-2 py-1 text-xs font-semibold text-violet-700">
      Neu
    </span>

    <p className="mt-1 text-xs font-medium text-slate-400">
      {request.costumer_mail}
    </p>

    <p className="mt-1 text-sm text-slate-500">
      {request.message}
    </p>
  </a>
))}
</div>
</div> 
    </main>
  );
}