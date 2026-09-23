import { createServerSupabaseClient } from "../../utils/supabase-server";
import { analyzeRequest } from "../../utils/analyze-request";
import { createClient } from "@supabase/supabase-js";
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
const { data: rateLimited, error: rateLimitError } =
  await supabaseAdmin.rpc("check_analyze_rate_limit", {
    p_user_id: user.id,
  });

if (rateLimitError) {
  console.error("Analyze rate limit error:", rateLimitError);

  return Response.json(
    {
      success: false,
      error: "Analyse konnte nicht verarbeitet werden.",
    },
    { status: 500 }
  );
}

if (rateLimited) {
  return Response.json(
    {
      success: false,
      error:
        "Zu viele Analysen in kurzer Zeit. Bitte warten Sie eine Minute.",
    },
    { status: 429 }
  );
}
  
    const body = await request.json();
const message =
  typeof body.message === "string" ? body.message.trim() : "";

const language =
  typeof body.language === "string" ? body.language.trim() : "Deutsch";
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