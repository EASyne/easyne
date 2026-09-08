import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "../utils/supabase-server";
import LogoutButton from "./LogoutButton";
export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center">
      <h1 className="text-3xl font-bold text-slate-900">
        EASyne Firmenbereich
      </h1>
      <LogoutButton />
    </main>
  );
}