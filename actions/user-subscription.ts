"use server"

import { stripe } from "@/lib/stripe";
import { getUserSubscription } from "@/lib/subscription";

const returnUrl = 'http://localhost:3000/checkout/success';
const cancelUrl = 'http://localhost:3000/checkout/cancel';

export const createStripeUrl = async (email: string) => {
  const userSubscription = await getUserSubscription(email);

  if (userSubscription?.isActive) {
    throw new Error('You already have an active subscription');
  }

  if (userSubscription?.stripeCustomerId) {
    const stripeSession = await stripe.billingPortal.sessions.create({
      customer: userSubscription.stripeCustomerId,
      return_url: returnUrl,
    });
    return {
      url: stripeSession.url,
    }
  }

  const stripeSession = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    customer_email: email,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: 'USD',
          product_data: {
            name: 'Premium Subscription',
            description: 'Monthly subscription to our premium plan',
          },
          unit_amount: 1000, // $10 USD
          recurring: {
            interval: 'month',
          }
        }
      },
    ],
    metadata: {
      email,
    },
    success_url: returnUrl,
    cancel_url: cancelUrl,
  });

  return {
    url: stripeSession.url,
  }
}