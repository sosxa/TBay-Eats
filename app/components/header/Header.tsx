
import React from 'react'
import NavbarLaptop from './headerComponents/NavbarLaptop'
import NavbarMobile from './headerComponents/NavbarMobile'
import SearchBtn from './headerComponents/SearchBtn'

const Header = () => {
    const toggleSidebar = () => {
        return;
    }
    return (

        // <div className='w-auto z-auto bg-custom-green mb-[5rem]'>
        //     <div className='justify-center'>
        <>
            <NavbarLaptop className='hidden lg:inline lg:mt-10' onCartClick={toggleSidebar} />
            <NavbarMobile className='lg:hidden' />
        </>
        //  </div>
        // </div>

    )
}

export default Header
