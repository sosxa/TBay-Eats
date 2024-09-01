'use client';
import React, { createContext, useReducer, useContext, ReactNode, useEffect } from 'react';

// Define types for the cart item and action
interface CartItem {
  type: string;
  itemName: string;
  itemId: string;
  firstImgUrl: string;
  itemOgName: string;
  creatorEmail: string;
  comboItems?: any[];
  filter: string;
  price: string;
  quantity: number;
  ogPrice: number; // Ensure this is a number or string that can be parsed to a number
  activeDiscount: boolean;
  discountPrice: any;
  discountAmount: any;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: string } // payload is itemId
  | { type: 'UPDATE_ITEM_QUANTITY'; payload: { itemId: string; quantity: number } };

interface CartState {
  items: CartItem[];
}

const CartContext = createContext<{ state: CartState; dispatch: React.Dispatch<CartAction> } | undefined>(undefined);

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItemIndex = state.items.findIndex(item => item.itemId === action.payload.itemId);

      if (existingItemIndex > -1) {
        const updatedItems = [...state.items];
        const existingItem = updatedItems[existingItemIndex];
        const newQuantity = existingItem.quantity + action.payload.quantity;

        // Calculate the new price based on the updated quantity and discounts
        const newPrice = action.payload.activeDiscount
          ? (parseFloat(action.payload.discountPrice) * newQuantity).toFixed(2)
          : (parseFloat(action.payload.price) * newQuantity).toFixed(2);

        updatedItems[existingItemIndex] = {
          ...existingItem,
          quantity: newQuantity,
          price: newPrice,
        };

        return { ...state, items: updatedItems };
      }

      // For new items, use the initial price
      const newItem = {
        ...action.payload,
        price: action.payload.activeDiscount
          ? (parseFloat(action.payload.discountPrice) * action.payload.quantity).toFixed(2)
          : (parseFloat(action.payload.price) * action.payload.quantity).toFixed(2),
      };
      return { ...state, items: [...state.items, newItem] };
    }

    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter(item => item.itemId !== action.payload) };

    case 'UPDATE_ITEM_QUANTITY': {
      const updatedItemIndex = state.items.findIndex(item => item.itemId === action.payload.itemId);
      if (updatedItemIndex > -1) {
        const updatedItems = [...state.items];
        const itemToUpdate = updatedItems[updatedItemIndex];
        const newQuantity = action.payload.quantity;

        const newPrice = itemToUpdate.activeDiscount
          ? (parseFloat(itemToUpdate.discountPrice) * newQuantity).toFixed(2)
          : (parseFloat(itemToUpdate.price) * newQuantity).toFixed(2);

        updatedItems[updatedItemIndex] = {
          ...itemToUpdate,
          quantity: newQuantity,
          price: newPrice,
        };

        return { ...state, items: updatedItems };
      }
      return state;
    }

    default:
      return state;
  }
};





export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize state from local storage
  const [state, dispatch] = useReducer(cartReducer, {
    items: JSON.parse(localStorage.getItem('cart') || '[]')
  });

  // Sync local storage with state changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(state.items));
  }, [state.items]);

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

