import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function analyzeRequest(
  message: string,
  language: string = "Deutsch"
) {
      const response = await openai.responses.create({
    model: "gpt-5.6-sol",

    input: `
Analysiere diese Kundenanfrage für EASyne.
Erstelle die gesamte Analyse und die vorgeschlagene Antwort auf ${language}.
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

  return JSON.parse(response.output_text);
}