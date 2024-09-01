import React from 'react'
import HeaderWithNav from '../components/header/HeaderWithNav'
import FooterLayout from '../components/footerLayouts/FooterLayout'
import ListingClient from './restaurantListingComponents/ListingClient'

const page = () => {
  return (
    <>
      <HeaderWithNav />
      <div>
       <ListingClient />
      </div>
      <FooterLayout />
    </>
  )
}

export default page
