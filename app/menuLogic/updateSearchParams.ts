// useUpdateSearchParams.ts
'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

const useUpdateSearchParams = () => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const updateSearchParams = useCallback(
        (category: string | undefined, price: { min: number; max: number } | undefined) => {
            const updatedParams = new URLSearchParams();
            
            if (category) {
                updatedParams.set('category', category.toLowerCase());
            }
            
            if (price) {
                updatedParams.set('price', `${price.min},${price.max}`);
            }
            
            router.replace(`?${updatedParams.toString()}`, undefined);
        },
        [router]
    );

    return updateSearchParams;
};

export default useUpdateSearchParams;
