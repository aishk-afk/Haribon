import { useState } from "react";
import type { FormEvent } from "react";
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";

function CheckoutForm({ amount }: { amount: number }) {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState("");
  const [processing, setProcessing] = useState(false);
  const [paid, setPaid] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;
    setProcessing(true);
    setMessage("");

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });

    if (error) setMessage(error.message ?? "Payment failed. Please try again.");
    else if (paymentIntent?.status === "succeeded") setPaid(true);
    setProcessing(false);
  }

  if (paid) {
    return (
      <div className="thanks">
        <h2>Thank you! 🌱</h2>
        <p>Your ${amount} donation will help Haribon protect our environment.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <button className="btn pay-btn" disabled={processing || !stripe}>
        {processing ? "Processing..." : `Donate $${amount}`}
      </button>
      {message && <p className="error">{message}</p>}
    </form>
  );
}

export default CheckoutForm;