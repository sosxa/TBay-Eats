import React from 'react';

interface NavMenuProps {
    user: any;
    userType: string;
}

const NavMenu: React.FC<NavMenuProps> = ({ user, userType }) => {
    return (
        <ul className='flex flex-col items-center gap-4 text-lg mt-4 text-white'>
            <li className='w-full'>
                <a href='/' className='block py-1 text-center hover:bg-gray-200 rounded'>Home</a>
            </li>
            <li className='w-full'>
                <a href='/about' className='block py-1 text-center hover:bg-gray-200 rounded'>About</a>
            </li>
            <li className='w-full'>
                <a href='/menu' className='block py-1 text-center hover:bg-gray-200 rounded'>Menu</a>
            </li>
            <li className='w-full'>
                <a href='/contact' className='block py-1 text-center hover:bg-gray-200 rounded'>Contact</a>
            </li>
            <li className={`w-full ${user ? 'block' : 'hidden'}`}>
                <a href='/profile' className='block py-1 text-center hover:bg-gray-200 rounded'>Profile</a>
            </li>
            <li className={`w-full ${user ? 'block' : 'hidden'}`}>
                <a href='/signout' className='block py-1 text-center hover:bg-gray-200 rounded'>Sign Out</a>
            </li>
            <li className={`w-full ${!user ? 'block' : 'hidden'}`}>
                <a href='/login' className='block py-1 text-center hover:bg-gray-200 rounded'>Sign In</a>
            </li>
        </ul>
    );
};

export default NavMenu;
