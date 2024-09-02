'use client';
import React, { useState, useEffect } from 'react';
import fetchUserType from './fetchUserType';

interface NavBarLaptopProps {
    className?: string;
    onCartClick: () => void;
}

const NavbarLaptop: React.FC<NavBarLaptopProps> = ({ className, onCartClick }) => {
    const [userType, setUserType] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true); // Add loading state

    useEffect(() => {
        const getUserType = async () => {
            setLoading(true); // Start loading
            try {
                const zz = await fetchUserType();
                setUserType(zz ?? null); // Set userType or null
            } catch (error) {
                console.error('Failed to fetch user type', error);
                setUserType(null); // Ensure userType is null if there's an error
            } finally {
                setLoading(false); // End loading
            }
        };

        getUserType(); // Fetch user type
    }, []);

    if (loading) {
        return <div></div>; // Render loading indicator or null
    }

    return (
        <div className={className}>
            <div className='pt-8 bg-custom-green z-50'>
                <div className='flex justify-center items-center justify-space pb-6 text-white'>
                    <h4 className='flex mr-20 font-bold text-2xl text-white'>
                        <a href='/'>TBayEAT</a>
                    </h4>
                    <ul className='flex gap-12 text-lg'>
                        <li>
                            <a href='/'>Home</a>
                        </li>
                        <li>
                            <a href='/about'>About</a>
                        </li>
                        <li>
                            <a href='/restaurant'>Restaurants</a>
                        </li>
                        <li>
                            <a href='/contact'>Contact</a>
                        </li>
                        <li className={userType ? 'block' : 'hidden'}>
                            <a href='/profile'>Profile</a>
                        </li>
                        <li className={userType ? 'block' : 'hidden'}>
                            <a href='/signout'>Sign Out</a>
                        </li>
                        <li className={!userType ? 'block' : 'hidden'}>
                            <a href='/login'>Sign In</a>
                        </li>
                        <li>
                            <button className='' onClick={onCartClick}>Cart</button>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default NavbarLaptop;
