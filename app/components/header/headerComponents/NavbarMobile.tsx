'use client';
import React, { useState, useEffect } from 'react';
import hamburger from '../../../hamburger.png';
import Image from 'next/image';
import GetUser from './GetUser';

interface NavbarMobileProps {
    className?: string;
}

const NavbarMobile: React.FC<NavbarMobileProps> = ({ className }) => {
    const [dropDown, setDropDown] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userData = await GetUser();
                setUser(userData.user);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching user data:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleBurger = () => {
        setDropDown(!dropDown);
    };

    return (
        <div className={className}>
            <div className='pt-8 bg-custom-green z-50'>
                <div className='flex justify-center items-center pb-6 text-white'>
                    <div className='md:gap-[20rem] flex'>
                        <h4 className='block mr-20 font-bold text-2xl text-white'>
                            <a href='/'>TBayEAT</a>
                        </h4>
                        <Image
                            alt=''
                            src={hamburger}
                            width={35}
                            height={35}
                            className={dropDown ? 'rotate-90 transition-transform duration-500 ease-in' : 'rotate-180 transition-transform duration-500 ease-in'}
                            onClick={handleBurger}
                        />
                    </div>
                </div>
                {dropDown && !loading && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-40 transition-opacity duration-500 ease-in-out">
                        <div className="bg-white p-6 rounded shadow-lg z-50 w-1/2 transition-transform duration-500 ease-in-out transform translate-y-0">
                            <ul className='flex flex-col items-center gap-4 text-lg text-black'>
                                <li className='w-full'>
                                    <a href='/' className='block text-center hover:bg-gray-200 rounded'>Home</a>
                                </li>
                                <li className='w-full'>
                                    <a href='/about' className='block text-center hover:bg-gray-200 rounded'>About</a>
                                </li>
                                <li className='w-full'>
                                    <a href='/restaurant' className='block text-center hover:bg-gray-200 rounded'>Restaurants</a>
                                </li>
                                <li className='w-full'>
                                    <a href='/contact' className='block text-center hover:bg-gray-200 rounded'>Contact</a>
                                </li>
                                <li className={`w-full ${user ? 'block' : 'hidden'}`}>
                                    <a href='/profile' className='block text-center hover:bg-gray-200 rounded'>Profile</a>
                                </li>
                                <li className={`w-full ${user ? 'block' : 'hidden'}`}>
                                    <a href='/signout' className='block text-center hover:bg-gray-200 rounded'>Sign Out</a>
                                </li>
                                <li className={`w-full ${!user ? 'block' : 'hidden'}`}>
                                    <a href='/login' className='block text-center hover:bg-gray-200 rounded'>Sign In</a>
                                </li>
                            </ul>
                            <div className="flex justify-center mt-4">
                                <button onClick={handleBurger} className="px-4 py-2 bg-custom-green text-white rounded">Close</button>
                            </div>
                        </div>
                    </div>
                )}
                {dropDown && loading && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-40 transition-opacity duration-500 ease-in-out">
                        <div className="bg-white p-6 rounded shadow-lg z-50 w-1/2 transition-transform duration-500 ease-in-out transform translate-y-0">
                            <p>Loading...</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NavbarMobile;
