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
    const forwardedFor = request.headers.get("x-forwarded-for");
const ip = forwardedFor?.split(",")[0]?.trim() || "unknown";
const ipHash = await crypto.subtle.digest(
  "SHA-256",
  new TextEncoder().encode(ip)
);

const ipHashHex = Array.from(new Uint8Array(ipHash))
  .map((byte) => byte.toString(16).padStart(2, "0"))
  .join("");

const { data: rateLimited, error: rateLimitError } =
  await supabaseAdmin.rpc("check_registration_rate_limit", {
    p_ip_hash: ipHashHex,
  });

if (rateLimitError) {
  console.error("Registration rate limit error:", rateLimitError);
  return Response.json(
    { success: false, error: "Registrierung konnte nicht verarbeitet werden." },
    { status: 500 }
  );
}

if (rateLimited) {
  return Response.json(
    {
      success: false,
      error:
        "Zu viele Registrierungsversuche. Bitte versuchen Sie es später erneut.",
    },
    { status: 429 }
  );
}

    const body = await request.json();

    const companyName =
  typeof body.companyName === "string" ? body.companyName.trim() : "";

const email =
  typeof body.email === "string" ? body.email.trim().toLowerCase() : "";

const userId =
  typeof body.userId === "string" ? body.userId.trim() : "";
    if (!companyName || !email || !userId) {
      return Response.json(
        { success: false, error: "Bitte füllen Sie alle Felder aus." },
        { status: 400 }
      );
    }
    const { data: userData, error: userError } =
  await supabaseAdmin.auth.admin.getUserById(userId);

if (
  userError ||
  !userData.user ||
  userData.user.email?.toLowerCase() !== email
) {
  return Response.json(
    {
      success: false,
      error: "Benutzer konnte nicht verifiziert werden.",
    },
    { status: 400 }
  );
}
const { data: existingProfile, error: existingProfileError } =
  await supabaseAdmin
    .from("profiles")
    .select("id")
    .eq("id", userId)
    .maybeSingle();

if (existingProfileError) {
  return Response.json(
    {
      success: false,
      error: "Registrierung konnte nicht geprüft werden.",
    },
    { status: 500 }
  );
}

if (existingProfile) {
  return Response.json(
    {
      success: false,
      error: "Für diese E-Mail besteht bereits ein EASyne-Konto.",
    },
    { status: 409 }
  );
}
    

const emailSlug = companyName
  .toLowerCase()
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "")
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/^-|-$/g, "")
  .slice(0, 30);

const randomSuffix = crypto.randomUUID().slice(0, 6);
const inboundEmail = `${emailSlug || "firma"}-${randomSuffix}@in.easyne.ch`;
const { data: company, error: companyError } = await supabaseAdmin
  .from("companies")
  .insert({
  name: companyName,
  inbound_email: inboundEmail,
})
  .select("id")
  .single();

if (companyError || !company) {
  

  return Response.json(
    {
      success: false,
      error: "Unternehmen konnte nicht erstellt werden.",
    },
    { status: 500 }
  );
}
const { error: profileError } = await supabaseAdmin
  .from("profiles")
  .insert({
    id: userId,
    company_id: company.id,
  });

if (profileError) {
  await supabaseAdmin.from("companies").delete().eq("id", company.id);

  return Response.json(
    {
      success: false,
      error: "Benutzerprofil konnte nicht erstellt werden.",
    },
    { status: 500 }
  );
}
return Response.json(
  {
    success: true,
    message: "Unternehmen wurde erfolgreich registriert.",
  },
  { status: 201 }
);
  } catch {
    return Response.json(
      { success: false, error: "Ungültige Anfrage." },
      { status: 400 }
    );
  }
}