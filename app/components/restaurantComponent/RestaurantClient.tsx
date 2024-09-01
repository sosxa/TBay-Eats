'use client';
import React, { useState, ChangeEvent, useCallback, useMemo } from 'react';
import { useEffect } from 'react';
import Input from '../forms/Input';
import Form from '../forms/Form';
import FormSubmitBtn from '../forms/FormSubmitBtn';
import FormHeader from '../forms/FormHeader';
import { fetchUserRestaurant } from './restaurantData';
import { updateRestaurant } from "./updateRestaurant";
import yourrest from "../../yourrest.png";
import Image from 'next/image';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { usePathname, useRouter } from 'next/navigation';
import checkingResturantName from './checkingRestaurantName';



interface RestaurantClientProps {
    classname?: string;
    searchParams?: { message: string };
}

const RestaurantClient = ({ classname, searchParams }: RestaurantClientProps) => {
    const pathname = usePathname();
    const router = useRouter();

    const [name, setName] = useState<string>("");
    const [address, setAddress] = useState<string>("");
    const [phone, setPhone] = useState<string>("");
    const [hours, setHours] = useState<string>("");
    const [joinedDate, setJoinedDate] = useState<string>("");
    const [loading, setLoading] = useState(true);
    const [warning, setWarning] = useState<boolean>(false)
    const [danger, setDanger] = useState<boolean>(false)
    const [done, setDone] = useState<boolean>(false);

    const [nameErr, setNameErr] = useState<boolean>(false);
    const [addressErr, setAddressErr] = useState<boolean>(false);
    const [nameErrTxt, setNameErrTxt] = useState<string | null>("");
    const [addressErrTxt, setAddressErrTxt] = useState<string | null>("");
    

    const usernameChange = (event: ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value);
    };

    const addressChange = (event: ChangeEvent<HTMLInputElement>) => {
        setAddress(event.target.value);
    };

    const phoneChange = (event: ChangeEvent<HTMLInputElement>) => {
        let input = event.target.value.replace(/\D/g, '');
        if (input.length >= 3 && input.length <= 6) {
            input = `(${input.slice(0, 3)}) ${input.slice(3)}`;
        } else if (input.length >= 7) {
            input = `(${input.slice(0, 3)}) ${input.slice(3, 6)}-${input.slice(6, 10)}`;
        }
        setPhone(input);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const restaurantProfile = await fetchUserRestaurant();
                if (restaurantProfile && restaurantProfile[0]) {
                    setName(restaurantProfile[0].restaurant_name);
                    setAddress(restaurantProfile[0].restaurant_address);
                    setPhone(restaurantProfile[0].restaurant_number);
                    setJoinedDate(restaurantProfile[0].created_at);
                }
            } catch (error) {
                console.error('Error fetching user profile:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);
    const [resturantCheck, setResturantCheck] = useState<boolean>(false);

    const submitForm = useCallback(async (formData: FormData) => {
        try {
            let isValid = true;
    
            // Check restaurant name availability
            const resturantName = await checkingResturantName(name);
    
            if (resturantName !== null && resturantName !== undefined) {
                setResturantCheck(resturantName);
            } else {
                // Restaurant name not found
                setResturantCheck(false); // Ensure resturantCheck is explicitly set to false
            }
    
            // Check if restaurant name is taken
            if (resturantCheck && isValid) {
                setNameErr(true);
                setNameErrTxt("This restaurant username has been taken.");
                isValid = false;
            }
    
            // Validate name length
            if (name.length > 12 || name.length < 3) {
                setDanger(true);
                setNameErr(true);
                setNameErrTxt("Your restaurant username must be between 3 and 12 characters");
                isValid = false;
            }
    
            // Validate address length
            if (address.length < 5 || address.length > 35) {
                setAddressErr(true);
                setAddressErrTxt("Must be between 5 and 35 characters");
                isValid = false;
            }
    
            if (!isValid) return;
    
            // If all validations pass and restaurant name is not taken, proceed to update
            if (isValid && !resturantCheck) {
                setWarning(false);
                setDanger(false);
                setNameErr(false);
                setAddressErr(false);
                updateRestaurant(formData);
                setDone(true);
                setTimeout(() => {
                    window.location.reload();
                }, 700);
            }
        } catch (error) {
            console.error('Error occurred:', error);
        }
    }, [name, address, resturantCheck, updateRestaurant]); // Ensure dependencies are properly included
    


    return (
        < div className={`{classname}`}>
            {loading ? <Skeleton className='h-[5rem]' /> : <FormHeader classname='xl:text-5xl 2xl:text-6xl' textClass='text-custom-green' title="Your Restaurant" />}
            {loading ? <Skeleton className='h-[7rem]' /> : (
                <Image
                    width={800}
                    height={300}
                    src={yourrest}
                    alt='banner that has chips, dip, leaves, and a green background'
                    // className='w-[80%] translate-x-10 translate-y-2 sm:translate-y-0 sm:translate-x-0 sm:w-full h-[10rem] object-cover'
                    className='w-[80%] sm:w-full h-[10rem] object-cover'
                />
            )}
            <Form method='GET' className={''}>
                <div className='pt-3 w-full'>
                    {loading ? <Skeleton className='h-[2rem]' /> : (
                        <Input
                            divClass="pt-6"
                            type='text'
                            name='Restaurant Name'
                            typeInfo='restaurant_name'
                            value={name}
                            onChange={usernameChange}
                            placeholder='Enter a username here'
                            required={false}
                            className={nameErr ? 'block w-3/4 sm:w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-red-600 ring-inset placeholder:text-gray-400 outline-red-600 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 pl-3' : ""}
                        />
                    )}
                    {nameErr && (<h1 className='text-red-600 text-left'>{nameErrTxt}</h1>)}
                </div>
                <div className='pt-3'>
                    {loading ? <Skeleton className='h-[2rem]' /> : (
                        <Input
                            name='Address'
                            type="text"
                            typeInfo='restaurant_address'
                            value={address}
                            onChange={addressChange}
                            placeholder='Enter your address here'
                            required={false}
                            className={addressErr ? 'block w-3/4 sm:w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-red-600 ring-inset placeholder:text-gray-400 outline-red-600 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 pl-3' : ""}
                        />
                    )}
                    {addressErr && (<h1 className='text-red-600 text-left'>{addressErrTxt}</h1>)}
                </div>
                <div className='pt-3'>
                    {loading ? <Skeleton className='h-[2rem]' /> : (
                        <Input
                            name='Phone Number'
                            type="text"
                            typeInfo='restaurant_number'
                            value={phone}
                            placeholder='(123) 456-7890'
                            onChange={phoneChange}
                            required={false}
                        />
                    )}
                </div>
                <div className='pt-3 pb-[3rem]'>
                    {loading ? <Skeleton className='h-[2rem]' /> : (
                        <Input
                            name='Joined Date'
                            type="date"
                            typeInfo='date'
                            value={joinedDate}
                            required={false}
                            readonly
                        />
                    )}
                </div>
                {done && (
                    <div className='pb-3 px-3 sm:px-0'>
                        <div className="bg-green-50 border-t-2 border-green-500 rounded-lg p-4" role="alert">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <span className="inline-flex justify-center items-center size-8 rounded-full border-4 border-green-100 bg-green-200 text-green-800">
                                        <svg className="flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                            <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                                            <path d="m9 12 2 2 4-4"></path>
                                        </svg>
                                    </span>
                                </div>
                                <div className="ms-3">
                                    <h3 className="text-gray-800 font-semibold text-left">
                                        Successfully updated.
                                    </h3>
                                    <p className="text-sm text-gray-700 text-left">
                                        You have successfully updated your profile.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {danger && (
                    <div className='pb-3 px-3 sm:px-0'>
                        <div className="bg-red-200 border-s-4 border-red-600 p-4" role="alert">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <span className="inline-flex justify-center items-center size-8 rounded-full border-4 border-red-100 bg-red-500 text-red-800">
                                        <svg className="flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                            <path d="M18 6 6 18"></path>
                                            <path d="m6 6 12 12"></path>
                                        </svg>
                                    </span>
                                </div>
                                <div className="ms-3">
                                    <h3 className="text-gray-800 font-semibold text-left">
                                        Error!
                                    </h3>
                                    <p className="text-sm text-gray-700 text-left">
                                        Your changes haven't been published, check what you've entered.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {warning && (
                    <div className='pb-3 px-3 sm:px-0'>
                        <div className="bg-yellow-50 border border-yellow-200 text-sm text-yellow-800 rounded-lg p-4" role="alert">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="flex-shrink-0 size-4 mt-0.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
                                        <path d="M12 9v4"></path>
                                        <path d="M12 17h.01"></path>
                                    </svg>
                                </div>
                                <div className="ms-4">
                                    <h3 className="text-sm font-semibold text-left">
                                        Cannot connect to the database
                                    </h3>
                                    <div className="mt-1 text-sm text-yellow-700 text-left">
                                        We are unable to save any progress at this time.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {loading ? <Skeleton className='h-[2rem]' /> : <FormSubmitBtn formAction={submitForm} pendingText='Verifying Changes...'>Update</FormSubmitBtn>}
                {searchParams?.message && (
                    <p className="mt-4 p-4 bg-foreground-10 text-foreground text-center text-black">
                        {searchParams.message}
                    </p>
                )}
            </Form>
        </div>
    );
};

export default RestaurantClient;
