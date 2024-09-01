'use client';
import React, { useEffect, useState } from 'react'
import FooterLaptop from './footerComponents/FooterLaptop'
import FooterMobile from './footerComponents/FooterMobile'
import { createClient } from "@/utils/supabase/client";


const FooterLayout = () => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient();

      const { data: userData } = await supabase.auth.getUser();
      setUser(userData.user);
    };
    fetchUser();
  })
  return (

    <>
      <FooterLaptop
        className="hidden lg:block lg:w-lvh pt-[5rem]"
        user={user}
      />
      <FooterMobile
        className="sm:block lg:hidden pt-[5rem]"
        user={user}
      />
    </>

  )
}

export default FooterLayout;
