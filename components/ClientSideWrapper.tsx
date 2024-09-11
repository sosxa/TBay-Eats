'use client';

import React, { useState, useEffect } from "react";
import FoodDiv from "@/app/components/food/foodMenuLayout";
import CategorySelector from "@/app/menuLogic/CategorySelector";
import DualRangeSliderDemo from "@/app/menuLogic/DualRangeSlider"; 
 

const ClientSideWrapper: React.FC = () => {
    const [selectedCategory, setSelectedCategory] = useState<any>('All');
    const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({ min: 0, max: 999 });
    const [listingType, setListingType] = useState<'combos' | 'products'>('products');
    const [rdyToFetch, setRdyToFetch] = useState<boolean>(false);
    const [rdyToRedirect, setRdyToRedirect] = useState<boolean>(false);

    useEffect(() => {
        if (rdyToRedirect) {
            setRdyToFetch(true);
            setRdyToRedirect(false);
        }
    }, [rdyToRedirect]);

    const [isCartVisible, setIsCartVisible] = useState<boolean>(false);
    const handleCartClick = () => {
        setIsCartVisible(!isCartVisible);
    };

    return (
        <>
            <div className="xl:flex">
                <div className="w-full xl:w-1/4 xl:p-4">
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
                    {/* Fetched Products */}
                    {rdyToFetch && (
                        <FoodDiv
                            filter={selectedCategory}
                            prices={priceRange}
                            type={listingType}
                            rdyToFetch={rdyToFetch}
                        />
                    )}
                </div>
            </div>
        </>

    );
};

export default ClientSideWrapper;
