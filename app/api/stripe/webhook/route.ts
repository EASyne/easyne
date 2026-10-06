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

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return new Response("Missing Stripe signature", {
      status: 400,
    });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch {
    return new Response("Invalid Stripe signature", {
      status: 400,
    });
  }

  console.log("Stripe event:", event.type);
  if (event.type === "checkout.session.expired") {
  const session = event.data.object as Stripe.Checkout.Session;
  const companyId = session.client_reference_id;

if (companyId) {
  const { error: releaseError } = await supabaseAdmin.rpc(
    "release_stripe_checkout",
    { p_company_id: companyId }
  );

  if (releaseError) {
    console.error("Checkout reservation release error:", releaseError);

    return new Response("Checkout-Reservierung konnte nicht freigegeben werden", {
      status: 500,
    });
  }
}
  console.log("Checkout abgelaufen:", {
    id: session.id,
    companyId: session.client_reference_id,
  });
}
  if (event.type === "customer.subscription.deleted") {
  const subscription = event.data.object as Stripe.Subscription;
  const { data: deletedCompany, error: deleteError } = await supabaseAdmin
  .from("companies")
  .update({
    subscription_status: "canceled",
  })
  .eq("stripe_subscription_id", subscription.id)
.select("id")
.maybeSingle();

if (deleteError || !deletedCompany) {
  console.error("Stripe cancellation update error:", deleteError);

  return new Response("Abo-Kündigung konnte nicht gespeichert werden", {
    status: 500,
  });
}
  console.log("Abo beendet:", {
    id: subscription.id,
    status: subscription.status,
  });
}
  if (event.type === "customer.subscription.updated") {
  const subscription = event.data.object as Stripe.Subscription;
  const companyId = subscription.metadata.company_id;
  if (!companyId) {
  return new Response("Firmen-ID fehlt in den Abo-Metadaten", {
    status: 400,
  });
}
  const { data: updatedCompany, error: updateError } = await supabaseAdmin
  .from("companies")
  .update({
  stripe_subscription_id: subscription.id,
  subscription_status: subscription.status,
})
  .eq("id", companyId)
.eq("stripe_customer_id", subscription.customer as string)
.or(`stripe_subscription_id.is.null,stripe_subscription_id.eq.${subscription.id}`)
.select("id")
.maybeSingle();

if (updateError || !updatedCompany) {
  console.error("Stripe subscription update error:", updateError);

  return new Response("Abo-Status konnte nicht gespeichert werden", {
    status: 500,
  });
}
  console.log("Abo aktualisiert:", {
    id: subscription.id,
    status: subscription.status,
  });
}
  if (event.type === "checkout.session.completed") {
  const session = event.data.object as Stripe.Checkout.Session;
    const companyId = session.client_reference_id;
  
  if (!companyId || !session.subscription) {
  return new Response("Checkout-Daten unvollständig", {
    status: 400,
  });
}

const subscription = await stripe.subscriptions.retrieve(
  session.subscription as string
);

const { data: savedCompany, error: saveError } = await supabaseAdmin
  .from("companies")
  .update({
  stripe_subscription_id: session.subscription as string,
  subscription_status: subscription.status,
})
  .eq("id", companyId)
  .eq("stripe_customer_id", session.customer as string)
.select("id")
.maybeSingle();

if (saveError || !savedCompany) {
  console.error("Stripe subscription save error:", saveError);

  return new Response("Abo konnte nicht gespeichert werden", {
    status: 500,
  });
}
  console.log("Checkout abgeschlossen:", {
    customer: session.customer,
    subscription: session.subscription,
  });
}
  return Response.json({ received: true });
}