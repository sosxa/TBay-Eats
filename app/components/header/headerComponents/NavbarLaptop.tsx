// 'use server';
// import React from 'react'
// import { createClient } from "@/utils/supabase/server";




// interface NavBarLaptopProps {
//     className?: string
// }

// const NavbarLaptop: React.FC<NavBarLaptopProps> = async ({ className }) => {

//     // this will be the href depending if the active session is true or not
//     const supabase = createClient();

//     const { data: user } = await supabase.auth.getUser();
//     // console.log(user.user)

//     const {
//         data: { session },
//     } = await supabase.auth.getSession();


//     // fetching the user table data and pulling their username 
//     const { data: profile, error } = await supabase
//         .from('profile')
//         .select('user');
//     // throwing error if there is one 
//     if (error) {
//         throw error;
//     }
//     const userType = profile[0]?.user;



//     return (
//         <div className={className}>
//             <div className='pt-8 bg-custom-green z-50'>
//                 <div className='flex justify-center items-center justify-space pb-6 text-white'>
//                     <h4 className='flex mr-20 font-bold text-2xl text-white'><a href='/'>TBayEAT</a></h4>
//                     <ul className='flex gap-12 text-lg'>
//                         <li>
//                             <a href='/'>Home</a>
//                         </li>
//                         <li>
//                             <a href='/about'>About</a>
//                         </li>
//                         <li>
//                             <a href='/menu'>Menu</a>
//                         </li>
//                         <li>
//                             <a href='/contact'>Contact</a>
//                         </li>
//                         {/* 
//                         since user.user iterates through user
//                             - when there is no user it returns null 
//                                 - when null it will display Sign In 
//                         when there is a user 
//                             - user.user returns a ton of subarrays with data 
//                                 - so when user is not null it will mean the array is full and it will display signout
//                         */}
//                         <li className={user && user.user ? 'block' : 'hidden'}>
//                             {/* If user is authenticated, display Profile link */}
//                             <a href='/profile'>Profile</a>
//                         </li>
//                         <li className={user && user.user ? 'block' : 'hidden'}>
//                             {/* If user is authenticated, display "Sign Out" link */}
//                             <a href='/signout'>Sign Out</a>
//                         </li>
//                         <li className={!user || !user.user ? 'block' : 'hidden'}>
//                             {/* If user is not authenticated, display "Sign In" link */}
//                             <a href='/login'>Sign In</a>
//                         </li>
//                         <li>
//                             <button>Cart</button>
//                         </li>

//                     </ul>
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default NavbarLaptop
'use client';
import React, { useState, useEffect } from 'react';
import fetchUserType from './fetchUserType';

interface NavBarLaptopProps {
    className?: string;
    onCartClick: () => void;
}

const NavbarLaptop: React.FC<NavBarLaptopProps> = ({ className, onCartClick }) => {
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
<button className='' onClick={onCartClick}>Cart</button>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default NavbarLaptop;
