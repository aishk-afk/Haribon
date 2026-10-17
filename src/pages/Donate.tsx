import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "../components/CheckoutForm";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
const amounts = [5, 10, 25, 50];

function Donate() {
  const [amount, setAmount] = useState(10);
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function startPayment() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setClientSecret(data.clientSecret);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
    setLoading(false);
  }

  return (
    <section className="donate card">
      <h1>Support Haribon</h1>
      <p>Your donation helps fund environmental education and conservation.</p>

      {!clientSecret ? (
        <>
          <div className="amounts">
            {amounts.map((a) => (
              <button
                key={a}
                className={`amount ${a === amount ? "selected" : ""}`}
                onClick={() => setAmount(a)}
              >
                ${a}
              </button>
            ))}
          </div>
          <button className="btn" onClick={startPayment} disabled={loading}>
            {loading ? "Loading..." : "Continue to payment"}
          </button>
          {error && <p className="error">{error}</p>}
        </>
      ) : (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <CheckoutForm amount={amount} />
        </Elements>
      )}
    </section>
  );
}

export default Donate;