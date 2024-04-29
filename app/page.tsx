import { CheckoutForm } from "@/components/CheckoutForm";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <h1 className="text-3xl font-semibold text-white">Integrate Stripe with Next.js</h1>

      <CheckoutForm />
    </main>
  );
}
