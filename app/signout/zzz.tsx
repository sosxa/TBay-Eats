import React from 'react';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';


export default async function zzz() {
    const supabase = createClient();

    const {
        data: { session },
    } = await supabase.auth.getSession();



    // fetching the user table data and pulling their username 
    const { data: profile, error } = await supabase
        .from('profile')
        .select('username');
    // throwing error if there is one 
    if (error) {
        throw error;
    }

    // assigning username to a variable
    const username = profile[0]?.username;

    // signing the user out 
    const signOut = async () => {
        'use server';

        const supabase = createClient();
        await supabase.auth.signOut();
        return redirect('/');
    };



    return (
        <div className='flex justify-center items-center'>
            <div className='w-full max-w-md mx-4 sm:mx-8 bg-white shadow-lg rounded-lg p-6'>
                <section className='flex flex-col items-center'>
                    {session ? (
                        <>
                            <h3 className='text-center text-2xl font-semibold mb-4'>
                                Are you sure you want to sign out?
                            </h3>
                            <p className='text-center text-lg mb-6'>
                                Click the button below to sign out of your account.
                            </p>
                            <form action={signOut}>
                                <button
                                    type='submit'
                                    className='bg-custom-green text-white font-semibold py-2 px-4 rounded hover:bg-green-600 transition-colors'
                                >
                                    Sign Out
                                </button>
                            </form>
                        </>
                    ) : (
                        <>
                            <h3 className='text-center text-2xl font-semibold mb-4'>
                                No user is currently logged in.
                            </h3>
                            <p className='text-center text-lg mb-6'>
                                Please visit the Sign In page to log in.
                            </p>
                            <a href='/sign-in' className='text-custom-green font-semibold hover:underline'>
                                Go to Sign In Page
                            </a>
                        </>
                    )}
                </section>
            </div>
        </div>
    );
}


