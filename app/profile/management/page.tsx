'use server';
import React, { Suspense, lazy } from 'react';
import FooterLayout from '@/app/components/footerLayouts/FooterLayout';
import Header from '../../components/header/Header';
import ImageUploader from '@/app/components/profileImgComponent/profileClient';
import DecideClient from '@/app/components/sectionComponent/DecideClient';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation'

// Dynamically import components
const ComboClient = lazy(() => import('./ComboClient'));
const TestDouble = lazy(() => import('./TestDouble'));
const SingleProductLayout = lazy(() => import('./SingleProductLayout'));
const ComboProductLayout = lazy(() => import('./ComboProductLayout'));

const Page = async () => {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) {
      redirect("/login");
  }
  return (
    <div>
      <Header />
      <div className='pt-[7rem]'>
        <ImageUploader />
      </div>
      <DecideClient />

      {/* Flex container for side-by-side layout */}
      <div className='flex flex-col lg:flex-row justify-center gap-4 lg:gap-8 xl:gap-12 2xl:gap-16 lg:mx-6 xl:mx-[4rem] 2xl:mx-[6rem]'>
        {/* Left column */}
        <div className='w-full lg:w-1/2 2xl:w-40%'>
          <Suspense fallback={<div>Loading Single Product Layout...</div>}>
            <SingleProductLayout />
          </Suspense>
          <Suspense fallback={<div>Loading Test Double...</div>}>
            <TestDouble />
          </Suspense>
        </div>
        {/* Right column */}
        <div className='w-full lg:w-1/2 2xl:w-40%'>
          <Suspense fallback={<div>Loading Combo Product Layout...</div>}>
            <ComboProductLayout />
          </Suspense>
          <Suspense fallback={<div>Loading Combo Client...</div>}>
            <ComboClient />
          </Suspense>
        </div>
      </div>

      <FooterLayout />
    </div>
  );
};

export default Page;
