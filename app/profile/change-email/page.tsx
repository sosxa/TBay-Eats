import React from 'react'
import Header from '@/app/components/header/Header'
import FooterLayout from '@/app/components/footerLayouts/FooterLayout'
import OwnerClient from '@/app/components/sectionComponent/OwnerClient'
const page = () => {
    return (
        <div>
            <Header />
            <OwnerClient />
            Change your email here!
            <FooterLayout />
        </div>
    )
}

export default page
