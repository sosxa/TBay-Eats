import React, { useState, useMemo } from 'react';
import Sidebar from '@/app/product/[id]/idComponents/Sidebar';
import { useCart } from '@/app/components/header/headerComponents/CartContext';
import { CartItem } from './CartItem';

const SidebarManager: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  // Access cart items from the state
  const { state: { items: cartItems } } = useCart();

  const toggleSidebar = () => {
    setIsSidebarOpen(prevState => !prevState);
  };

  // Group cart items by itemId and sum quantities
  const groupedCartItems = useMemo(() => {
    const groupedItems: Record<string, CartItem> = {};

    cartItems.forEach((item: CartItem) => {
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
              cartItems={groupedCartItems} onRemoveItem={function (itemId: string): void {
                  throw new Error('Function not implemented.');
              } } onUpdateItemQuantity={function (itemId: string, quantity: number): void {
                  throw new Error('Function not implemented.');
              } }      />
      {children}
    </>
  );
};

export default SidebarManager;
