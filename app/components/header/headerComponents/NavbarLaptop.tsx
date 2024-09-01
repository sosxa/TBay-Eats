'use client';
import React, { useState, useEffect } from 'react';
import fetchUserType from './fetchUserType';

interface NavBarLaptopProps {
    className?: string;
}

const NavbarLaptop: React.FC<NavBarLaptopProps> = ({ className }) => {
    const [userType, setUserType] = useState<any>("");

    useEffect(() => {
        const getUserType = async () => {
            const zz = await fetchUserType();
            if (zz !== undefined || zz !== null) {
                setUserType(zz);
                return;
            }
            if (zz === null || zz === undefined) {
                setUserType(null)
                return;
            }
        };

        getUserType(); // Added missing call to getUserType()
    }, []);


    return (
        <div className={className}>
            <div className='pt-8 bg-custom-green z-50'>
                <div className='flex justify-center items-center justify-space pb-6 text-white'>
                    <h4 className='flex mr-20 font-bold text-2xl text-white'><a href='/'>TBayEAT</a></h4>
                    <ul className='flex gap-12 text-lg'>
                        <li>
                            <a href='/'>Home</a>
                        </li>
                        <li>
                            <a href='/about'>About</a>
                        </li>
                        <li>
                            <a href='/menu'>Menu</a>
                        </li>
                        <li>
                            <a href='/contact'>Contact</a>
                        </li>
                        <li className={userType !== null ? 'block' : 'hidden'}>
                            <a href='/profile'>Profile</a>
                        </li>
                        <li className={userType !== null ? 'block' : 'hidden'}>
                            <a href='/signout'>Sign Out</a>
                        </li>
                        <li className={userType === null ? 'block' : 'hidden'}>
                            <a href='/login'>Sign In</a>
                        </li>
                        <li>
                            <button className=''>Cart</button>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default NavbarLaptop;
