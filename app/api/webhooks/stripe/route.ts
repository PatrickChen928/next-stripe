import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get("stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

  } catch (err: any) {
    return new NextResponse(err.message, { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  if (event.type === "checkout.session.completed") {
    // Handle successful checkout
    const subscription = await stripe.subscriptions.retrieve(session.subscription as string);

    if (!session?.metadata?.email) {
      return new NextResponse("Email not found", { status: 400 });
    }
    await db.user.create({
      data: {
        email: session.metadata.email,
        stripeSubscriptionId: subscription.id,
        stripeCustomerId: subscription.customer as string,
        stripePriceId: subscription.items.data[0].price.id,
        stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
      }
    });
  }

  if (event.type === "invoice.payment_succeeded") {
    const subscription = await stripe.subscriptions.retrieve(session.subscription as string);

    if (!session?.metadata?.email) {
      return new NextResponse("Email not found", { status: 400 });
    }

    await db.user.update({
      where: {
        email: session.metadata.email,
        stripeSubscriptionId: subscription.id,
      },
      data: {
        stripePriceId: subscription.items.data[0].price.id,
        stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
      }
    });
  }

  return new NextResponse(null, { status: 200 });
}