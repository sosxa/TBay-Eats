'use client';
import React from 'react';
import { ShoppingCartIcon } from '@heroicons/react/24/outline'; // Adjust path as needed

interface CartButtonProps {
    onClick: () => void;
}

const CartButton: React.FC<CartButtonProps> = ({ onClick }) => {
    return (
        <button
            onClick={onClick}
            className="fixed bottom-5 right-5 bg-green-500 text-white p-3 rounded-full shadow-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-200"
        >
            <ShoppingCartIcon className="h-8 w-8" />
        </button>
    );
}

export default CartButton;
