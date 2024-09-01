'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import relatedComboData from './relatedComboData';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useCart } from '@/app/components/header/headerComponents/CartContext';
import SlidingAside from '@/app/components/food/SlidingAside';

const ListRelatedCombos = ({ relatedCombos, loading }: {relatedCombos: any[]; loading: boolean; }) => {
    const [products, setProducts] = useState<any[]>([]);
    const [asideProduct, setAsideProduct] = useState<any | null>(null);
    const [asideOpen, setAsideOpen] = useState<boolean>(false);
    const router = useRouter(); // Hook for routing
    const { dispatch } = useCart(); // Move useCart hook to the top level

    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {

    //             const data = await relatedComboData(userEmail, ogProductName);
    //             setProducts(data);
    //         } catch (error) {
    //             console.error('Error fetching products:', error);
    //         } finally {
    //         }
    //     };

    //     fetchData();
    // }, [userEmail, ogProductName]);

    const handleClick = (comboId: string) => {
        router.push(`/combo/${comboId}`); // Navigate to the dynamic route
    };

    const handleAddToCartClick = (event: React.MouseEvent<HTMLButtonElement>, product: any) => {
        event.stopPropagation();

        // Determine if it's a combo or product
        const isCombo = product.combo_name !== undefined;
        const isProduct = product.product_name !== undefined;

        if (!isCombo && !isProduct) {
            console.error("Product must have either combo_name or product_name");
            return;
        }

        // Create the common item object
        const item = {
            itemId: product.id,
            itemName: isCombo ? product.combo_name : product.product_name,
            type: isCombo ? 'combo' : 'product',
            firstImgUrl: product.finalUrl,
            itemOgName: product.ogName,
            creatorEmail: product.email,
            filter: product.origin[0]?.filter,
            price: !isCombo ? product.price_size[0]?.price : product.price,
            quantity: 1,
            ogPrice: !isCombo ? product.price_size[0]?.price : product.price,
            activeDiscount: product.active_discount,
            // discountPrice: product.discount_price_size[0]?.price,
            discountPrice: !isCombo ? product.discount_price_size[0]?.price : product.active_discount_price,
            discountAmount: product.discount_amount,
            comboItems: isCombo ? product.combo_items : undefined,
            spiceLevel: isProduct ? product.spice_level[0]?.label : undefined,
            size: isProduct ? product.price_size[0]?.size : undefined
        };

        // Compute the price
        const computedPrice = (item.ogPrice * (item.quantity ?? 1)).toFixed(2);

        // Dispatch the action
        dispatch({
            type: 'ADD_ITEM',
            payload: {
                ...item,
                quantity: item.quantity ?? 1,
                price: computedPrice,
            },
        });

        // Update state for displaying aside
        setAsideProduct(product);
        setAsideOpen(true);
    };

    const handleCloseAside = () => {
        setAsideOpen(false);
        setAsideProduct(null);
    };

    return (
        <>
            {relatedCombos.length > 0 && (
                <>
                    <div>
                        <center>
                            <h1 className='w-full pt-8 pb-4 text-center text-black text-3xl xl:text-[2rem] font-semibold'>
                                Want the combo instead?
                            </h1>
                        </center>
                    </div>
                    <div className='mt-10 md:grid md:grid-cols-2 xl:mt-0 xl:block gap-4'>
                        {loading ? (
                            // Skeleton Loader
                            Array.from({ length: 2 }).map((_, index) => (
                                <div
                                    key={index}
                                    className={`flex-shrink-0 w-full md:w-[20rem] lg:w-[25rem] xl:w-[30rem] bg-[#F9F6EE] rounded-xl shadow-lg p-4 flex flex-col ${index < 1 ? 'mb-6' : ''}`}
                                >
                                    <div className='bg-gray-300 h-80 w-full rounded-t-xl'></div>
                                    <div className='w-full flex flex-col gap-2 pt-4'>
                                        <div className='bg-gray-300 h-7 w-3/5'></div>
                                        <div className='bg-gray-300 h-7 w-2/5'></div>
                                    </div>
                                    <div className='w-full flex gap-4 py-2'>
                                        <div className='bg-gray-300 h-7 w-16'></div>
                                        <div className='bg-gray-300 h-7 w-16'></div>
                                    </div>
                                    <div className='w-full pt-2'>
                                        <div className='bg-gray-300 h-10 w-full'></div>
                                    </div>
                                </div>
                            ))
                        ) : relatedCombos.length === 0 ? (
                            <div className="w-full text-center text-lg font-semibold py-10">
                                No related combos found.
                            </div>
                        ) : (
                            relatedCombos.map((product) => (
                                <div
                                    key={product.id}
                                    className='py-5 w-full rounded-xl shadow-lg bg-[#F9F6EE] transform transition-transform duration-300 ease-in-out hover:scale-105 cursor-pointer relative p-4 mb-6'
                                    onClick={() => handleClick(product.id)}
                                    role="button"
                                    aria-label={`View details for ${product.combo_name}`}
                                >
                                    <img
                                        src={product.finalUrl}
                                        width={500}
                                        height={500}
                                        alt={`Image of ${product.combo_name}`}
                                        className='w-full h-[20rem] object-cover rounded-t-xl'
                                    />
                                    {product.active_discount && (
                                        <div className='absolute top-2 right-2 bg-custom-yellow text-white rounded-md p-2'>
                                            <p className='text-lg font-bold'>{product.discount_amount}%</p>
                                        </div>
                                    )}
                                    <div className='w-full pt-[1.5rem] pb-[0rem] px-[.5rem] flex items-center justify-between'>
                                        <h4 className='text-xl font-semibold'>{product.combo_name}</h4>
                                        {product.active_discount ? (
                                            <p className="text-lg font-semibold">
                                                ${product.active_discount_price}
                                            </p>
                                        ) : (
                                            <p className="text-lg font-semibold">${product.price}</p>
                                        )}
                                    </div>
                                    <div className='w-full px-[.5rem] flex gap-4 pb-[1rem]'>
                                        <div className='bg-gray-300 rounded-md w-[3.5rem] flex items-center justify-center px-5'>
                                            <div className='w-6 h-6 flex items-center justify-center'>
                                                <svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 122.88 117.19" className="w-4 h-4">
                                                    <path d="M64.39,2,80.11,38.76,120,42.33a3.2,3.2,0,0,1,1.83,5.59h0L91.64,74.25l8.92,39a3.2,3.2,0,0,1-4.87,3.4L61.44,96.19,27.09,116.73a3.2,3.2,0,0,1-4.76-3.46h0l8.92-39L1.09,47.92A3.2,3.2,0,0,1,3,42.32l39.74-3.56L58.49,2a3.2,3.2,0,0,1,5.9,0Z" />
                                                </svg>
                                            </div>
                                            {!loading && product.rating_messages && product.rating_messages.length > 0 && (
                                                // Calculate the average rating
                                                (() => {
                                                    // Sum all the ratings
                                                    const totalRating = product.rating_messages.reduce((acc: any, prev: any) => acc + prev.rating, 0);

                                                    // Compute average
                                                    const averageRating = totalRating / product.rating_messages.length;

                                                    // Round to two decimal places
                                                    const roundedAverage = averageRating.toFixed(1);

                                                    // Display the rounded average
                                                    return <p className='tracking-wide text-md font-medium px-1'>{roundedAverage}</p>
                                                })()
                                            )}


                                            {!loading && product.rating_messages && product.rating_messages.length < 1 || product.rating_messages === null && (
                                                <p className='tracking-wide text-md font-medium px-2'>0</p>
                                            )}
                                        </div>
                                        <div className='bg-gray-300 rounded-md w-auto flex items-center gap-1'>
                                            <p className='tracking-wide text-md font-medium'>30-45 min</p>
                                        </div>
                                    </div>
                                    <div className='w-full px-[.5rem] pb-[1rem]'>
                                        <button
                                            className='w-full bg-custom-yellow text-white font-bold py-2 rounded-md hover:bg-yellow-600 transition-colors'
                                            onClick={(event) => handleAddToCartClick(event, product)}
                                        >
                                            Add to Cart
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                        {asideProduct && (
                            <SlidingAside
                                isOpen={asideOpen}
                                onClose={handleCloseAside}
                                product={asideProduct}
                            />
                        )}
                    </div>
                </>
            )}
            {relatedCombos.length === 0 && (
                <div></div>
            )}
        </>
    );
};

export default ListRelatedCombos;
