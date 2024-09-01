'use client';
import React, { useState } from 'react';

interface QuantityTrackerProps {
    initialQuantity?: number;
    onQuantityChange: (quantity: number) => void;
}

const QuantityTracker: React.FC<QuantityTrackerProps> = ({ initialQuantity = 1, onQuantityChange }) => {
    const [quantity, setQuantity] = useState<number>(initialQuantity);

    const handleIncrease = () => {
        setQuantity(prevQuantity => {
            const newQuantity = prevQuantity + 1;
            onQuantityChange(newQuantity);
            return newQuantity;
        });
    };

    const handleDecrease = () => {
        setQuantity(prevQuantity => {
            if (prevQuantity > 1) {
                const newQuantity = prevQuantity - 1;
                onQuantityChange(newQuantity);
                return newQuantity;
            }
            return prevQuantity;
        });
    };

    return (
        <div className="flex items-center">
            <button
                onClick={handleDecrease}
                className="bg-gray-200 text-custom-dark-green font-semibold py-2 px-4 border border-gray-300 rounded-none hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-custom-dark-green focus:border-custom-dark-green"
            >
                -
            </button>
            <input
                type="text"
                value={quantity}
                readOnly
                className="w-14 text-center py-2 border-t border-b border-gray-300 bg-gray-100 text-gray-800 focus:ring-2 focus:border-custom-dark-green"
            />
            <button
                onClick={handleIncrease}
                className="bg-gray-200 text-custom-dark-green font-semibold py-2 px-4 border border-gray-300 rounded-none hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-custom-dark-green focus:border-custom-dark-green"
            >
                +
            </button>
        </div>
    );
}

export default QuantityTracker;
