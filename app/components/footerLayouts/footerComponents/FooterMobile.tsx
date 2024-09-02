'use client';
import React, { useState } from 'react'

interface FooterMobileProps {
    className?: string,
    user: any,
}

const FooterMobile: React.FC<FooterMobileProps> = ({ className, user }) => {
    return (
        <footer className={className}>
            <div className="w-lvh h-[20%] bg-custom-green mt-4 justify-around bottom-0 sticky">
                <div className='w-[80%] h-full block justify-center mx-auto'>
                    <ul className='w-full block gap-7 '>
                        <li className='py-6 px-4'>
                            <h3 className='text-white text-2xl font-bold font-sans'><a href='/'>TBayEAT</a></h3>
                        </li>
                        <li className='pb-6 px-4'>
                            <a className='text-white font-sans text-xl' href="/">Home</a>
                        </li>
                        <li className='pb-6 px-4'>
                            <a className='text-white font-sans text-xl' href="/about">About</a>
                        </li>
                        <li className='pb-6 px-4'>
                            <a className='text-white font-sans text-xl' href="/restaurant">Restaurants</a>
                        </li>
                        <li className='pb-6 px-4'>
                            <a className='text-white font-sans text-xl' href="/contact">Contact</a>
                        </li>
                        <li className='pb-6 px-4'>
                            <a className='text-white font-sans text-xl' href="/profile">Profile</a>
                        </li>
                        <li className={!user ? 'pb-6 px-4' : "hidden"}>
                            <a className='text-white font-sans text-xl' href="/login">Sign In</a>
                        </li>
                        <li className={user ? 'pb-6 px-4' : 'hidden'}>
                            <a className='text-white font-sans text-xl' href="/profile">Profile</a>
                        </li>
                        <li className={user ? 'pb-6 px-4' : "hidden"}>
                            <a className='text-white font-sans text-xl' href="/signout">Sign Out</a>
                        </li>
                        <li className='pb-6 px-4'>
                            <p className='text-white pb-2'> Copyright &#169; 2024 TBayEats</p>

                        </li>

                    </ul>
                </div>
            </div>

        </footer>






    )
}

export default FooterMobile



