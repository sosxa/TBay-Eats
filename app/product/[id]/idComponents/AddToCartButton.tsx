import React from 'react';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';
import { useCart } from '@/app/components/header/headerComponents/CartContext';

interface AddToCartButtonProps {
    item: {
        itemId: string;
        itemName: string;
        type: string;
        firstImgUrl: string;
        itemOgName: string;
        creatorEmail: string;
        comboItems: any[];
        filter: string;
        price: string;
        quantity: number;
        spiceLevel?: string;
        size?: string;
        ogPrice: number; // Ensure this is a number
        activeDiscount: boolean;
        discountPrice: any;
        discountAmount: any;
    };
    disabled?: boolean;
}

const AddToCartButton: React.FC<AddToCartButtonProps> = ({ item, disabled = false }) => {
    const { dispatch } = useCart();

    const handleClick = () => {
        if (disabled) return;

        // Ensure ogPrice is correctly parsed as a number
        const computedPrice = (item.ogPrice * (item.quantity ?? 1)).toFixed(2);

        dispatch({
            type: 'ADD_ITEM',
            payload: {
                ...item,
                quantity: item.quantity ?? 1,
                price: computedPrice,
            },
        });
    };

    return (
        <button
            onClick={handleClick}
            disabled={disabled}
            className={`mb-5 flex items-center font-semibold py-2 px-4 rounded-lg ${disabled
                ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                : 'bg-green-200 text-green-600 hover:bg-green-300 focus:outline-none focus:ring-2 focus:ring-green-200'
                } mt-4`}
        >
            <ShoppingCartIcon className="h-6 w-6 mr-2" />
            <span>Add to Cart</span>
        </button>
    );
};

export default AddToCartButton;
