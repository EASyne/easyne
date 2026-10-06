import { createServerSupabaseClient } from "../../../utils/supabase-server";
import Stripe from "stripe";
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
const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY!
);
export async function POST() {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return Response.json(
      { error: "Nicht autorisiert." },
      { status: 401 }
    );
  }
const { data: profile, error: profileError } = await supabase
  .from("profiles")
  .select("company_id")
  .eq("id", user.id)
  .single();

if (profileError || !profile?.company_id) {
  return Response.json(
    { error: "Firma konnte nicht gefunden werden." },
    { status: 404 }
  );
}
 const { data: company, error: companyError } = await supabaseAdmin
  .from("companies")
  .select("stripe_customer_id, stripe_subscription_id, subscription_status")
  .eq("id", profile.company_id)
  .single();

if (companyError || !company) {
  return Response.json(
    { error: "Firmendaten konnten nicht geladen werden." },
    { status: 500 }
  );
} 
if (
  company.stripe_subscription_id ||
  company.subscription_status === "checkout_pending"
) {
  return Response.json(
    { error: "Für diese Firma besteht bereits ein Abonnement." },
    { status: 409 }
  );
}
let stripeCustomerId = company.stripe_customer_id;
if (!stripeCustomerId) {
  const customer = await stripe.customers.create({
    email: user.email,
    metadata: {
      company_id: profile.company_id,
    },
  });

  stripeCustomerId = customer.id;
  const { error: saveError } = await supabaseAdmin
  .from("companies")
  .update({ stripe_customer_id: customer.id })
  .eq("id", profile.company_id);

if (saveError) {
  console.error("Stripe customer save error:", saveError);

  return Response.json(
    { error: "Stripe-Kunde konnte nicht gespeichert werden." },
    { status: 500 }
  );
}
}
const { data: reserved, error: reserveError } = await supabaseAdmin
  .rpc("reserve_stripe_checkout", {
    p_company_id: profile.company_id,
  });

if (reserveError || !reserved) {
  return Response.json(
    { error: "Für diese Firma läuft bereits ein Checkout oder es besteht ein Abonnement." },
    { status: reserveError ? 500 : 409 }
  );
}
try {
const session = await stripe.checkout.sessions.create({
  mode: "subscription",
  customer: stripeCustomerId,
  client_reference_id: profile.company_id,
  line_items: [
    {
      price: process.env.STRIPE_PRICE_ID!,
      quantity: 1,
    },
  ],
  subscription_data: {
    trial_period_days: 14,
    metadata: {
      company_id: profile.company_id,
    },
  },
  success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard?checkout=success`,
  cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard?checkout=cancel`,
});

return Response.json({ url: session.url });
} catch (error) {
  console.error("Stripe checkout error:", error);

  const { error: releaseError } = await supabaseAdmin.rpc(
    "release_stripe_checkout",
    { p_company_id: profile.company_id }
  );

  if (releaseError) {
    console.error("Checkout reservation release error:", releaseError);
  }

  return Response.json(
    { error: "Checkout konnte nicht gestartet werden." },
    { status: 500 }
  );
}
}
