'use client';
import React, { useState, useEffect } from 'react';
import QuantityTracker from '@/app/product/[id]/idComponents/QuantityTracker';
import AddToCartButton from '@/app/product/[id]/idComponents/AddToCartButton';

// Define the props type
interface ImageAndInfoProps {
    comboName?: string;
    ogPrice?: string;
    reviews?: any[];
    price?: string;
    currentPrice?: string;
    discountPrice?: string;
    spiceLevel?: { value: string; label: string }[];
    discountAmount?: string;
    active?: boolean;
    origin?: string;
    activeDiscount?: boolean;
    comboItemArr?: any[];
    rating: any;
    ogName: any;
    itemId: any;
    creatorEmail: any;
    firstImgUrl: any;
}

// Use the props type directly in the function parameter
const ComboInfo = ({
    comboItemArr = [],
    activeDiscount = false,
    discountPrice = '',
    ogPrice = '',
    currentPrice = '',
    comboName = '',
    reviews = [],
    discountAmount = '0',
    active = false,
    origin = '',
    spiceLevel = [],    // Array of spice level objects
    rating = '',
    ogName = "",
    itemId = '',
    creatorEmail = "",
    firstImgUrl = ""

}: ImageAndInfoProps) => {

    // Initialize state for price and quantity
    const [currentDisplayPrice, setCurrentDisplayPrice] = useState<string>('');
    const [crossedOutPrice, setCrossedOutPrice] = useState<string | undefined>(undefined);
    const [quantity, setQuantity] = useState<number>(1);
    const [ogPriceValue, setOgPriceValue] = useState<string>('');

    // Effect to update prices based on discount and quantity
    useEffect(() => {
        const calculatedCurrentPrice = activeDiscount ? discountPrice : currentPrice;
        const displayPrice = `${(parseFloat(calculatedCurrentPrice) * quantity).toFixed(2)}`;
        const originalPrice = activeDiscount ? currentPrice : undefined;
        const calculatedCrossedOutPrice = originalPrice ? `${(parseFloat(originalPrice) * quantity).toFixed(2)}` : undefined;

        setCurrentDisplayPrice(displayPrice);
        setCrossedOutPrice(calculatedCrossedOutPrice);

        // Set ogPriceValue based on discount and selected quantity
        setOgPriceValue(originalPrice || currentPrice || '0');
    }, [activeDiscount, discountPrice, currentPrice, quantity]);

    // Handle quantity changes
    const handleQuantityChange = (quantity: number) => {
        if (quantity < 1) {
            quantity = 1;
        } else if (quantity > 100) {
            quantity = 100;
        }
        setQuantity(quantity);
    };

    // Handle adding to cart
    const handleAddToCart = () => {
        console.log('Product added to cart');
    };

    const ogPriceNumber = parseFloat(ogPriceValue);

    return (
        <div className="w-full pl-10">
            <h1 className="font-semibold text-2xl">{comboName}</h1>
            <div className="flex gap-4 mt-1 mb-4">
                <div>
                    <p>{rating === "-" ? "0 Reviews" : `${reviews.length} Reviews`}</p>
                </div>
                <div>
                    <p className="text-custom-green hover:underline hover:cursor-pointer">Submit a review</p>
                </div>
            </div>

            <hr />
            <div>
                <div className="flex mt-4 gap-3">
                    {activeDiscount ? (
                        <>
                            <h1 className="text-custom-green text-2xl">${currentDisplayPrice}</h1>
                            {crossedOutPrice && <h1 className="text-gray-800 text-md"><s>${crossedOutPrice}</s></h1>}
                            <h1 className="text-custom-yellow text-md font-semibold">{discountAmount}% off</h1>
                        </>
                    ) : (
                        <>
                            <h1 className="text-custom-green text-lg">${currentDisplayPrice}</h1>
                        </>
                    )}
                </div>
            </div>
            <div className="grid col-span-2 gap-2 mt-4 mb-4">
                <div>
                    <h1>
                        <span className="mr-2 text-gray-800">Availability:</span>
                        <span className="text-gray-800 inline-block ml-[.8rem]">
                            <p className="text-gray-800">{active ? "Active" : "Inactive"}</p>
                        </span>
                    </h1>
                </div>
                <div>
                    <h1>
                        <span className="text-gray-800 mr-2">Category:</span>
                        <span className="text-gray-800 inline-block ml-[.8rem]">
                            <p className="text-gray-800">{origin} food</p>
                        </span>
                    </h1>
                </div>
                <div>
                    <h1>
                        <span className="text-gray-800 mr-2"><b>Free Shipping</b></span>
                    </h1>
                </div>
            </div>

            <hr />
            <div className="my-3">
                <div className='w-full mb-3'>
                    <h5 className='text-lg font-semibold mb-2'>Combo Items:</h5>
                    <ul className='list-disc pl-5'>
                        {comboItemArr.map((item: any, index: number) => (
                            <li key={index} className='text-gray-800'>
                                {item.label}
                            </li>
                        ))}
                    </ul>
                </div>

                <hr />
                <div className='my-2 block md:flex gap-[5rem] justify-center align-middle items-center'>
                    <QuantityTracker initialQuantity={1} onQuantityChange={handleQuantityChange} />
                    <div>
                        <AddToCartButton
                            item={{
                                itemId: itemId,
                                itemName: comboName,
                                type: 'combo',
                                firstImgUrl: firstImgUrl,
                                itemOgName: ogName,
                                creatorEmail: creatorEmail,
                                comboItems: comboItemArr,  // Assuming you want to pass combo items as well
                                filter: origin,
                                price: currentDisplayPrice,
                                quantity: quantity,
                                ogPrice: ogPriceNumber, // Pass the ogPrice value
                                activeDiscount: activeDiscount,
                                discountPrice: discountPrice,
                                discountAmount: discountAmount,
                            }}
                        />
                    </div>
                </div>
                <hr />
            </div>
        </div>
    );
}

export default ComboInfo;
