'use client';
import React, { useState, useEffect } from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css'; // Import the skeleton CSS
import { useRouter } from 'next/navigation';
import QuantityTracker from './QuantityTracker';
import AddToCartButton from './AddToCartButton';

interface ImageAndInfoProps {
    productId?: string;
    productName?: string;
    discountPrice?: string;
    ogPrice?: string;
    reviews?: string;
    sizeAndPrices?: {
        id: number;
        price: string;
        size: string;
    }[];
    currentPrice?: string;
    discountSizeAndPrices?: {
        id: number;
        price: string;
        size: string;
    }[];
    spiceLevel?: { value: string; label: string }[];
    discountAmount?: string;
    active?: boolean;
    origin?: string;
    activeDiscount?: boolean;
    creatorEmail?: string;
    firstImg?: string;
}

const ProductInfo = ({
    productId = "",
    firstImg = "",
    activeDiscount = false,
    discountPrice = '',
    ogPrice = '',
    currentPrice = '',
    productName = '',
    reviews = 'No Reviews',
    discountAmount = '0',
    active = false,
    origin = '',
    sizeAndPrices = [],
    spiceLevel = [],
    creatorEmail = "",
    discountSizeAndPrices = []
}: ImageAndInfoProps) => {
    const [selectedSize, setSelectedSize] = useState<string | undefined>(undefined);
    const [selectedSpiceLevel, setSelectedSpiceLevel] = useState<string | undefined>(undefined);
    const [loading, setLoading] = useState<boolean>(true);
    const [quantity, setQuantity] = useState<number>(1);
    const [currentDisplayPrice, setCurrentDisplayPrice] = useState<string>('');
    const [crossedOutPrice, setCrossedOutPrice] = useState<string | undefined>(undefined);
    const [ogPriceValue, setOgPriceValue] = useState<string>('');

    useEffect(() => {
        const initialRegularPrice = sizeAndPrices.length > 0 ? sizeAndPrices[0].price : currentPrice;
        const initialDiscountPrice = activeDiscount && discountSizeAndPrices.length > 0 ? discountSizeAndPrices[0].price : initialRegularPrice;

        const initialDisplayPrice = `${(parseFloat(initialDiscountPrice) * quantity).toFixed(2)}`;

        setCurrentDisplayPrice(initialDisplayPrice);
        setCrossedOutPrice(activeDiscount ? `${(parseFloat(initialRegularPrice) * quantity).toFixed(2)}` : undefined);
        setLoading(false);
    }, [activeDiscount, discountSizeAndPrices, sizeAndPrices, currentPrice, quantity]);

    useEffect(() => {
        const selectedSizePrice = sizeAndPrices.find(size => size.size === selectedSize)?.price;
        const discountPriceForSize = activeDiscount ? discountSizeAndPrices.find(size => size.size === selectedSize)?.price : undefined;

        const unitPrice = discountPriceForSize || selectedSizePrice || currentPrice;
        setCurrentDisplayPrice(`${(parseFloat(unitPrice) * quantity).toFixed(2)}`);

        // Update the crossed out price
        const originalPrice = selectedSizePrice || currentPrice;
        setCrossedOutPrice(activeDiscount ? `${(parseFloat(originalPrice) * quantity).toFixed(2)}` : undefined);

        // Set the original price (ogPrice) based on selected size or default
        setOgPriceValue(selectedSizePrice || currentPrice);
    }, [selectedSize, sizeAndPrices, discountSizeAndPrices, activeDiscount, quantity, currentPrice]);

    const handleQuantityChange = (quantity: number) => {
        if (quantity < 1) {
            quantity = 1;
        } else if (quantity > 100) {
            quantity = 100;
        }
        setQuantity(quantity);
    };

    const isAddToCartDisabled = !selectedSize || !selectedSpiceLevel;

    const router = useRouter();

    const ogPriceNumber = parseFloat(ogPriceValue);

    return (
        <div className="w-full pl-10">
            {loading ? (
                <Skeleton height={30} width={200} />
            ) : (
                <h1 className="font-semibold text-4xl">{productName}</h1>
            )}

            <div className="flex gap-4 mt-1 mb-4">
                <div>
                    {loading ? (
                        <Skeleton height={20} width={100} />
                    ) : (
                        <p>{reviews === "-" ? "0 Reviews" : `${reviews} Reviews`}</p>
                    )}
                </div>
                <div>
                    <p className="text-custom-green hover:underline hover:cursor-pointer">
                        {loading ? <Skeleton width={150} /> : (
                            <a onClick={() => router.replace("/product/" + productId + "#reviews")}>
                                Submit a review
                            </a>
                        )}
                    </p>
                </div>
            </div>

            <hr />

            <div>
                <div className="flex mt-4 gap-3">
                    {loading ? (
                        <>
                            <Skeleton height={30} width={100} />
                            <Skeleton height={30} width={80} />
                            <Skeleton height={20} width={60} />
                        </>
                    ) : (
                        <>
                            {activeDiscount ? (
                                <>
                                    <h1 className="text-custom-green text-2xl">${currentDisplayPrice}</h1>
                                    {crossedOutPrice && <h1 className="text-gray-800 text-md"><s>${crossedOutPrice}</s></h1>}
                                    <h1 className="text-custom-yellow text-md font-semibold">{discountAmount}% off</h1>
                                </>
                            ) : (
                                <h1 className="text-custom-green text-lg">${currentDisplayPrice}</h1>
                            )}
                        </>
                    )}
                </div>
            </div>

            <div className="grid col-span-2 gap-2 mt-4 mb-4">
                <div>
                    <h1>
                        <span className="mr-2 text-gray-800">Availability:</span>
                        <span className="text-gray-800 inline-block ml-[.8rem]">
                            {loading ? <Skeleton width={80} /> : <p className="text-gray-800">{active ? "Active" : "Inactive"}</p>}
                        </span>
                    </h1>
                </div>
                <div>
                    <h1>
                        <span className="text-gray-800 mr-2">Category:</span>
                        <span className="text-gray-800 inline-block ml-[.8rem]">
                            {loading ? <Skeleton width={150} /> : <p className="text-gray-800">{origin} food</p>}
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

            <div className="my-4 gap-5">
                <div className="flex">
                    <p className="text-gray-800">Spice Level:</p>
                    <div className="px-2">
                        {loading ? (
                            <Skeleton height={50} width="100%" />
                        ) : (
                            <select
                                id="spice-levels"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
                                value={selectedSpiceLevel}
                                onChange={(e) => setSelectedSpiceLevel(e.target.value)}
                            >
                                <option value="">Select a spice level</option>
                                {spiceLevel.map(option => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>
                </div>

                <div className="flex my-4">
                    <p className="text-gray-800">Size:</p>
                    <div className="px-2">
                        {loading ? (
                            <Skeleton height={40} width="100%" />
                        ) : (
                            <select
                                id="sizes"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
                                value={selectedSize}
                                onChange={(e) => setSelectedSize(e.target.value)}
                            >
                                <option value="">Select a size</option>
                                {sizeAndPrices.map(option => (
                                    <option key={option.id} value={option.size}>
                                        {option.size[0].toUpperCase() + option.size.slice(1)}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>
                </div>

                <hr />

                <div className='my-2 flex gap-8 lg:gap-[5rem] justify-center align-middle items-center'>
                    {loading ? (
                        <>
                            <Skeleton height={40} width={120} />
                            <Skeleton height={40} width={150} />
                        </>
                    ) : (
                        <>
                            <QuantityTracker initialQuantity={1} onQuantityChange={handleQuantityChange} />
                            <AddToCartButton
                                item={{
                                    itemId: productId,
                                    itemName: productName,
                                    type: 'product',
                                    firstImgUrl: firstImg,
                                    itemOgName: productName,
                                    creatorEmail: creatorEmail,
                                    comboItems: [],
                                    filter: origin,
                                    price: currentDisplayPrice,
                                    quantity: quantity,
                                    spiceLevel: selectedSpiceLevel || '',
                                    size: selectedSize || '',
                                    ogPrice: ogPriceNumber, // Pass the ogPrice value
                                    activeDiscount: activeDiscount,
                                    discountPrice: discountPrice,
                                     discountAmount: discountAmount,
                                }}
                                disabled={isAddToCartDisabled}
                            />
                        </>
                    )}
                </div>

                <hr />
            </div>
        </div>
    );
};

export default ProductInfo;
