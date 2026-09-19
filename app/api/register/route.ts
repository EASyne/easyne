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
    const body = await request.json();

    const companyName = String(body.companyName ?? "").trim();
    const email = String(body.email ?? "").trim().toLowerCase();
    const password = String(body.password ?? "");

    if (!companyName || !email || !password) {
      return Response.json(
        { success: false, error: "Bitte füllen Sie alle Felder aus." },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return Response.json(
        {
          success: false,
          error: "Das Passwort muss mindestens 8 Zeichen lang sein.",
        },
        { status: 400 }
      );
    }
    const { data: authData, error: authError } =
  await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

if (authError || !authData.user) {
  return Response.json(
    {
      success: false,
      error: authError?.message || "Benutzer konnte nicht erstellt werden.",
    },
    { status: 400 }
  );
}

const userId = authData.user.id;
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
  await supabaseAdmin.auth.admin.deleteUser(userId);

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
  await supabaseAdmin.auth.admin.deleteUser(userId);

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