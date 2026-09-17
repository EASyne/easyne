import { Resend } from "resend";
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
    const payload = await request.text();

    const event = resend.webhooks.verify({
      payload,
      headers: {
        id: request.headers.get("svix-id") ?? "",
        timestamp: request.headers.get("svix-timestamp") ?? "",
        signature: request.headers.get("svix-signature") ?? "",
      },
      webhookSecret: process.env.RESEND_WEBHOOK_SECRET ?? "",
    });

    console.log("Verifizierter Resend Webhook:", event);
    if (event.type === "email.received") {
  const { data: email, error } = await resend.emails.receiving.get(
    event.data.email_id
  );

  if (error) {
    console.error("E-Mail-Inhalt konnte nicht geladen werden:", error);

    return Response.json(
      { success: false },
      { status: 500 }
    );
  }

  
  const from = email.from ?? "";
const emailMatch = from.match(/<([^>]+)>/);
const customerEmail = emailMatch ? emailMatch[1] : from;
const recipients = Array.isArray(event.data.to)
  ? event.data.to
  : [event.data.to];

const { data: company, error: companyError } = await supabaseAdmin
  .from("companies")
  .select("id")
  .in("inbound_email", recipients)
  .maybeSingle();

if (companyError || !company) {
  console.error("Keine passende Firma gefunden:", companyError);

  return Response.json(
    { success: false, error: "Keine passende Firma gefunden" },
    { status: 400 }
  );
}
const { error: insertError } = await supabaseAdmin
  .from("customer_requests")
  .insert({
    costumer_mail: customerEmail,
    subject: email.subject || "Ohne Betreff",
    message: email.text || "Keine Textnachricht vorhanden.",
    status: "neu",
    resend_email_id: event.data.email_id,
    company_id: company.id,
  });

if (insertError) {
  if (insertError.code === "23505") {
    console.log("E-Mail wurde bereits gespeichert.");
  } else {
    console.error("Kundenanfrage konnte nicht gespeichert werden:", insertError);

    return Response.json(
      { success: false },
      { status: 500 }
    );
  }
}
}
    return Response.json({
      success: true,
    });
  } catch (error) {
    console.error("Ungültiger Resend Webhook:", error);

    return Response.json(
      { success: false },
      { status: 401 }
    );
  }
}