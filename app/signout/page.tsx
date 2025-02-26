import React from 'react'
import ClientRedirect from './zzz'
import HeaderWithNav from '../components/header/HeaderWithNav'
import FooterLayout from '../components/footerLayouts/FooterLayout'
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation'

const page = async () => {

    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
        redirect("/login");
    }

    return (
        <>
            <HeaderWithNav />
            <ClientRedirect />
            <FooterLayout />
        </>
    )
}

export default page
