'use client';
import React, { useState, useEffect, ChangeEvent, useCallback } from 'react';
import Input from '../forms/Input';
import { fetchUserProfile } from './userProfile';
import Form from '../forms/Form';
import { updateProfile } from './updateProfile';
import FormSubmitBtn from '../forms/FormSubmitBtn';
import FormHeader from '../forms/FormHeader';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import checkUsername from './checkUsername';

export default function PersonalFormClient({ searchParams }: { searchParams: { message: string } }) {
    const router = useRouter();
    const pathname = usePathname();

    const [username, setUsername] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [address, setAddress] = useState<string>("");
    const [phone, setPhone] = useState<string>("");
    const [dob, setDob] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);
    const [done, setDone] = useState<boolean>(false);
    const [warning, setWarning] = useState<boolean>(false)
    const [danger, setDanger] = useState<boolean>(false)
    const [userNameResult, setUserNameResult] = useState<any>(false);


    const [userNameErr, setUserNameErr] = useState<boolean>(false);
    const [userNameErrTxt, setUserNameErrTxt] = useState<string>("");
    const [addressErr, setAddressErr] = useState<boolean>(false);
    const [addressErrTxt, setAddressErrTxt] = useState<string>("");

    const usernameChange = (event: ChangeEvent<HTMLInputElement>) => {
        setUsername(event.target.value);
    };

    const userNameBlur = () => {
        // Replace multiple spaces with a single space and trim
        const trimmedUsername = username.replace(/\s+/g, ' ').trim();
        setUsername(trimmedUsername);
    };

    const addressChange = (event: ChangeEvent<HTMLInputElement>) => {
        setAddress(event.target.value);
    };

    const addressBlur = () => {
        // Replace multiple spaces with a single space and trim
        const trimmedAddress = address.replace(/\s+/g, ' ').trim();
        setAddress(trimmedAddress);
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

    const dobChange = (event: ChangeEvent<HTMLInputElement>) => {
        setDob(event.target.value);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userProfile = await fetchUserProfile();
                if (userProfile && userProfile[0]) {
                    setUsername(userProfile[0].username);
                    setEmail(userProfile[0].email);
                    setAddress(userProfile[0].address);
                    setPhone(userProfile[0].phone);
                    setDob(userProfile[0].dob);
                }
            } catch (error) {
                console.error('Error fetching user profile:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const submitForm = useCallback(async (formData: FormData) => {
        let isValid = true;

        // Check username validity
        const usernameCheck = await checkUsername(username);
        setUserNameResult(usernameCheck);

        // if the length is too long or too short
        if (isValid && username.length > 12 || username.length < 3) {
            setDanger(true);
            setUserNameErr(true);
            setUserNameErrTxt("Your username must be between 3 and 12 characters");
            isValid = false;
        }

        // if username is taken (meaning username result is true)
        if (userNameResult) {
            setUserNameErr(true);
            setUserNameErrTxt("This username has been taken.");
            isValid = false;
        }

        // if the address length is too long or too short
        if (address.length < 5 || address.length > 35) {
            setAddressErr(true);
            setAddressErrTxt("Must be between 5 and 35 characters");
            isValid = false;
        }

        if (!isValid) return;

        if (isValid && !userNameResult) {
            try {
                await updateProfile(formData);
                setWarning(false);
                setDanger(false);
                setDone(true);
                setTimeout(() => {
                    window.location.reload();
                }, 700);
            } catch (error) {
                console.error('Failed to update profile:', error);
                setWarning(true);
            }
        }
    }, [username, address, pathname, router]);

    return (
        <div>
            <div>
                {loading ? <Skeleton className='h-[5rem]' /> : <FormHeader classname='xl:text-5xl 2xl:text-6xl' textClass='text-custom-green' title="Personal Information" />}
                <Form method='GET' className=''>
                    <div className="">
                        <div className='pt-6'>
                            {loading ? <Skeleton className='h-[2rem]' /> : <Input
                                divClass="pt-6"
                                type='text'
                                name='Username'
                                typeInfo='username'
                                value={username}
                                onChange={usernameChange}
                                placeholder='Enter a username here'
                                onBlur={userNameBlur}
                                className={userNameErr ? 'w-full block sm:w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-red-600 ring-inset placeholder:text-gray-400 outline-red-600 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 pl-3' : ""}
                            />}
                            {userNameErr && <p className='text-red-600'>{userNameErrTxt}</p>}
                        </div>
                        <div className='pt-6'>
                            {loading ? <Skeleton className='h-[2rem]' /> : <Input
                                name='Address'
                                type="text"
                                typeInfo='address'
                                value={address}
                                onChange={addressChange}
                                placeholder='Enter your address here'
                                required={false}
                                onBlur={addressBlur}
                                className={addressErr ? 'block w-3/4 sm:w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-red-600 ring-inset placeholder:text-gray-400 outline-red-600 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 pl-3' : ""}
                            />}
                            {addressErr && <p className="text-red-600 text-left">{addressErrTxt}</p>}
                        </div>
                        <div className='pt-6'>
                            {loading ? <Skeleton className='h-[2rem]' /> : <Input
                                name='Email'
                                type="email"
                                typeInfo='email'
                                value={email}
                                readonly
                            />}
                        </div>
                        <div className='pt-6'>
                            {loading ? <Skeleton className='h-[2rem]' /> : <Input
                                name='Phone Number'
                                type="tel"
                                typeInfo='phone'
                                value={phone}
                                placeholder='(123) 456-7890'
                                required={false}
                                onChange={phoneChange}
                            />}
                        </div>
                        <div className='pt-6 pb-[2rem]'>
                            {loading ? <Skeleton className='h-[2rem]' /> : <Input
                                name='Date Of Birth'
                                type="date"
                                typeInfo='date'
                                value={dob}
                                placeholder='Enter your date of birth here'
                                onChange={dobChange}
                                required={false}
                            />}
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
                    </div>
                </Form>
            </div>
        </div>
    );
}
