import "dotenv/config";
import express from "express";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const app = express();
app.use(express.json());

app.post("/api/create-payment-intent", async (req, res) => {
  try {
    const amount = Math.round(Number(req.body.amount) * 100);
    if (!amount || amount < 100) {
      return res.status(400).json({ error: "Minimum donation is $1." });
    }
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      automatic_payment_methods: { enabled: true },
      description: "Donation to Haribon Foundation",
    });
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(4242, () => console.log("Server running on http://localhost:4242"));