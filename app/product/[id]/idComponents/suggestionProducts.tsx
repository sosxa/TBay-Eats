'use client';
import React, { useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import grabSuggestedProducts from './grabSuggestedProducts';
import { useCart } from '@/app/components/header/headerComponents/CartContext';
import SlidingAside from '@/app/components/food/SlidingAside';


const SuggestionProducts = (userEmail: any) => {
    const [products, setProducts] = useState<any[]>([]);
    const [displayProducts, setDisplayProducts] = useState<any[]>([]);
    const [scrollPosition, setScrollPosition] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true); // Loading state
    const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
    const [asideOpen, setAsideOpen] = useState<boolean>(false);
    const router = useRouter();
    const scrollRef = useRef<HTMLDivElement>(null);
    const { dispatch } = useCart(); // Move useCart hook to the top level

    const handleCloseAside = () => {
        setAsideOpen(false);
        setSelectedProduct(null);
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await grabSuggestedProducts(userEmail);
                console.log(data); // Log to see if URLs are correct
                setProducts(data);

                if (data.length > 0) {
                    const duplicatedProducts = [...data, ...data, ...data];
                    setDisplayProducts(duplicatedProducts);
                }
                setLoading(false); // Set loading to false after data is fetched
            } catch (error) {
                console.error('Error fetching products:', error);
                setLoading(false); // Set loading to false even if there's an error
            }
        };

        fetchData();
    }, [userEmail]);

    useEffect(() => {
        const handleScroll = () => {
            if (scrollRef.current) {
                const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
                const scrollLeftPercentage = (scrollLeft / scrollWidth) * 100;
                const scrollRightPercentage = ((scrollLeft + clientWidth) / scrollWidth) * 100;

                if (scrollLeftPercentage <= 0) {
                    scrollRef.current.scrollLeft = scrollWidth / 3;
                } else if (scrollRightPercentage >= 100) {
                    scrollRef.current.scrollLeft = scrollWidth / 3;
                }
                setScrollPosition(scrollLeft);
            }
        };

        const container = scrollRef.current;
        container?.addEventListener('scroll', handleScroll);

        return () => {
            container?.removeEventListener('scroll', handleScroll);
        };
    }, [displayProducts]);

    const handleClick = (productId: string) => {
        router.push(`/product/${productId}`); // Navigate to the dynamic route
    };

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const scrollAmount = direction === 'right' ? 300 : -300;
            scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
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
            price: !isCombo ? parseFloat(product.price_size[0]?.price) : parseFloat(product.price),
            quantity: 1,
            ogPrice: !isCombo ? parseFloat(product.price_size[0]?.price) : parseFloat(product.price),
            activeDiscount: product.active_discount,
            discountPrice: !isCombo ? parseFloat(product.discount_price_size[0]?.price) : parseFloat(product.active_discount_price),
            discountAmount: product.discount_amount,
            comboItems: isCombo ? product.combo_items : undefined,
            spiceLevel: isProduct ? product.spice_level[0]?.label : undefined,
            size: isProduct ? product.price_size[0]?.size : undefined
        };
    
        // Compute the price without converting it to a string or fixing decimal places
        const computedPrice = item.activeDiscount
            ? (item.discountPrice * item.quantity).toFixed(2)
            : (item.price * item.quantity).toFixed(2);
    
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
        setSelectedProduct(product);
        setAsideOpen(true);
    };
    

    return (
        <div className='relative'>
            {/* Scroll Left Button */}
            <button
                onClick={() => scroll('left')}
                className='absolute top-1/2 left-4 transform -translate-y-1/2 bg-gray-300 rounded-full p-2 z-10 hover:bg-gray-400 focus:outline-none'
                aria-label='Scroll left'
            >
                <svg className='w-6 h-6 text-gray-700' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 18l-6-6 6-6" />
                </svg>
            </button>
            {/* Scroll Right Button */}
            <button
                onClick={() => scroll('right')}
                className='absolute top-1/2 right-4 transform -translate-y-1/2 bg-gray-300 rounded-full p-2 z-10 hover:bg-gray-400 focus:outline-none'
                aria-label='Scroll right'
            >
                <svg className='w-6 h-6 text-gray-700' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 18l6-6-6-6" />
                </svg>
            </button>
            {/* Scrollable Container */}
            <div
                ref={scrollRef}
                className='flex overflow-x-auto gap-2 md:gap-4 lg:gap-6 px-4 snap-x snap-mandatory scrollbar-hidden'
                style={{
                    scrollSnapType: 'x mandatory',
                    msOverflowStyle: 'none', /* IE and Edge */
                    scrollbarWidth: 'none', /* Firefox */
                }}
            >
                {loading ? (
                    // Skeleton Loader
                    <div className='flex gap-2 md:gap-4 lg:gap-6 px-4'>
                        {Array.from({ length: 6 }).map((_, index) => (
                            <div
                                key={index}
                                className='flex-shrink-0 w-full md:w-[20rem] lg:w-[25rem] xl:w-[30rem] bg-[#F9F6EE] rounded-xl shadow-lg p-4 flex flex-col'
                            >
                                <Skeleton height={300} className='rounded-t-xl' />
                                <div className='w-full flex flex-col gap-2 pt-4'>
                                    <Skeleton width='60%' height={30} />
                                    <Skeleton width='40%' height={30} />
                                </div>
                                <div className='w-full flex gap-4 py-2'>
                                    <Skeleton width={70} height={30} />
                                    <Skeleton width={70} height={30} />
                                </div>
                                <div className='w-full pt-2'>
                                    <Skeleton height={40} width='100%' />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : displayProducts.length > 0 ? (
                    displayProducts.map((product) => (
                        <div
                            key={product.id}
                            className='flex-shrink-0 w-full md:w-[20rem] lg:w-[25rem] xl:w-[30rem] bg-[#F9F6EE] rounded-xl shadow-lg transform transition-transform duration-300 ease-in-out hover:scale-105 cursor-pointer relative p-4'
                            onClick={() => handleClick(product.id)}
                            role="button"
                            aria-label={`View details for ${product.product_name}`}
                        >
                            {product.active_discount && (
                                <div className='absolute top-2 right-2 bg-custom-yellow text-white rounded-md p-2'>
                                    <p className='text-lg font-bold'>{product.discount_amount}%</p>
                                </div>
                            )}
                            <img
                                src={product.finalUrl}
                                alt={`Image of ${product.product_name}`}
                                className='w-full h-[20rem] object-cover rounded-t-xl'
                            />
                            <div className='w-full pt-[1.5rem] pb-[0rem] px-[.5rem] flex items-center justify-between'>
                                <h4 className='text-xl font-semibold'>{product.product_name}</h4>
                                <h4 className='text-xl font-semibold'>
                                    ${product.active_discount ? product.discount_price_size[0]?.price : product.price_size[0]?.price}
                                </h4>
                            </div>
                            <div className='w-full px-[.5rem] flex gap-4 pb-[1rem]'>
                                <div className='bg-gray-300 rounded-md w-[3.5rem] flex items-center justify-center px-5'>
                                    <div className='w-6 h-6 flex items-center justify-center'>
                                        <svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 122.88 117.19" className="w-4 h-4">
                                            <path d="M64.39,2,80.11,38.76,120,42.33a3.2,3.2,0,0,1,1.83,5.59h0L91.64,74.25l8.92,39a3.2,3.2,0,0,1-4.87,3.4L61.44,96.19,27.09,116.73a3.2,3.2,0,0,1-4.76-3.46h0l8.92-39L1.09,47.92A3.2,3.2,0,0,1,3,42.32l39.74-3.56L58.49,2a3.2,3.2,0,0,1,5.9,0Z" />
                                        </svg>
                                    </div>
                                    <p className='tracking-wide text-md font-medium ml-1'>
                                        {product.rating_messages == null || product.rating_messages.length === 0 ? "0" : product.rating_messages.length}
                                    </p>

                                </div>
                                <div className='bg-gray-300 rounded-md w-auto flex items-center gap-1'>
                                    <p className='tracking-wide text-md font-medium'>30 - 45 min</p>
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
                ) : (
                    <p className='text-center text-gray-500 text-lg'>No suggestions available.</p>
                )}
            </div>
            {selectedProduct && (
                <SlidingAside
                    isOpen={asideOpen}
                    onClose={handleCloseAside}
                    product={selectedProduct}
                />
            )}
        </div>
    );
};

export default SuggestionProducts;
