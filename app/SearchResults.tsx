'use client';
import React, { useEffect, useState } from 'react';
import getProductResults from './components/header/headerComponents/getProductResults';
import getComboResults from './components/header/headerComponents/getComboResults';
import getRestaurantResults from './components/header/headerComponents/getRestaurantResults';
import defaultPfp from "./defaultPfp.png"
import defaultBanner from "./defaultBanner.png"
import { useCart } from './components/header/headerComponents/CartContext';
import SkeletonLoader from './SkeletonLoader';
import { useRouter } from 'next/navigation';

interface SearchProps {
    search: string;
}

const SearchResults: React.FC<SearchProps> = ({ search }) => {
    const [productData, setProductData] = useState<any[]>([]);
    const [comboData, setComboData] = useState<any[]>([]);
    const [restaurantData, setRestaurantData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const products = await getProductResults(search);
                const combos = await getComboResults(search);
                const restaurants = await getRestaurantResults(search);

                setProductData(products);
                setComboData(combos);
                setRestaurantData(restaurants);
            } catch (err) {
                setError('Failed to fetch data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [search]);


    if (error) return <div>{error}</div>;

    const renderProduct = (product: any) => (
        <div
            key={product.id}
            className='w-full rounded-xl shadow-lg bg-[#F9F6EE] transform transition-transform duration-300 ease-in-out hover:scale-105 cursor-pointer relative p-4'
            onClick={() => {
                router.push(`/product/${product.id}`)
            }}
        >
            <img
                src={product.firstImgUrl.publicUrl}
                width={500}
                height={500}
                alt={`Image of ${product.product_name}`}
                className='w-full h-[20rem] object-cover rounded-t-xl'
            />
            {product.active_discount && (
                <div className='absolute top-2 right-2 bg-custom-yellow text-white rounded-md p-2'>
                    <p className='text-lg font-bold'>{product.discount_amount}%</p>
                </div>
            )}
            <div className='w-full pt-[1.5rem] pb-[0rem] px-[.5rem] flex items-center justify-between'>
                <h4 className='text-xl font-semibold'>{product.product_name}</h4>
                <h4 className='text-xl font-semibold'>
                    ${(product.active_discount ? product.discount_price_size?.[0]?.price : product.price_size?.[0]?.price) || 'N/A'}
                </h4>
            </div>
            <div className='w-full px-[.5rem] flex gap-4 pb-[1rem]'>
                <div className='bg-gray-300 rounded-md w-[3.5rem] flex items-center justify-center'>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 122.88 117.19" className="w-4 h-4">
                        <path d="M64.39,2,80.11,38.76,120,42.33a3.2,3.2,0,0,1,1.83,5.59h0L91.64,74.25l8.92,39a3.2,3.2,0,0,1-4.87,3.4L61.44,96.19,27.09,116.73a3.2,3.2,0,0,1-4.76-3.46h0l8.92-39L1.09,47.92A3.2,3.2,0,0,1,3,42.32l39.74-3.56L58.49,2a3.2,3.2,0,0,1,5.9,0Z" />
                    </svg>
                    <p className='tracking-wide text-md font-medium ml-1'>{product.rating}</p>
                </div>
                <div className='bg-gray-300 rounded-md w-[5.5rem] flex items-center'>
                    <p className='tracking-wide text-md font-medium'>{product.deliveryTime} min</p>
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
    );

    const renderCombo = (combo: any) => (
        <div
            key={combo.id}
            className='w-full rounded-xl shadow-lg bg-[#F9F6EE] transform transition-transform duration-300 ease-in-out hover:scale-105 cursor-pointer relative p-4'
            onClick={() => {
                router.push(`/combo/${combo.id}`)
            }}
        >
            <img
                src={combo.firstImgUrl.publicUrl}
                width={500}
                height={500}
                alt={`Image of ${combo.combo_name}`}
                className='w-full h-[20rem] object-cover rounded-t-xl'
            />
            {combo.active_discount && (
                <div className='absolute top-2 right-2 bg-custom-yellow text-white rounded-md p-2'>
                    <p className='text-lg font-bold'>{combo.discount_amount}%</p>
                </div>
            )}
            <div className='w-full pt-[1.5rem] pb-[0rem] px-[.5rem] flex items-center justify-between'>
                <h4 className='text-xl font-semibold'>{combo.combo_name}</h4>
                <h4 className='text-xl font-semibold'>
                    ${(combo.active_discount ? combo.active_discount_price : combo.price) || 'N/A'}
                </h4>
            </div>
            <div className='w-full px-[.5rem] flex gap-4 pb-[1rem]'>
                <div className='bg-gray-300 rounded-md w-[3.5rem] flex items-center justify-center'>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 122.88 117.19" className="w-4 h-4">
                        <path d="M64.39,2,80.11,38.76,120,42.33a3.2,3.2,0,0,1,1.83,5.59h0L91.64,74.25l8.92,39a3.2,3.2,0,0,1-4.87,3.4L61.44,96.19,27.09,116.73a3.2,3.2,0,0,1-4.76-3.46h0l8.92-39L1.09,47.92A3.2,3.2,0,0,1,3,42.32l39.74-3.56L58.49,2a3.2,3.2,0,0,1,5.9,0Z" />
                    </svg>
                    <p className='tracking-wide text-md font-medium ml-1'>{combo.rating}</p>
                </div>
                <div className='bg-gray-300 rounded-md w-[5.5rem] flex items-center'>
                    <p className='tracking-wide text-md font-medium'>{combo.deliveryTime} min</p>
                </div>
            </div>
            <div className='w-full px-[.5rem] pb-[1rem]'>
                <button
                    className='w-full bg-custom-yellow text-white font-bold py-2 rounded-md hover:bg-yellow-600 transition-colors'
                    onClick={(event) => handleAddToCartClick(event, combo)}
                >
                    Add to Cart
                </button>
            </div>
        </div>
    );

    const renderRestaurant = (restaurant: any) => (
        <div
            key={restaurant.id}
            className="border bg-[#F9F6EE] border-gray-300 rounded-lg overflow-hidden shadow-lg p-4 flex flex-col items-center gap-4 hover:cursor-pointer transform transition-transform duration-300 ease-in-out hover:scale-105"
            onClick={() => {
                router.push(`/restaurant/${restaurant.id}`)
            }}
        >
            <img
                src={restaurant.pfpUrl || defaultPfp}
                alt={`Profile picture for ${restaurant.restaurant_name}`}
                className="w-32 h-32 object-cover rounded-full"
            />
            <img
                src={restaurant.bannerUrl || defaultBanner}
                alt={`Banner for ${restaurant.restaurant_name}`}
                className="w-full h-48 object-cover"
            />
            <h1 className="text-xl font-semibold text-gray-800 text-center">
                {restaurant.restaurant_name}
            </h1>
        </div>
    );

    const { dispatch } = useCart(); // Move useCart hook to the top level

    const handleAddToCartClick = (event: React.MouseEvent<HTMLButtonElement>, product: any) => {
        event.stopPropagation();

        // Determine if it's a combo or product
        console.log("1")
        const isCombo = product.combo_name !== undefined;
        const isProduct = product.product_name !== undefined;

        if (!isCombo && !isProduct) {
            console.error("Product must have either combo_name or product_name");
            return;
        }
        console.log("2")

        // Create the common item object
        const item = {
            itemId: product.id,
            itemName: isCombo ? product.combo_name : product.product_name,
            type: isCombo ? 'combo' : 'product',
            firstImgUrl: isProduct ? product.finalUrl : product.firstImgUrl.publicUrl,
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

        console.log("3")
        // Compute the price
        const computedPrice = (item.ogPrice * (item.quantity ?? 1)).toFixed(2);
        console.log("4")

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
        console.log("done done")
        // setSelectedProduct(product);
        // setAsideOpen(true);
    };

    if (loading) {
        return (
            <div>
                <SkeletonLoader type='product' />
                <SkeletonLoader type='combo' />
                <SkeletonLoader type='restaurant' />
            </div>
        );
    }

    if (error) return <div>{error}</div>;

    return (
        <div className='p-4 space-y-6'>
            {productData.length > 0 ? (
                <div>
                    <h1 className='text-black text-2xl font-semibold mb-4'>Products</h1>
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                        {productData.map(renderProduct)}
                    </div>
                </div>
            ) : (
                <div>
                    <h1 className='text-black text-2xl font-semibold'>No Products Found</h1>
                </div>
            )}

            {comboData.length > 0 ? (
                <div>
                    <h1 className='text-black text-2xl font-semibold mb-4'>Combos</h1>
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                        {comboData.map(renderCombo)}
                    </div>
                </div>
            ) : (
                <div>
                    <h1 className='text-black text-2xl font-semibold'>No Combos Found</h1>
                </div>
            )}

            {restaurantData.length > 0 ? (
                <div>
                    <h1 className='text-black text-2xl font-semibold mb-4'>Restaurants</h1>
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                        {restaurantData.map(renderRestaurant)}
                    </div>
                </div>
            ) : (
                <div>
                    <h1 className='text-black text-2xl font-semibold'>No Restaurants Found</h1>
                </div>
            )}
        </div>
    );
};


export default SearchResults;
