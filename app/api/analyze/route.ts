import { createServerSupabaseClient } from "../../utils/supabase-server";
import { analyzeRequest } from "../../utils/analyze-request";
const rateLimit = new Map<string, { count: number; resetTime: number }>();
export async function POST(request: Request) {
  try {
    const supabase = await createServerSupabaseClient();

const {
  data: { user },
  error: authError,
} = await supabase.auth.getUser();

if (authError || !user) {
  return Response.json(
    {
      success: false,
      error: "Nicht autorisiert.",
    },
    { status: 401 }
  );
}
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
const language = String(body.language ?? "Deutsch");
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
   const analysis = await analyzeRequest(message, language); 

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