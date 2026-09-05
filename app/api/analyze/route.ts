import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
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
      {
        success: false,
        error: "Zu viele Analysen in kurzer Zeit. Bitte warten Sie eine Minute.",
      },
      { status: 429 }
    );
  }

  current.count += 1;
}
    const body = await request.json();
const message = String(body.message ?? "").trim();

if (!message) {
  return Response.json(
    {
      success: false,
      error: "Bitte geben Sie zuerst eine Kundenanfrage ein.",
    },
    { status: 400 }
  );
}

if (message.length > 3000) {
  return Response.json(
    {
      success: false,
      error: "Die Kundenanfrage darf maximal 3000 Zeichen lang sein.",
    },
    { status: 400 }
  );
}
    const response = await openai.responses.create({
      model: "gpt-5.6-sol",

      input: `
Analysiere diese Kundenanfrage für EASyne.

Verwende ausschließlich Informationen aus der Kundenanfrage.
Erfinde keine Namen, E-Mail-Adressen, Termine oder anderen Kundendaten.
Wenn Name oder E-Mail nicht vorhanden sind, verwende "Nicht erkannt".

Kundenanfrage:
${message}
`,

      text: {
        format: {
          type: "json_schema",
          name: "kundenanalyse",
          strict: true,
          schema: {
            type: "object",
            properties: {
              category: {
                type: "string",
              },
              name: {
                type: "string",
              },
              email: {
                type: "string",
              },
              priority: {
                type: "string",
                enum: ["Niedrig", "Normal", "Hoch", "Sehr hoch"],
              },
              intent: {
                type: "string",
              },
              reply: {
                type: "string",
              },
            },
            required: [
              "category",
              "name",
              "email",
              "priority",
              "intent",
              "reply",
            ],
            additionalProperties: false,
          },
        },
      },
    });

    const analysis = JSON.parse(response.output_text);

    return Response.json({
      success: true,
      analysis,
    });
  } catch (error) {
    console.error("API FEHLER:", error);

    return Response.json(
      {
        success: false,
        error: String(error),
      },
      { status: 500 }
    );
  }
}