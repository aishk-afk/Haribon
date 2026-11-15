import { useState } from "react";
import { Link } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "../components/CheckoutForm";
import Icon from "../components/Icon";
import { ErrorMessage, Loading } from "../components/StatusViews";
import { publicApi } from "../lib/api";
import { isIconName } from "../lib/icons";
import { sectionByKey, sectionsWithPrefix } from "../lib/sections";
import { useAsync } from "../lib/useAsync";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
const amounts = [5, 10, 25, 50];
const fetchDonate = () => publicApi.page("donate");

function Donate() {
  const content = useAsync(fetchDonate);
  const [amount, setAmount] = useState(10);
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // The payment itself is unchanged: it still goes to the Express/Stripe server.
  async function startPayment() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      });
      const text = await res.text();
      const data = text ? JSON.parse(text) : null;
      if (!res.ok || !data) {
        throw new Error(
          data?.error ?? "Cannot reach the payment server. Make sure npm run server is running."
        );
      }
      setClientSecret(data.clientSecret);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
    setLoading(false);
  }

  if (content.loading) return <Loading />;
  if (content.error || !content.data) {
    return <ErrorMessage message={content.error ?? "This page is not available right now."} onRetry={content.reload} />;
  }

  const sections = content.data.sections ?? [];
  const intro = sectionByKey(sections, "donate_intro");
  const points = sectionsWithPrefix(sections, "donate_point_");
  const card = sectionByKey(sections, "donate_card");

  return (
    <section className="donate-page">
      <div className="wrap donate-layout">
        <div className="donate-info">
          <Link to="/" className="back-link">← Back to home</Link>
          {intro?.eyebrow && <p className="eyebrow">{intro.eyebrow}</p>}
          <h1>{intro?.heading ?? content.data.title}</h1>
          {intro?.body && <p>{intro.body}</p>}
          {points.length > 0 && (
            <ul className="donate-points">
              {points.map((point) => (
                <li key={point.id}>
                  {isIconName(point.icon) && <Icon name={point.icon} size={18} badge="white" />} {point.heading}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="donate card">
          <h2>{card?.heading ?? "Make a donation"}</h2>
          {card?.body && <p className="demo-note">{card.body}</p>}

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
