// useSearchParamsHandler.ts
'use client';

import { useRouter, useSearchParams } from 'next/navigation';

const useSearchParamsHandler = () => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const getCategory = () => searchParams.get("category") || "all";
    const getPrice = () => {
        const price = searchParams.get("price");
        if (price) {
            const [min, max] = price.split(",").map(Number);
            return { min, max };
        }
        return { min: 0, max: 999 }; // Default values
    };

    const updateSearchParams = (category: string, price: { min: number; max: number }) => {
        const updatedParams = new URLSearchParams();
        updatedParams.set('category', category.toLowerCase());
        updatedParams.set('price', `${price.min},${price.max}`);
        router.replace(`?${updatedParams.toString()}`, undefined);
    };

    return {
        getCategory,
        getPrice,
        updateSearchParams
    };
};

export default useSearchParamsHandler;
