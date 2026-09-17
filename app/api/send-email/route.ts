import { Resend } from "resend";
import { createServerSupabaseClient } from "../../utils/supabase-server";

const resend = new Resend(process.env.RESEND_API_KEY);
const rateLimit = new Map<string, { count: number; resetTime: number }>();
export async function POST(request: Request) {
  try {
    const supabase = await createServerSupabaseClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return Response.json(
        { success: false, error: "Nicht angemeldet." },
        { status: 401 }
      );
    }
const now = Date.now();
const current = rateLimit.get(user.id);

if (!current || now > current.resetTime) {
  rateLimit.set(user.id, {
    count: 1,
    resetTime: now + 60_000,
  });
} else {
  if (current.count >= 5) {
    return Response.json(
      {
        success: false,
        error: "Zu viele E-Mails. Bitte warten Sie eine Minute.",
      },
      { status: 429 }
    );
  }

  current.count += 1;
}
    const body = await request.json();
    const requestId = Number(body.requestId);
    const text = String(body.text ?? "").trim();

    if (!Number.isInteger(requestId) || requestId <= 0) {
      return Response.json(
        { success: false, error: "Ungültige Anfrage." },
        { status: 400 }
      );
    }

    if (!text || text.length > 10000) {
      return Response.json(
        { success: false, error: "Ungültiger Antworttext." },
        { status: 400 }
      );
    }

    const { data: customerRequest, error: requestError } = await supabase
      .from("customer_requests")
      .select("id, costumer_mail, subject")
      .eq("id", requestId)
      .single();

    if (requestError || !customerRequest) {
      return Response.json(
        { success: false, error: "Anfrage nicht gefunden." },
        { status: 404 }
      );
    }

    const { data, error } = await resend.emails.send({
      from: "EASyne <support@easyne.ch>",
      to: customerRequest.costumer_mail,
      subject: `Re: ${customerRequest.subject}`,
      text,
    });

    if (error) {
      console.error("Resend Fehler:", error);

      return Response.json(
        { success: false, error: "E-Mail konnte nicht gesendet werden." },
        { status: 500 }
      );
    }

    
    const { error: updateError } = await supabase
  .from("customer_requests")
  .update({ reply_sent_at: new Date().toISOString() })
  .eq("id", requestId);

if (updateError) {
  console.error("Versandstatus konnte nicht gespeichert werden:", updateError);
}
return Response.json({
  success: true,
  data,
});
  } catch (error) {
    console.error("Send email Fehler:", error);
    
    return Response.json(
      { success: false, error: "E-Mail konnte nicht gesendet werden." },
      { status: 500 }
    );
  }
}