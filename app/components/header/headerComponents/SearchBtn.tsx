import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface SearchProps {
    placeholder?: string;
    searchInputClass?: string;
    divClassName?: string;
    buttonClassName?: string;
    buttonName?: string;
}

const SearchBtn: React.FC<SearchProps> = ({ placeholder, searchInputClass, divClassName, buttonClassName, buttonName }) => {
    // Allows us to manipulate the router
    const router = useRouter();
    // Allows us to get the current search parameters
    const searchParams = useSearchParams();

    const handleSearch = (e: any) => {
        const searchQuery = e.trim(); // Remove any leading or trailing spaces

        // Create a new URLSearchParams object to manage the search query
        const params = new URLSearchParams();
        if (searchQuery) {
            params.set('search', searchQuery);
        }

        // Clear the pathname and set the search query
        const newUrl = `/?${params.toString()}`;

        // Replace the current URL with the new URL
        router.replace(newUrl);
    };

    return (
        <div className={divClassName}>
            <input
                className={searchInputClass}
                type='search'
                placeholder={placeholder}
                onChange={(e) => {
                    handleSearch(e.target.value);
                }}
                defaultValue={searchParams.get('search')?.toString() || ''}
            />
            <button type='submit' className={buttonClassName}>{buttonName}</button>
        </div>
    );
};

export default SearchBtn;
