import React from 'react';
import HeaderWithNav from '../components/header/HeaderWithNav';
import FooterLayout from '../components/footerLayouts/FooterLayout';
import CombinedScroll from '../components/aboutComponent/CombinedScroll';

const page = () => {

    return (
        <>
            <HeaderWithNav />
            <CombinedScroll />
            <FooterLayout />
        </>
    )
}

export default page
