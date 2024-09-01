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
        profile && (
            <div className='flex justify-center align-middle min-h-[25rem] mt-[15rem]'>
                <div className='grid h-60 rounded-lg shadow-lg place-items-center w-1/2 bg-white'>
                    <section className='flex flex-col items-center'>

                        <h3 className={session ? 'text-center text-4xl font-semibold w-[80%] mt-3' : "hidden"}>Are you sure you want to sign out {username}?</h3>
                        <h3 className={!session ? 'text-center text-4xl font-semibold w-[80%] mt-3' : "hidden"}>Sorry but no user is currently logged in. Try visiting our Sign In page.</h3>
                        <p className={!session ? 'text-center text-xl w-[80%] mt-5' : "hidden"}>Scroll to the top of this page and click "Sign In" on the navigation bar.</p>
                        <div className='flex gap-4 grid-rows-1 mt-[2rem] mb-3'>
                            <form action={signOut}>
                                <button className={session ? "bg-transparent hover:bg-custom-green text-custom-green font-semibold hover:text-white py-2 px-4 border border-custom-green hover:border-transparent rounded" : "hidden"}>
                                    Sign Out
                                </button>
                            </form>
                        </div>
                    </section>
                </div>
            </div>
        )
    );
}


