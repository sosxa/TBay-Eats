'use client';

import React from 'react';

interface FooterProps {
    className?: string,
    user: any,
}

const FooterLaptop: React.FC<FooterProps> = ({ className, user }) => {

    return (
        <footer className={className}>
            <div className="w-lvh h-[100%] bg-custom-green mt-4 justify-around bottom-0 sticky">
                <div className='w-[80%] h-full flex justify-center mx-auto'>
                    <div className='flex mx-auto'>
                        <h3 className='text-white text-2xl p-8 font-bold font-sans'>
                            <a href='/'>TBayEAT</a>
                        </h3>
                    </div>
                    <ul className='w-full flex justify-center gap-11'>
                        <li className='pt-8 pb-8'>
                            <a className='text-white font-sans text-xl' href="/">Home</a>
                        </li>
                        <li className='pt-8 pb-8'>
                            <a className='text-white font-sans text-xl' href="/about">About</a>
                        </li>
                        <li className='pt-8 pb-8'>
                            <a className='text-white font-sans text-xl' href="/menu">Menu</a>
                        </li>
                        <li className='pt-8 pb-8'>
                            <a className='text-white font-sans text-xl' href="/contact">Contact</a>
                        </li>
                        <li className={!user ? 'pt-8 pb-8' : "hidden"}>
                            <a className='text-white font-sans text-xl' href="/login">Sign In</a>
                        </li>
                        <li className={user ? 'pt-8 pb-8' : 'hidden'}>
                            <a className='text-white font-sans text-xl' href="/profile">Profile</a>
                        </li>
                        <li className={user ? 'pt-8 pb-8' : "hidden"}>
                            <a className='text-white font-sans text-xl' href="/sign-out">Sign Out</a>
                        </li>
                    </ul>
                </div>
                <hr className='w-[80%] h-1 mx-auto mb-6 bg-white border-0 rounded' />
                <div className='flex justify-center pb-6'>
                    <p className='text-white'> Copyright &#169; 2024 TBayEats</p>
                </div>
            </div>
        </footer>
    );
}

export default FooterLaptop;
