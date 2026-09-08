"use client";

import { useRouter } from "next/navigation";
import { createClient } from "../utils/supabase";

export default function LogoutButton() {
  const router = useRouter();
  const supabase = createClient();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className="rounded-xl bg-slate-900 px-5 py-3 font-semibold text-white"
    >
      Abmelden
    </button>
  );
}