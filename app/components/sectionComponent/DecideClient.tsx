'use client';
import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import fetchUser from '@/app/profile/profileFunctions/fetchUser';
import OwnerClient from './OwnerClient';
import ConsumerClient from './ConsumerClient';
import Skeleton from 'react-loading-skeleton';

const DecideClient = () => {
    const [userType, setUserType] = useState(""); // State to hold user type
    const [loading, setLoading] = useState(true); // State to track loading status

    useEffect(() => {
        // Fetch user data when component mounts
        const getUserType = async () => {
            try {
                const user = await fetchUser(); // Fetch user data using fetchUser function
                if (user) {
                    setUserType(user);
                }
            } catch (error) {
                console.error('Error fetching user type:', error);
            } finally {
                setLoading(false); // Set loading to false once data is fetched
            }
        };

        getUserType(); // Call the function to fetch user type
    }, []); // Empty dependency array ensures this effect runs only once when the component mounts

    return (
        <div>
            {/* Render loading indicator if data is still being fetched */}
            {loading && (
                <div className='pb-[10rem]' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} 
                >
                    
                        <Skeleton width={250} height={50} className='rounded-2xl'/>

                </div>
            )}

            {/* Render UI based on user type */}
            {!loading && userType === "owner" && <OwnerClient loading={loading} />}
            {!loading && userType === "customer" && <ConsumerClient loading={loading} />}
        </div>
    );
};

export default DecideClient;
