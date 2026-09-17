import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const rateLimit = new Map<string, { count: number; resetTime: number }>();
export async function POST(request: Request) {
  try {
  const ip =
  request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
  request.headers.get("x-real-ip") ||
  "unknown";

const now = Date.now();
const current = rateLimit.get(ip);

if (!current || now > current.resetTime) {
  rateLimit.set(ip, {
    count: 1,
    resetTime: now + 60_000,
  });
} else {
  if (current.count >= 3) {
    return Response.json(
      { error: "Zu viele Anfragen. Bitte versuchen Sie es in einer Minute erneut." },
      { status: 429 }
    );
  }

  current.count += 1;
}  
    const { name, email, company, message } = await request.json();

    if (!name || !email || !message) {
      return Response.json(
        { error: "Bitte füllen Sie alle Pflichtfelder aus." },
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