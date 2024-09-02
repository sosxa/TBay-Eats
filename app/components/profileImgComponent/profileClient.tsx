'use client';
import React, { useState, useCallback, useEffect, useRef } from 'react';
import Image from 'next/image';
import defaultPfp from "../../deafult-pfp.jpeg"
import updateBanner from './updateBanner';
import updatePfp from './updatePfp';
import FormSubmitBtn from '../forms/FormSubmitBtn';
import Form from '../forms/Form';
import currentBanner from './currentBanner';
import currentPfp from './currentPfp';
import defaultBanner from '../../defaultBanner.png';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { redirect, usePathname, useRouter, useSearchParams } from 'next/navigation';


const ImageUploader = () => {
    const pathname = usePathname();
    const router = useRouter();

    const [newPfp, setNewPfp] = useState(false);
    const [newBanner, setNewBanner] = useState(false);

    const [pfpFile, setPfpFile] = useState<File | null>(null);
    const [bannerFile, setBannerFile] = useState<File | null>(null);

    const [ifDbPfp, setIfDbPfp] = useState<any>();
    const [ifDbBanner, setIfDbBanner] = useState<any>();

    const [pfpLoaded, setPfpLoaded] = useState(false);
    const [bannerLoaded, setBannerLoaded] = useState(false);
    const [loading, setLoading] = useState(true);

    const pfpLoadedRef = useRef(false);
    const bannerLoadedRef = useRef(false);

    const modalRef = useRef<HTMLDivElement>(null);

    function gettingPfp(event: React.ChangeEvent<HTMLInputElement>) {
        if (event.target.files) {
            return setPfpFile(event.target.files[0]);
        }
    }

    function gettingBanner(event: React.ChangeEvent<HTMLInputElement>) {
        if (event.target.files) {
            return setBannerFile(event.target.files[0]);
        }
    }

    const handlePfpUpload = useCallback((formData: FormData) => {
        if (!formData) return;
        const newPfp = updatePfp(formData);
        newPfp;
        redirect(pathname)
    }, []);

    const handleBannerUpload = useCallback((formData: FormData) => {
        if (!formData) return;
        const newBanner = updateBanner(formData);
        newBanner;
        redirect(pathname)
    }, []);

    useEffect(() => {
        const fetchCurrentPfp = async () => {
            try {
                const pfpData = await currentPfp();

                if (pfpData === null) {
                    setIfDbPfp(null)
                    setPfpLoaded(true)
                }


                if (pfpData) {
                    // const publicUrl = pfpData.publicUrl;
                    // if (publicUrl.includes('.placeholder')) {
                    //     setIfDbPfp(null);
                    // } else {
                    //     setIfDbPfp(publicUrl);
                    // }
                    setIfDbPfp(pfpData)
                    setPfpLoaded(true);
                }
            } catch (error) {
                console.error('Error fetching user profile:', error);
            }
        };

        if (!pfpLoadedRef.current) {
            fetchCurrentPfp();
            pfpLoadedRef.current = true;
        }
    }, []);


    useEffect(() => {
        const fetchCurrentBanner = async () => {
            try {
                const bannerData = await currentBanner();

                if (bannerData === null) {
                    setIfDbBanner(null)
                    setBannerLoaded(true)
                }

                if (bannerData) {
                    setIfDbBanner(bannerData)
                    setBannerLoaded(true);
                }
            } catch (error) {
                console.error('Error fetching user profile:', error);
            }
        };

        if (!bannerLoadedRef.current) {
            fetchCurrentBanner();
            bannerLoadedRef.current = true;
        }
    }, []);


    useEffect(() => {
        if (pfpLoaded && bannerLoaded) {
            setLoading(false);
        }
    }, [pfpLoaded, bannerLoaded]);

    const closeModal = (e: React.MouseEvent) => {
        if (modalRef.current && e.target === modalRef.current) {
            setNewBanner(false);
            setNewPfp(false);
            setPfpFile(null)
            setBannerFile(null)
        }
    };

    return (
        <>
            {loading ? (
                <>
                    <div className=''>
                        {loading && <Skeleton
                            className="xl:hidden w-full absolute -top-[7rem] left-0 z-0 h-[300px] xl:h-[400px]"
                        />}
                        <div className='absolute -translate-y-[11rem] translate-x-20'>
                            {loading && <Skeleton
                                width={275}
                                height={275}
                                circle
                                className="rounded-full h-[275px] sm:h-[275px] lg:h-[275px] xl:h-[315px] w-[200px] sm:w-[225px] lg:w-[240px] xl:w-[260px] md:-translate-x-10 xl:translate-x-0 border-4 border-solid border-white object-cover transition-opacity duration-200 ease-in-out md:-translate-y-20 -translate-y-10"
                            />}
                        </div>
                    </div>
                </>
            ) : (
                <>
                    <section className="relative pt-40 lg:pb-0 pb-[4rem]">
                        {ifDbBanner === null || ifDbBanner === undefined ? (
                            <div>
                                <Image
                                    src={defaultBanner}
                                    alt="cover-image"
                                    className="w-full absolute -top-[7rem] left-0 z-0 h-80 object-cover xl:h-[25rem] xl:mb-[3rem]"
                                    // gere
                                    onClick={() => setNewBanner(true)}
                                />
                            </div>
                        ) : (
                            <div className='pb-[10rem]'>
                                <img
                                    src={ifDbBanner}
                                    alt="cover-image"
                                    className="w-full absolute -top-[7rem] left-0 z-0 h-80 object-cover xl:h-[25rem]"
                                    onClick={() => setNewBanner(true)}
                                />
                            </div>
                        )}

                        <div className="w-full max-w-7xl mx-auto px-6 md:px-8 object-cover">
                            <div className="flex items-center justify-center sm:justify-start relative z-10 mb-5">
                                {ifDbPfp === null || ifDbPfp === undefined ? (
                                   <div className='absolute h-auto -translate-y-[3rem]'>
                                        <Image
                                            width={275}
                                            height={275}
                                            src={defaultPfp}
                                            alt="default profile picture"
                                            className="w-[275px] sm:w-[275px] lg:w-[275px] xl:w-[315px] h-[275px] sm:h-[275px] lg:h-[275px] xl:h-[315px] border-4 border-solid border-white rounded-full object-cover transition-opacity duration-200 ease-in-out md:-translate-y-20 -translate-y-10 xl:translate-y-[1.5rem] 2xl:translate-y-[1.3rem] 2xl:-translate-x-[7rem]"
                                            onClick={() => setNewPfp(true)}
                                        />
                                    </div>
                                ) : (
                                    <div className='absolute h-auto -translate-y-[3rem]'>
                                        <img
                                            src={ifDbPfp}
                                            width={275}
                                            height={275}
                                            className="w-[275px] sm:w-[275px] lg:w-[275px] xl:w-[315px] h-[275px] sm:h-[275px] lg:h-[275px] xl:h-[315px] border-4 border-solid border-white rounded-full object-cover transition-opacity duration-200 ease-in-out md:-translate-y-20 -translate-y-10 xl:translate-y-[1.5rem] 2xl:translate-y-[1.3rem] 2xl:-translate-x-[7rem]"
                                            alt="profile picture"
                                            onClick={() => setNewPfp(true)}
                                        />
                                    </div>
                                )}

                                {newPfp && (
                                    <div
                                        ref={modalRef}
                                        className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50"
                                        onClick={closeModal}
                                    >
                                        <div className="bg-white p-6 rounded-lg shadow-lg h-auto w-3/4 lg:w-1/2 xl:w-2/5">
                                            <div className=''>
                                                <h1 className='flex w-full justify-center items-center text-left align-left p-4 text-lg sm:text-xl xl:text-2xl font-semibold'>Change Profile Picture</h1>
                                                <hr className='pt-10 w-full border-gray-300' />
                                            </div>
                                            <div className='w-full justify-center align-middle items-center'>
                                                <Form className="" action={handlePfpUpload} method="GET">
                                                    <div className={pfpFile ? "hidden" : "flex justify-center items-center align-middle mb-4 lg:px-20"}>
                                                        <label
                                                            className="flex justify-center w-1/2 h-48 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none">
                                                            <span className="flex items-center space-x-2 w-full">
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24"
                                                                    stroke="currentColor" stroke-width="2">
                                                                    <path stroke-linecap="round" stroke-linejoin="round"
                                                                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                                                </svg>
                                                                <span className="font-medium text-gray-600 w-full">
                                                                    Drop files to Attach, or
                                                                    <span className="text-custom-green underline"> browse</span>
                                                                </span>
                                                            </span>
                                                            <input onChange={gettingPfp} type="file" accept="image/*" name="filePfp" className="hidden" />
                                                        </label>
                                                    </div>

                                                    {pfpFile && (
                                                        <div className='flex w-full items-center align-center justify-center'>
                                                            {/* <img src={URL.createObjectURL(pfpFile)} alt="Uploaded Image" className="w-1/2 h-full rounded-md object-cover" /> */}
                                                            <img src={URL.createObjectURL(pfpFile)} alt="Uploaded Image" className="w-[275px] sm:w-[275px] lg:w-[275px] xl:w-[315px] h-[275px] sm:h-[275px] lg:h-[275px] xl:h-[315px] border-4 border-solid border-white rounded-full object-cover transition-opacity duration-200 ease-in-out" />
                                                        </div>
                                                    )}

                                                    <div className='flex p-4 gap-4 w-full justify-center'>
                                                        <div className="justify-center align-center pt-[.10%]">
                                                            {/* <FormSubmitBtn className='w-full' pendingText="Verifying Changes..." >Update</FormSubmitBtn> */}
                                                            <button className='bg-custom-green text-white rounded-md py-2 border-l border-custom-green hover:bg-green-400 px-3'>
                                                                Update
                                                            </button>
                                                        </div>
                                                        {/* </Form> */}
                                                    </div>
                                                </Form>
                                            </div>
                                        </div>

                                    </div>

                                )}

                                {newBanner && (

                                    <div
                                        ref={modalRef}
                                        className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50"
                                        onClick={closeModal}
                                    >
                                        <div className="bg-white p-6 rounded-lg shadow-lg h-auto w-3/4 lg:w-1/2 xl:w-2/5">
                                            <div className=''>
                                                <h1 className='flex w-full justify-center items-center text-left align-left p-4 text-lg sm:text-xl xl:text-2xl font-semibold'>Change Profile Banner</h1>
                                                <hr className='pt-10 w-full border-gray-300' />
                                            </div>
                                            <Form className="" action={handleBannerUpload} method="GET">
                                                <div className="">
                                                    <div className={bannerFile ? "hidden" : "flex justify-center items-center align-middle mb-4 lg:px-20"}>
                                                        <label
                                                            className="flex justify-center w-full h-48 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none">
                                                            <span className="flex items-center space-x-2">
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24"
                                                                    stroke="currentColor" stroke-width="2">
                                                                    <path stroke-linecap="round" stroke-linejoin="round"
                                                                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                                                </svg>
                                                                <span className="font-medium text-gray-600">
                                                                    Drop files to Attach, or
                                                                    <span className="text-custom-green underline"> browse</span>
                                                                </span>
                                                            </span>
                                                            <input onChange={gettingBanner} type="file" accept="image/*" name="fileBanner" className="hidden" />
                                                        </label>
                                                    </div>
                                                </div>
                                                <div className="block justify-around text-center">
                                                    <div className="justify-center items-center h-full w-full">
                                                    </div>
                                                    {bannerFile && (
                                                        <div className='flex w-full items-center align-center justify-center'>
                                                            {/* <img src={URL.createObjectURL(pfpFile)} alt="Uploaded Image" className="w-1/2 h-full rounded-md object-cover" /> */}
                                                            <img src={URL.createObjectURL(bannerFile)} alt="Uploaded Image" className="flex justify-center w-full h-48 px-4 object-cover" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className='flex p-4 gap-4 w-full justify-center'>
                                                    <div className="justify-center align-center pt-[.10%]">
                                                        {/* <FormSubmitBtn className='w-full' pendingText="Verifying Changes..." >Update</FormSubmitBtn> */}
                                                        <button className='bg-custom-green text-white rounded-md py-2 border-l border-custom-green hover:bg-green-400 px-3'>
                                                            Update
                                                        </button>
                                                    </div>
                                                    {/* </Form> */}
                                                </div>
                                            </Form>
                                        </div> 
                                    </div>
                                )}
                            </div>
                        </div>
                    </section >
                </>
            )
            }
        </>
    );
};

export default ImageUploader;
