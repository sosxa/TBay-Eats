"use client";
import React, { useEffect, useState } from "react";
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";
import convertToSubcurrency from "./convertToSubcurrency";
import { useCart } from "../components/header/headerComponents/CartContext";

const CheckoutPage = () => {
    const stripe = useStripe();
    const elements = useElements();
    const { state: cartState, dispatch } = useCart();
    const [errorMessage, setErrorMessage] = useState<string>();
    const [clientSecret, setClientSecret] = useState("");
    const [loading, setLoading] = useState(false);

    const amount = cartState.items.reduce((total, item) => {
        const itemPrice = item.activeDiscount
            ? parseFloat(item.discountPrice)
            : parseFloat(item.price);
        return total + itemPrice * item.quantity;
    }, 0);

    useEffect(() => {
        fetch("/api/create-payment-intent", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ amount: convertToSubcurrency(amount) }),
        })
            .then((res) => res.json())
            .then((data) => setClientSecret(data.clientSecret));
    }, [amount]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);

        if (!stripe || !elements) {
            return;
        }

        const { error: submitError } = await elements.submit();

        if (submitError) {
            setErrorMessage(submitError.message);
            setLoading(false);
            return;
        }

        const { error } = await stripe.confirmPayment({
            elements,
            clientSecret,
            confirmParams: {
                return_url: `http://www.localhost:3000/payment-success?amount=${amount}`,
            },
        });

        if (error) {
            setErrorMessage(error.message);
        }

        setLoading(false);
    };

    if (!clientSecret || !stripe || !elements) {
        return (
            <div className="flex items-center justify-center">
                <div
                    className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
                    role="status"
                >
                    <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                        Loading...
                    </span>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col md:flex-row">
            {/* Cart Section */}
            <div className="w-full md:w-1/2 p-4">
                <h2 className="text-xl font-semibold mb-4">Your Cart</h2>
                <div className="bg-gray-100 p-4 rounded-md shadow-md">
                    {cartState.items.length === 0 ? (
                        <p className="text-black">Your cart is empty.</p>
                    ) : (
                        <ul>
                            {cartState.items.map((item) => (
                                <li key={item.itemId} className="flex items-center mb-4 border-b border-gray-300 pb-4">
                                    <img
                                        src={item.firstImgUrl}
                                        alt={item.itemName}
                                        className="w-20 h-20 object-cover mr-4 rounded-md shadow-sm"
                                    />
                                    <div className="flex-1">
                                        <p className="text-lg text-black font-semibold">{item.itemName}</p>
                                        <p className="text-gray-600">{item.filter} food</p>
                                        {item.activeDiscount && (<p className="text-gray-700">
                                            Discount: ({item.discountAmount}% off)
                                        </p>)}
                                        <p className="text-gray-700">Quantity: {item.quantity}</p>
                                        <p className="text-gray-900 font-bold">
                                            Total: ${item.activeDiscount ? item.discountPrice : item.price}
                                        </p>
                                        {item.comboItems && item.comboItems?.length > 0 && item.comboItems?.map((comboItem) => (
                                            <p>{comboItem.label}</p>
                                        ))}
                                        {/* <p className="text-black">${item.activeDiscount ? item.discountPrice : item.price}</p> */}
                                    </div>
                                    <button
                                        onClick={() => dispatch({ type: 'REMOVE_ITEM', payload: item.itemId })}
                                        className="ml-4 text-red-500 hover:text-red-700"
                                    >
                                        Remove
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>

            {/* Payment Section */}
            <div className="w-full md:w-1/2 p-4">
                <h2 className="text-xl font-semibold mb-4">Payment Details</h2>
                <form onSubmit={handleSubmit} className="bg-white p-4 rounded-md shadow-md">
                    {clientSecret && <PaymentElement />}

                    {errorMessage && <div className="text-red-500 mt-2">{errorMessage}</div>}

                    <button
                        disabled={!stripe || loading}
                        className="text-white w-full p-5 bg-black mt-2 rounded-md font-bold disabled:opacity-50 disabled:animate-pulse"
                    >
                        {!loading ? `Pay $${amount.toFixed(2)}` : "Processing..."}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CheckoutPage;
