'use server';
import React from 'react';
import ClientRestaurant from '../restaurantComponents/ClientRestaurant'
import HeaderWithNav from '@/app/components/header/HeaderWithNav';
import FooterLayout from '@/app/components/footerLayouts/FooterLayout';

const page = () => {
    return (
        <div>
            <HeaderWithNav />
            <ClientRestaurant />
            <FooterLayout />
        </div>
    )
}

export default page
