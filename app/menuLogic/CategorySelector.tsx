import React, { useEffect, useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

// Utility function to capitalize words
const capitalizeWords = (str: string) => {
    return str
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};

// Component Props Interface
interface CategorySelectorProps {
    setSelectedCategory: (category: string | undefined) => void;
    setListingType: (type: 'combos' | 'products') => void;
    setRdyToRedirect: (ready: boolean) => void;
    setRdyToFetch: (ready: boolean) => void;
}

// Component Definition
const CategorySelector: React.FC<CategorySelectorProps> = ({
    setSelectedCategory,
    setListingType,
    setRdyToRedirect,
    setRdyToFetch,
}) => {
    const searchParams = useSearchParams();
    const router = useRouter();

    const [selectedCategory, setSelectedCategoryState] = useState<string | undefined>(undefined);
    const [selectedListingType, setSelectedListingType] = useState<'combos' | 'products'>('products'); // Default to 'products'
    const [price, setPrice] = useState<string | null>(searchParams.get('price'));

    const category = searchParams.get('category') || 'all';
    const listingType = searchParams.get('type') || 'products';

    // Effect to set initial values from URL params
    useEffect(() => {
        const formattedCategory = category === 'all' ? 'All' : capitalizeWords(category);
        setSelectedCategoryState(formattedCategory);
        setSelectedCategory(formattedCategory);
        setSelectedListingType(listingType as 'combos' | 'products');
        setListingType(listingType as 'combos' | 'products');
    }, [category, listingType, setSelectedCategory, setListingType]);

    // Effect to set ready-to-fetch state
    useEffect(() => {
        if (selectedCategory && selectedListingType) {
            setRdyToFetch(true);
        }
    }, [selectedCategory, selectedListingType, setRdyToFetch]);

    // Memoized URL parameter update function
    const updateUrlParams = useCallback((newCategory?: string, newListingType?: 'combos' | 'products') => {
        const params = new URLSearchParams(window.location.search);
        if (newCategory) {
            params.set('category', newCategory.toLowerCase());
        }
        if (newListingType) {
            params.set('type', newListingType);
        }
        if (price) {
            params.set('price', price);
        }

        setRdyToRedirect(true);
        router.replace(`?${params.toString()}`, undefined);
    }, [price, router, setRdyToRedirect]);

    // Handlers for category and listing type changes
    const handleCategoryChange = useCallback((category: string | undefined) => {
        updateUrlParams(category, selectedListingType);
    }, [selectedListingType, updateUrlParams]);

    const handleListingTypeChange = useCallback((type: 'combos' | 'products') => {
        if (type !== selectedListingType) {
            updateUrlParams(selectedCategory, type);
            setSelectedListingType(type);
            setListingType(type);
        }
    }, [selectedCategory, selectedListingType, setListingType, updateUrlParams]);

    // Category list
    const categories = [
        'All', 'Trending', 'Asian', 'Indian', 'Western', 'African',
        'European', 'Middle East', 'Spanish', 'Fusion', 'Fast Food'
    ];

    return (
        <div className="max-w-full mx-auto px-5 py-8 lg:w-1/2 xl:w-auto">
            <div className="bg-gray-200 shadow-md rounded-lg max-w-full p-6">
                <h2 className="text-2xl font-semibold mb-6 text-gray-800">Filters</h2>
                
                <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-4 text-gray-800">Category</h3>
                    <div className="flex flex-wrap gap-2">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => handleCategoryChange(cat)}
                                className={`px-4 py-2 rounded-lg transition-colors 
                                    ${selectedCategory === cat ? 'bg-custom-green text-white' : 'bg-gray-300 text-gray-700 hover:bg-gray-400'} 
                                    focus:outline-none focus:ring-2 focus:ring-custom-green focus:ring-opacity-50`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <h3 className="text-xl font-semibold mb-4 text-gray-800">Listing Type</h3>
                    <div className="flex gap-2">
                        <button
                            onClick={() => handleListingTypeChange('combos')}
                            className={`px-4 py-2 rounded-lg transition-colors 
                                ${selectedListingType === 'combos' ? 'bg-custom-green text-white' : 'bg-gray-300 text-gray-700 hover:bg-gray-400'} 
                                focus:outline-none focus:ring-2 focus:ring-custom-green focus:ring-opacity-50`}
                        >
                            Combos
                        </button>
                        <button
                            onClick={() => handleListingTypeChange('products')}
                            className={`px-4 py-2 rounded-lg transition-colors 
                                ${selectedListingType === 'products' ? 'bg-custom-green text-white' : 'bg-gray-300 text-gray-700 hover:bg-gray-400'} 
                                focus:outline-none focus:ring-2 focus:ring-custom-green focus:ring-opacity-50`}
                        >
                            Products
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CategorySelector;
