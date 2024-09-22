'use client';
import React, { useState, useEffect } from "react";
import CategorySelector from "@/app/menuLogic/CategorySelector";
import DualRangeSliderDemo from "@/app/menuLogic/DualRangeSlider";
import RestaurantMenuLayout from "./RestaurantMenuLayout";
import grabRestaurantById from "./grabRestaurantById";
import RestaurantBanner from "./RestaurantBanner";

const ClientRestaurant: React.FC = () => {
    const [selectedCategory, setSelectedCategory] = useState<any>('All');
    const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({ min: 0, max: 999 });
    const [listingType, setListingType] = useState<'combos' | 'products'>('products');
    const [rdyToFetch, setRdyToFetch] = useState<boolean>(false);
    const [rdyToRedirect, setRdyToRedirect] = useState<boolean>(false);
    const [restaurantEmail, setRestaurantEmail] = useState<any>("");
    const [userId, setuserId] = useState<any>("");
    const [restaurantName, setRestaurantName] = useState<any>("");
    const [bannerUrl, setBannerUrl] = useState<any>("");

    useEffect(() => {
        if (rdyToRedirect) {
            setRdyToFetch(true);
            setRdyToRedirect(false);
        } else {
            setRdyToFetch(false);
            setRdyToRedirect(false);
        }
    }, [rdyToRedirect]);

    useEffect(() => {
        // Define an async function inside the useEffect
        const fetchData = async () => {
            try {
                const url = window.location.pathname;
                const parts = url.split('/');
                const lastSegment = parts.pop(); // Extract the ID from the URL

                console.log("Extracted ID:", lastSegment);

                const zz = await grabRestaurantById(lastSegment); // Await the result of the async function

                if (zz) {
                    console.log(zz); // Process the result
                    setRestaurantEmail(zz.email)
                    setuserId(zz.id);
                    setBannerUrl(zz.banner);
                    setRestaurantName(zz.name);
                    return;
                }

            } catch (error) {
                console.error('Error fetching restaurant:', error); // Handle errors
            }
        };

        fetchData(); // Call the async function
    }, []); // Empty dependency array means this runs once on component mount

    return (
        <>
            <div>
                <div className="xl:flex">
                    <div className="w-full lg:flex xl:block xl:w-1/4 xl:p-4">
                        {/* Filters and Range Slider */}
                        <CategorySelector
                            setSelectedCategory={setSelectedCategory}
                            setListingType={setListingType}
                            setRdyToRedirect={setRdyToRedirect}
                            setRdyToFetch={setRdyToFetch}
                        />
                        <DualRangeSliderDemo
                            setSelectedPriceRange={setPriceRange}
                            minValue={0}
                            maxValue={900}
                            initialValues={priceRange}
                        />
                    </div>
                    <div className="w-full xl:w-3/4 xl:p-4">
                        <RestaurantBanner
                            bannerUrl={bannerUrl}
                            restaurantName={restaurantName}
                        />
                        {rdyToFetch && restaurantEmail !== "" && userId !== "" && (
                            <RestaurantMenuLayout
                                restaurantEmail={restaurantEmail}
                                userId={userId}
                                filter={selectedCategory}
                                prices={priceRange}
                                type={listingType}
                                rdyToFetch={rdyToFetch}
                            />
                        )}
                    </div>
                </div>
            </div>
        </>

    );
};

export default ClientRestaurant;
