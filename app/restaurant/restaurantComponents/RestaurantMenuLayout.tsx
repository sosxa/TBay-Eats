'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import restaurantFilter from "./restaurantFilter";

interface FoodDivProps {
    filter: string;
    prices: { min: number; max: number };
    type: 'combos' | 'products';
    rdyToFetch: boolean;
    restaurantEmail: string;
    userId: string;
}

const RestaurantMenuLayout: React.FC<FoodDivProps> = ({ filter, prices, type, rdyToFetch, restaurantEmail, userId }) => {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState<number>(1);
    const itemsPerPage = 9;

    const router = useRouter();

    const fetchData = useCallback(async () => {
        if (rdyToFetch) {
            try {
                setLoading(true);
                const data = await restaurantFilter(restaurantEmail, userId, filter, [prices.min, prices.max], type, page, itemsPerPage);

                const productsArray = Array.isArray(data) ? data : [];
                
                if (productsArray.length < itemsPerPage) {
                    setHasMore(false);
                }

                setProducts(prevData => [...prevData, ...productsArray]);
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setLoading(false);
            }
        }
    }, [filter, prices, type, rdyToFetch, page]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleChange = (productId: any) => {
        router.push('/product/' + productId);
    };

    const handleLoadMore = () => {
        if (hasMore) {
            setPage(prevPage => prevPage + 1);
        }
    };

    return (
        <>
            {loading ? (
                <div className='w-full flex flex-wrap gap-2 md:gap-4 lg:gap-6 md:grid md:grid-cols-2 lg:grid-cols-3'>
                    {Array.from({ length: itemsPerPage }).map((_, index) => (
                        <div key={index} className='w-full rounded-xl shadow-lg p-4 flex flex-col'>
                            <Skeleton height={300} width='100%' className='rounded-t-xl' />
                            <div className='w-full flex flex-col gap-2 pt-4'>
                                <Skeleton width='60%' height={30} />
                                <Skeleton width='40%' height={30} />
                            </div>
                            <div className='w-full flex gap-4 py-2'>
                                <Skeleton width={70} height={30} className='mr-2' />
                                <Skeleton width={70} height={30} />
                            </div>
                            <div className='w-full pt-2'>
                                <Skeleton height={40} width='100%' />
                            </div>
                        </div>
                    ))}
                </div>
            ) : products.length === 0 ? (
                <div className='w-full text-center py-8'>
                    <p className='text-lg font-semibold text-gray-600'>No products found matching the selected filters.</p>
                </div>
            ) : (
                <div className='w-full flex flex-wrap gap-2 px-3 sm:px-[4rem] md:px-5 md:gap-4 lg:px-2 md:grid md:grid-cols-2 lg:grid-cols-3'>
                    {products.map((product) => (
                        <div key={product.id} className='w-full rounded-xl shadow-lg bg-[#F9F6EE] transform transition-transform duration-300 ease-in-out hover:scale-105 cursor-pointer relative p-4' onClick={() => handleChange(product.id)}>
                            <img src={product.finalUrl} width={500} height={500} alt={product.product_name || product.combo_name} className='w-full h-[20rem] object-cover rounded-t-xl' />
                            {product.active_discount && (
                                <div className='absolute top-2 right-2 bg-custom-yellow text-white rounded-md p-2'>
                                    <p className='text-lg font-bold'>{product.discount_amount}%</p>
                                </div>
                            )}
                            <div className='w-full pt-[1.5rem] pb-[0rem] px-[.5rem] flex items-center justify-between'>
                                <h4 className='text-xl font-semibold'>{product.product_name || product.combo_name}</h4>
                                <h4 className='text-xl font-semibold'>${product.active_discount ? product.discount_price_size?.[0]?.price : product.price_size?.[0]?.price || 'N/A'}</h4>
                            </div>
                            <div className='w-full px-[.5rem] flex gap-4 pb-[1rem]'>
                                <div className='bg-gray-300 rounded-md w-[3.5rem] flex items-center justify-center px-5'>
                                    <p className='tracking-wide text-md font-medium ml-1'>{product.rating}</p>
                                </div>
                                <div className='bg-gray-300 rounded-md w-[5.5rem] flex items-center gap-1'>
                                    <p className='tracking-wide text-md font-medium'>{product.deliveryTime} min</p>
                                </div>
                            </div>
                            <div className='w-full px-[.5rem] pb-[1rem]'>
                                <button className='w-full bg-custom-yellow text-white font-bold py-2 rounded-md hover:bg-yellow-600 transition-colors'>Add to Cart</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {hasMore && (
                <div className="text-center mt-4">
                    <button onClick={handleLoadMore} className="bg-custom-green hover:bg-custom-dark-green w-[50%] text-white px-4 py-2 rounded">Load More</button>
                </div>
            )}
        </>
    );
};

export default RestaurantMenuLayout;
