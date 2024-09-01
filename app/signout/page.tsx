import React from 'react'
import ClientRedirect from './zzz'
import HeaderWithNav from '../components/header/HeaderWithNav'
import FooterLayout from '../components/footerLayouts/FooterLayout'

const page = () => {
    return (
        <>
            <HeaderWithNav />
            <ClientRedirect />
            <FooterLayout />
        </>
    )
}

export default page
