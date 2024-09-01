'use client';
import React, { useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import fetchAllRestaurants from '@/app/menuLogic/fetchAllRestaurants';
import defaultPfp from '../../defaultPfp.png'; // Import default images
import defaultBanner from '../../defaultBanner.png';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const ListRestaurants = () => {
    const [restaurants, setRestaurants] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const router = useRouter();

    useEffect(() => {
        const grabRestaurants = async () => {
            const data = await fetchAllRestaurants();
            if (data) {
                setRestaurants(data);
                setLoading(false); // Set loading to false once data is fetched
            }
        };
        grabRestaurants();
    }, []);

    const handleRedirection = async (restaurantId: any) => {
        router.replace("restaurant/" + restaurantId);
    };

    // Create an array of placeholders
    const placeholders = new Array(6).fill(null);

    return (
        <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 p-6 w-full'>
            {loading ? (
                // Map over the placeholders array to display multiple Skeleton loaders
                placeholders.map((_, index) => (
                    <div
                        key={index}
                        className="border bg-[#F9F6EE] border-gray-300 rounded-lg overflow-hidden shadow-lg p-4 flex flex-col items-center gap-4"
                    >
                        <Skeleton
                            height={110}
                            width={110}
                            circle
                            className="mb-4"
                        />
                        <Skeleton
                            height={192}
                            width={550}
                            className="mb-4"
                            count={1}
                        />
                        <Skeleton
                            height={24}
                            width={300}
                            className="text-center"
                            count={1}
                        />
                    </div>
                ))
            ) : (
                restaurants?.length > 0 && restaurants.map((restaurant) => (
                    <div
                        className="border bg-[#F9F6EE] border-gray-300 rounded-lg overflow-hidden shadow-lg p-4 flex flex-col items-center gap-4 hover:cursor-pointer cursor-pointer transform transition-transform duration-300 ease-in-out hover:scale-105"
                        key={restaurant.id}
                        onClick={() => handleRedirection(restaurant.id)}
                    >
                        <img
                            src={restaurant.pfpUrl || defaultPfp} // Use default if pfpUrl is missing
                            alt={`Profile picture for ${restaurant.restaurant_name}`}
                            className="w-32 h-32 object-cover rounded-full"
                        />
                        <img
                            src={restaurant.bannerUrl || defaultBanner} // Use default if bannerUrl is missing
                            alt={`Banner for ${restaurant.restaurant_name}`}
                            className="w-full h-48 object-cover"
                        />
                        {!restaurant.pfpUrl || restaurant.pfpUrl === undefined || restaurant.pfpUrl === null && <Image
                            src={defaultPfp} // Use default if pfpUrl is missing
                            alt={`Profile picture for ${restaurant.restaurant_name}`}
                            className="w-32 h-32 object-cover rounded-full"
                        />}
                        {!restaurant.bannerUrl || restaurant.bannerUrl === undefined || restaurant.bannerUrl === null && <Image
                            src={defaultBanner} // Use default if bannerUrl is missing
                            alt={`Banner for ${restaurant.restaurant_name}`}
                            className="w-full h-48 object-cover"
                        />}
                        <h1 className="text-xl font-semibold text-gray-800 text-center">
                            {restaurant.restaurant_name}
                        </h1>
                    </div>
                ))
            )}
        </div>
    );
};

export default ListRestaurants;
