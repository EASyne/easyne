import { Resend } from "resend";
import { createServerSupabaseClient } from "../../utils/supabase-server";
import { createClient } from "@supabase/supabase-js";
const resend = new Resend(process.env.RESEND_API_KEY);
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }
);
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
    const { data: rateLimited, error: rateLimitError } =
  await supabaseAdmin.rpc("check_email_send_rate_limit", {
    p_user_id: user.id,
  });

if (rateLimitError) {
  console.error("Email rate limit error:", rateLimitError);

  return Response.json(
    { success: false, error: "E-Mail konnte nicht verarbeitet werden." },
    { status: 500 }
  );
}

if (rateLimited) {
  return Response.json(
    {
      success: false,
      error:
        "Zu viele E-Mails in kurzer Zeit. Bitte versuchen Sie es in einer Minute erneut.",
    },
    { status: 429 }
  );
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