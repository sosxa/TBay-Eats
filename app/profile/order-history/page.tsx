import React from 'react';
import DecideClient from '@/app/components/sectionComponent/DecideClient';
import FooterLayout from '@/app/components/footerLayouts/FooterLayout';
import Header from '../../components/header/Header';
import ImageUploader from '@/app/components/profileImgComponent/profileClient';

const exampleData = [
    {
        restaurantPfp: "https://wallpapers.com/images/hd/cool-profile-picture-minion-13pu7815v42uvrsg.jpg",
        restaurantBanner: "https://www.lifecaretechnology.com/wp-content/uploads/2018/12/default-banner.jpg",
        restaurantName: "MacDonalds",
        items: ["burger", "fries"]
    },
    {
        restaurantPfp: "https://wallpapers.com/images/hd/cool-profile-picture-pizza.jpg",
        restaurantBanner: "https://www.lifecaretechnology.com/wp-content/uploads/2018/12/default-banner-pizza.jpg",
        restaurantName: "Pizza Hut",
        items: ["pizza", "wings"]
    }
    // Add more restaurant objects as needed
];

const Page = () => {
    return (
        <div>
            <Header />
            <div className='pt-[7rem]'>
                <ImageUploader />
            </div>
            <div className='-translate-y-[1.5rem]'>
                <DecideClient />
            </div>

            {/* Display restaurant information */}
            <div className="p-4">
                {exampleData.map((restaurant, index) => (
                    <div key={index} className="restaurant-info mb-8 bg-white shadow-lg rounded-lg overflow-hidden">
                        <div className="relative">
                            {/* Banner */}
                            <img
                                src={restaurant.restaurantBanner}
                                alt={`${restaurant.restaurantName} Banner`}
                                className="w-full h-48 object-cover"
                            />
                            {/* Profile Picture */}
                            <img
                                src={restaurant.restaurantPfp}
                                alt={`${restaurant.restaurantName} Profile`}
                                className="absolute top-1/2 left-4 transform -translate-y-1/2 w-32 h-32 rounded-full border-4 border-white shadow-md"
                            />
                        </div>
                        <div className="p-4">
                            <h1 className="text-2xl font-bold mb-2">{restaurant.restaurantName}</h1>
                            <div className="items-list mt-4">
                                <h2 className="text-xl font-semibold">Ordered Items:</h2>
                                <ul className="list-disc ml-6">
                                    {restaurant.items.map((item, itemIndex) => (
                                        <li key={itemIndex} className="mt-2">{item}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <FooterLayout />
        </div>
    );
};

export default Page;
