import { NextRequest, NextResponse } from "next/server";
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export async function POST(request: NextRequest) {
  try {
    const { amount } = await request.json();

    // Convert amount to smallest currency unit (e.g., cents for USD)
    // Ensure amount is a valid integer (e.g., 1000 for $10.00)
    if (typeof amount !== 'number' || amount <= 0) {
      throw new Error('Invalid amount');
    }

    // Create a Payment Intent with the given amount
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: "usd",
      automatic_payment_methods: { enabled: true },
    });

    // Return the client secret
    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("Internal Error:", error);

    // Return a more specific error message for debugging
    return NextResponse.json(
      { error: `Internal Server Error` },
      { status: 500 }
    );
  }
}
