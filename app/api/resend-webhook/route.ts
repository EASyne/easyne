import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

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