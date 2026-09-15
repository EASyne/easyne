import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
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