'use server';
import React, { Suspense, lazy } from 'react';
import Header from '../components/header/Header';
import FooterLayout from '../components/footerLayouts/FooterLayout';
import DecideClient from '../components/sectionComponent/DecideClient';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation'

// Dynamically import components if they are large or async
const PersonalFormClient = lazy(() => import('../components/profileComponents/PersonalFormClient'));
const ImageUploader = lazy(() => import('../components/profileImgComponent/profileClient'));
const DecideAside = lazy(() => import('./aside/DecideAside'));

const Page = async () => {

    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
        redirect("/login")
    }
    return (
        <>
            <div className='mb-20'>
                <Header />
            </div>
            <div className='pt-[2rem]'>
                <Suspense fallback={<div>Loading Image Uploader...</div>}>
                    <ImageUploader />
                </Suspense>
            </div>
            <div className='-translate-y-5 xl:translate-y-[2rem]'>
                <DecideClient />
                <div className='w-full xl:flex xl:px-[8rem] xl:gap-[10rem] 2xl:-px-[1rem]'>
                    <div className='xl:w-1/2 xl:flex-1 2xl:pr-[5rem] sm:px-[5rem] md:px-[8rem] lg:px-[10rem] xl:px-0 pb-5'>
                        <center>
                            <Suspense fallback={<div>Loading Decide Aside...</div>}>
                                <DecideAside />
                            </Suspense>
                        </center>
                    </div>
                    <div className='sm:px-[5rem] md:px-[8rem] lg:px-[10rem] pt-[4rem] xl:p-0 xl:flex-initial xl:w-1/2'>
                        <center>
                            <Suspense fallback={<div>Loading Personal Form Client...</div>}>
                                <PersonalFormClient searchParams={{ message: '' }} />
                            </Suspense>
                        </center>
                    </div>
                </div>
            </div>

            <FooterLayout />
        </>
    );
}

export default Page;
