"use client";

import { useState } from "react";
import { createClient } from "../../../utils/supabase";
export default function ResponseEditor({
  initialReply,
  requestId,
  initialStatus,
  initialSent,
}: {
  initialReply: string;
  requestId: number;
  initialStatus: string;
  initialSent: boolean;
}) {
  const [reply, setReply] = useState(initialReply);
  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState(initialStatus);
  const [sending, setSending] = useState(false);
const [sent, setSent] = useState(initialSent);
const [sendError, setSendError] = useState("");
const supabase = createClient();
async function markAsDone() {
  const { error } = await supabase
    .from("customer_requests")
    .update({ status: "erledigt" })
    .eq("id", requestId);

  if (error) {
  console.error("Status konnte nicht gespeichert werden:", error);
  alert(error.message);
  return;
}

setStatus("erledigt");
}
  async function copyReply() {
    await navigator.clipboard.writeText(reply);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  }
async function sendReply() {
  setSending(true);
  setSent(false);
  setSendError("");

  try {
    const response = await fetch("/api/send-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        requestId,
        text: reply,
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.error || "E-Mail konnte nicht gesendet werden.");
    }

    setSent(true);
  } catch (error) {
    setSendError(
      error instanceof Error
        ? error.message
        : "E-Mail konnte nicht gesendet werden."
    );
  } finally {
    setSending(false);
  }
}
  return (
    <div className="mt-6">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        Antwortvorschlag
      </p>

      <textarea
        value={reply}
        onChange={(e) => setReply(e.target.value)}
        rows={5}
        className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 p-4 text-slate-700 outline-none focus:border-violet-400"
      />

      <button
        onClick={copyReply}
        className="mt-3 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
      >
        {copied ? "Kopiert ✓" : "Antwort kopieren"}
      </button>
      <button
  type="button"
  onClick={sendReply}
  disabled={sending || sent || !reply.trim()}
  className="ml-3 mt-3 rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
>
  {sending ? "Wird gesendet..." : sent ? "Gesendet ✓" : "Antwort senden"}
</button>
{sendError && (
  <p className="mt-2 text-sm font-medium text-red-600">
    {sendError}
  </p>
)}
      <button
  type="button"
  onClick={markAsDone}
  disabled={status === "erledigt"}
  className="ml-3 mt-3 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
>
  {status === "erledigt" ? "Erledigt ✓" : "Als erledigt markieren"}
</button>
<p className="mt-3 text-sm font-medium text-slate-500">
  Status: {status}
</p>
    </div>
  );
}