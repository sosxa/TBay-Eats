
import React from 'react'
import NavbarLaptop from './headerComponents/NavbarLaptop'
import NavbarMobile from './headerComponents/NavbarMobile'
import SearchBtn from './headerComponents/SearchBtn'

const Header = () => {

    return (

        // <div className='w-auto z-auto bg-custom-green mb-[5rem]'>
        //     <div className='justify-center'>
        <>
            <NavbarLaptop className='hidden lg:inline lg:mt-10' />
            <NavbarMobile className='lg:hidden' />
        </>
        //  </div>
        // </div>

    )
}

export default Header
