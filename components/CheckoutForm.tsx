"use client"

import { useState, useTransition } from "react";
import { toast } from "sonner"
import { createStripeUrl } from "@/actions/user-subscription";

export const CheckoutForm = () => {
  const [email, setEmail] = useState('');
  const [isPending, startTransition] = useTransition();
  const handleClick = () => {
    if (!email) {
      toast.warning('Please enter your email');
      return;
    }
    startTransition(() => {
      createStripeUrl(email).then(({ url }) => {
        if (url) {
          window.location.href = url;
        }
      }).catch((e) => {
        toast.error(e.message);
      })
    })
  }
  return (
    <div className="flex flex-col items-start mt-12">
      <span className="text-xl text-white text-left">Email</span>
      <input
        className="py-4 px-6 rounded bg-white text-primary w-96"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <button
        className="bg-primary-500 hover:bg-primary-500/90 text-white font-bold mt-4 py-4 px-12 rounded"
        onClick={handleClick}
        disabled={isPending}
      >
        {isPending ? "Loading..." : "Checkout"}
      </button>
    </div>
  )
}