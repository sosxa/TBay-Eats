import Stripe from "stripe";
import { NextResponse, NextRequest } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
export async function POST(reqs: NextRequest, res: NextResponse) {
    const payload = await reqs.text();
    const response = JSON.parse(payload);

    const sig = reqs.headers.get("Stripe-Signiture");

    const dateTime = new Date(response?.created * 100).toLocaleDateString()
    const timeString = new Date(response?.created * 100).toLocaleDateString()

    try {
        let event = stripe.webhooks.constructEvent(
            payload,
            sig!,
            process.env.STRIPE_WEBHOOK_SECRET!
        )
// charge.succeeded
// payment_intent.succedded
// payement_intent.created

        return NextResponse.json({ status: "success", event: event.type });


    } catch (error) {
        throw error;
        return;
    }

}