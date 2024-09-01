"use client";

import CheckoutPage from "./CheckoutPage";
import convertToSubcurrency from "./convertToSubcurrency";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

if (process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY === undefined) {
    throw new Error("NEXT_PUBLIC_STRIPE_PUBLIC_KEY is not defined");
}
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export default function CheckOutClient() {
    const amount = 49.99;

    return (
        <main className="max-w-6xl mx-auto p-10 text-white text-center border m-10 rounded-md bg-gradient-to-tr from-green-400 to-custom-dark-green">
            <div className="mb-10">
                <h1 className="text-4xl font-extrabold mb-2">Payment Details</h1>
                {/* <h2 className="text-2xl">
                    has requested
                    <span className="font-bold"> ${amount}</span>
                </h2> */}
            </div>

            <Elements
                stripe={stripePromise}
                options={{
                    mode: "payment",
                    amount: convertToSubcurrency(amount),
                    currency: "usd",
                }}
            >
                <CheckoutPage />
            </Elements>
        </main>
    );
}