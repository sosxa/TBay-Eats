import React from 'react';
import FooterLayout from '@/app/components/footerLayouts/FooterLayout'
import Header from '../../components/header/Header'
import SettingBtn from '@/app/components/settingComponent/SettingBtn'
// img
import bacon from "../../bacon.png"
// import pear from "../../pear.png"
import pear from "../../pear.png"
import egg from "../../egg.png"
import bread from "../../bread.png"

import RestaurantClient from '@/app/components/restaurantComponent/RestaurantClient'
import { createClient } from '@/utils/supabase/server';
import FormHeader from '@/app/components/forms/FormHeader'

import Link from 'next/link';
import DecideClient from '@/app/components/sectionComponent/DecideClient'
import ImageUploader from '@/app/components/profileImgComponent/profileClient'
import DecideAside from '../aside/DecideAside';
import { redirect } from 'next/navigation'

const page = async () => {
  const supabase = createClient();

  // fetching the user table data and pulling their username 
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) {
    redirect("/login");
  }
  return (
    <>
      <Header />
      <div className='pt-[7rem]'>
        <ImageUploader />
      </div>
      <div className='-translate-y-5 xl:translate-y-[2rem]'>
        <DecideClient />

        <div className='sm:block w-full xl:flex xl:px-[8rem] xl:gap-[15rem]'>
          <div className='px-[0rem] sm:px-[5rem] md:px-[8rem] lg:px-[10rem] xl:p-0 xl:flex-1 xl:w-1/2'>
            {/* <RestaurantClient classname={user === "owner" ? "block" : "hidden"} searchParams={{ message: '' }} /> */}
            <DecideAside />
          </div>
          <div className='sm:px-[5rem] md:px-[8rem] lg:px-[10rem] pt-[4rem] xl:p-0 xl:flex-5 xl:w-1/2'>
            <FormHeader classname='xl:text-5xl 2xl:text-6xl' textClass='text-custom-green' title="Settings" />
            <div className='pt-10 block md:translate-x-20 lg:translate-x-0 place-items-center'>
              <div className='pb-10'>
                <Link href="/profile/change-email"><SettingBtn className='cursor-not-allowed' src={bacon} alt="image of bacon">Change Email</SettingBtn></Link>
              </div>
              <div className='pb-10'>
                <Link href="/profile/change-password"><SettingBtn className='cursor-not-allowed' src={pear} alt="image of a pear">Change Password</SettingBtn></Link>
              </div>
              <div className='pb-10'>
                <Link href="/profile/dashboard"><SettingBtn className='cursor-not-allowed' src={bread} alt="image of bread">Dashboard</SettingBtn></Link>
              </div>
              <div className='pb-10'>
                <Link href="/profile/terms-services"><SettingBtn className='cursor-not-allowed' src={egg} alt="image of a boiled egg">Terms & Policies</SettingBtn></Link>
              </div>
            </div>

            {/* <div className='pb-10'>
              <SettingBtn className='' src={egg} alt="image of boiled egg cut open">Change Email</SettingBtn>
            </div> */}
          </div>
        </div>
      </div>
      <FooterLayout />
    </>
  )
}

export default page
