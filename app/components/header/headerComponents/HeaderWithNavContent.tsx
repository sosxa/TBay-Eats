'use client';
import React, { Suspense, useState } from 'react';
import Image from 'next/image';
import cuate from "../../../cuate.png";
import FormHeader from '../../forms/FormHeader';
import SearchBtn from './SearchBtn';
import NavbarLaptop from './NavbarLaptop';
import NavbarMobile from './NavbarMobile';
import Sidebar from '@/app/product/[id]/idComponents/Sidebar';
import { useCart } from '@/app/components/header/headerComponents/CartContext';

const HeaderWithNavContent = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { state, dispatch } = useCart();
  const cartItems = state.items;

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const removeItemFromCart = (itemId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: itemId });
  };

  const updateItemQuantity = (itemId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_ITEM_QUANTITY', payload: { itemId, quantity } });
  };

  return (
    <div className='w-auto h-max z-auto bg-custom-green mb-[5rem]'>
      <div className='h-full justify-center'>
        <NavbarLaptop className='hidden lg:inline' onCartClick={toggleSidebar} />
        <NavbarMobile className='lg:hidden' />
        <div className='flex py-14 w-[70%] mx-auto items-center text-center sm:text-left translate-x-[25%] gap-24 lg:mx-0'>
          <FormHeader
            textClass='text-white w-[100%] -translate-x-[22.5%] sm:translate-x-0 sm:w-[60%] sm:text-center lg:w-1/2 lg:text-left'
            title="Authentic local food at Tbay"
            para="TBayEAT is a courier service in which authentic home cook food is delivered to a customer"
          >
            <Suspense fallback={<div>Loading...</div>}>
              <SearchBtn
                divClassName='flex sm:translate-x-0'
                searchInputClass='mt-5 w-[28rem] h-[3rem] rounded-bl-lg text-black pl-2'
                buttonClassName="text-white float-end translate-y-5 h-[3.1rem] bottom-[4.5rem] bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-br-lg text-sm px-4 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                buttonName='Search'
                placeholder='Search local food here! '
              />
            </Suspense>
          </FormHeader>
          <Image
            className='hidden lg:flex'
            alt="image of chief"
            src={cuate}
            width={400}
            height={400}
          />
        </div>
      </div>
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={toggleSidebar}
        cartItems={cartItems}
        onRemoveItem={removeItemFromCart}
        onUpdateItemQuantity={updateItemQuantity}
      />
    </div>
  );
};

export default HeaderWithNavContent;
