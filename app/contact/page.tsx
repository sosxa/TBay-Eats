import React from 'react'

import HeaderWithNav from '../components/header/HeaderWithNav';
import FooterLayout from '../components/footerLayouts/FooterLayout';
// import ContactPg from "../components/contactComponent/ContactPg";

const page = () => {
    return (
        <div>
            <HeaderWithNav />
{/*             <ContactPg /> */}
            <FooterLayout />
        </div>
    )
}

export default page
