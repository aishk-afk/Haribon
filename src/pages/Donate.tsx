import { useState } from "react";
import { Link } from "react-router-dom";
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
    <section className="donate-page">
      <div className="wrap donate-layout">
        <div className="donate-info">
          <Link to="/" className="back-link">← Back to home</Link>
          <p className="eyebrow">Support Haribon</p>
          <h1>Help protect the Philippines’ forests and wildlife</h1>
          <p>
            Since 1972, Haribon has championed biodiversity conservation, inspired by
            the Philippine Eagle. Choose an amount to support that mission.
          </p>
          <ul className="donate-points">
            <li>Protecting forests and critical habitats</li>
            <li>Saving threatened species</li>
            <li>Empowering communities to care for nature</li>
          </ul>
        </div>

        <div className="donate card">
          <h2>Make a donation</h2>
          <p className="demo-note">
            Demo mode: pay with test card 4242 4242 4242 4242, any future date, any CVC.
            No real money is charged.
          </p>

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
        </div>
      </div>
    </section>
  );
}

export default Donate;