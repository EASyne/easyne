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
  const ip =
  request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
  request.headers.get("x-real-ip") ||
  "unknown";
 const ipHash = await crypto.subtle.digest(
  "SHA-256",
  new TextEncoder().encode(ip)
);

const ipHashHex = Array.from(new Uint8Array(ipHash))
  .map((byte) => byte.toString(16).padStart(2, "0"))
  .join("");

const { data: rateLimited, error: rateLimitError } =
  await supabaseAdmin.rpc("check_contact_rate_limit", {
    p_ip_hash: ipHashHex,
  });

if (rateLimitError) {
  console.error("Contact rate limit error:", rateLimitError);

  return Response.json(
    { error: "Anfrage konnte nicht verarbeitet werden." },
    { status: 500 }
  );
}

if (rateLimited) {
  return Response.json(
    {
      error:
        "Zu viele Anfragen. Bitte versuchen Sie es in einer Minute erneut.",
    },
    { status: 429 }
  );
}
    const { name, email, company, message } = await request.json();

    if (
  typeof name !== "string" ||
  typeof email !== "string" ||
  typeof message !== "string" ||
  (company !== undefined && typeof company !== "string") ||
  name.trim().length < 2 ||
  name.trim().length > 100 ||
  email.trim().length > 254 ||
  !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ||
  message.trim().length < 2 ||
  message.trim().length > 5000 ||
  (typeof company === "string" && company.trim().length > 150)
) {
  return Response.json(
    { error: "Bitte überprüfen Sie Ihre Eingaben." },
    { status: 400 }
  );
}

    const { error } = await resend.emails.send({
      from: "EASyne <support@easyne.ch>",
      to: ["support@easyne.ch"],
      replyTo: email,
      subject: `Neue Kontaktanfrage von ${name}`,
      text: `
Neue Kontaktanfrage über easyne.ch

Name: ${name}
E-Mail: ${email}
Unternehmen: ${company || "Nicht angegeben"}

Nachricht:
${message}
      `.trim(),
    });

    if (error) {
      console.error("Resend Fehler:", error);

      return Response.json(
        { error: "Nachricht konnte nicht gesendet werden." },
        { status: 500 }
      );
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error("Kontaktformular Fehler:", error);

    return Response.json(
      { error: "Ein Fehler ist aufgetreten." },
      { status: 500 }
    );
  }
}