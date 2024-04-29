"use client"

import { useState } from "react";

export const CheckoutForm = () => {
  const [email, setEmail] = useState('');
  const handleClick = () => {

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
      >
        Checkout
      </button>
    </div>
  )
}