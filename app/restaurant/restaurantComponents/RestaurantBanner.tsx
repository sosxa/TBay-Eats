'use client';
import React from 'react'


interface RestaurantBannerProps {
    restaurantName: string,
    bannerUrl: string
}

export default function RestaurantBanner({ restaurantName, bannerUrl }: RestaurantBannerProps): React.ReactElement {
    return (
        <div className='py-6'>
            {/* <img
                    src={bannerUrl}
                    alt={restaurantName}
                    className='w-full h-1/4 object-cover'
                /> */}
            <div className="relative font-sans before:absolute before:w-full before:h-full before:inset-0 before:bg-black before:opacity-50 before:z-10 rounded-lg">
                {bannerUrl !== "" && <img src={bannerUrl}
                    alt={"Banner for " + restaurantName}
                    className="absolute inset-0 w-full h-full object-cover"
                />}
                {bannerUrl === "" &&
                    <img src={"https://cdn.prod.website-files.com/5a9ee6416e90d20001b20038/64f5e045af3a6f9f11679481_Rectangle%20(99).svg"}
                        alt={"Banner for " + restaurantName}
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                }

                <div className="min-h-[350px] relative z-50 h-full max-w-6xl mx-auto flex flex-col justify-center items-center text-center text-white p-6">
                    <h2 className="sm:text-4xl text-2xl font-bold mb-6">{restaurantName}</h2>
                    <p className="sm:text-lg text-base text-center text-gray-200">Feel free to explore all products and combos!</p>
                </div>
            </div>

        </div>
    )
}
