'use client';
import React, { useState, useMemo } from 'react';
import Sidebar from '@/app/product/[id]/idComponents/Sidebar';
import { useCart } from '@/app/components/header/headerComponents/CartContext';
import { CartItem } from './CartItem';

const SidebarManager: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
    const { cartItems } = useCart();

    const toggleSidebar = () => {
        setIsSidebarOpen(prevState => !prevState);
    };

    // Group cart items by itemId and sum quantities
    const groupedCartItems = useMemo(() => {
        const groupedItems: Record<string, CartItem> = {};

        cartItems.forEach(item => {
            if (groupedItems[item.itemId]) {
                groupedItems[item.itemId].quantity += item.quantity;
            } else {
                groupedItems[item.itemId] = { ...item };
            }
        });

        return Object.values(groupedItems);
    }, [cartItems]);

    return (
        <>
            <button
                onClick={toggleSidebar}
                className="fixed bottom-4 right-4 bg-blue-500 text-white p-3 rounded-full z-50"
            >
                Cart
            </button>
            <Sidebar
                isOpen={isSidebarOpen}
                onClose={toggleSidebar}
                cartItems={groupedCartItems}
            />
            {children}
        </>
    );
};

export default SidebarManager;
