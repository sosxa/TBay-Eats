import React from 'react'
import CheckOutClient from './CheckOutClient'
import HeaderWithNav from "../components/header/HeaderWithNav";
import FooterLayout from "../components/footerLayouts/FooterLayout";
const page = () => {
    return (
        <div>
            <HeaderWithNav />
            <CheckOutClient />
            <FooterLayout />
        </div>
    )
}

export default page
