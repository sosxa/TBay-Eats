import React from 'react'
import HeaderWithNav from '../components/header/HeaderWithNav';
import FooterLayout from '../components/footerLayouts/FooterLayout';
import FormHeader from '../components/forms/FormHeader';
import Input from '../components/forms/Input';
import Form from '../components/forms/Form';
import FormSubmitBtn from '../components/forms/FormSubmitBtn';
import { redirect } from "next/navigation";
import { createClient } from '@/utils/supabase/server';
import { headers } from 'next/headers';

export default async function ResetPassword({
    searchParams,
}: {
    searchParams: { message: string; code: string };
}) {
    const supabase = createClient();

    const {
        data: { session },
    } = await supabase.auth.getSession();

    if (session) {
        return redirect('/');
    }

    const resetPassword = async (formData: FormData) => {
        'use server';

        const password = formData.get('password') as string;
        const supabase = createClient();

        if (searchParams.code) {
            const supabase = createClient();
            const { error } = await supabase.auth.exchangeCodeForSession(
                searchParams.code
            );

            if (error) {
                return redirect(
                    `/reset-password?message=Unable to reset Password. Link expired!`
                );
            }
        }

        const { error } = await supabase.auth.updateUser({
            password,
        });

        if (error) {
            console.log(error);
            return redirect(
                `/reset-password?message=Unable to reset Password. Try again!`
            );
        }

        redirect(
            `/login?message=Your Password has been reset successfully. Sign in.`
        );
    };


    return (
        <div>
            <HeaderWithNav />
            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <FormHeader textClass='text-custom-green' title="Need a new password?" para="Enter and confirm your new password below. We are excited to have you back!" />
                <Form action={resetPassword} className="space-y-6" method="GET">
                    {/* <div className='mt-6'> */}
                    <Input name='New Password' type="password" typeInfo='password' />
                    {/* </div> */}
                    <Input name='Confirm New Password' type="password" typeInfo='confirm_password' />
                    <FormSubmitBtn pendingText='Sending you an email...' title='Reset'>Forgot Password</FormSubmitBtn>
                    {searchParams?.message && (
                        <p className="mt-4 p-4 bg-foreground/10 text-foreground text-center text-black">
                            {searchParams.message}
                        </p>
                    )}
                </Form>
            </div>
            <FooterLayout />
        </div>
    )
}
