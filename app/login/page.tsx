

import Link from "next/link";
import { headers } from "next/headers";
import { createClient } from '@/utils/supabase/server';
import { redirect } from "next/navigation";
import React, { useState } from 'react'
import Form from '../components/forms/Form'
import Input from '../components/forms/Input'
import FormSubmitBtn from '../components/forms/FormSubmitBtn'
import FormHeader from '../components/forms/FormHeader'
import HeaderWithNav from '../components/header/HeaderWithNav'
import FooterLayout from '../components/footerLayouts/FooterLayout'


export default function Login({
  searchParams,
}: {
  searchParams: { message: string };
}) {
  const signIn = async (formData: FormData) => {
    'use server';
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const supabase = createClient();

    const { data } = await supabase.auth.refreshSession();
    const { session, user } = data;

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    }
    );

    if (error) {
      return redirect("/login?message=Could not authenticate user");
    }

    return redirect("/");
  }



  return (
    <>
      <HeaderWithNav />
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <div>
          <FormHeader textClass='text-custom-green' title="Sign In" para='Sign in and start your food adventure!' />
          <Form className="space-y-6" method="POST">
            <center>
              <Input
                divClass="py-5"
                type='email'
                name='Email'
                typeInfo='email'
              />
              <Input
                forgot={<a href="/forgot-password">
                  Forgot password?
                </a>} type='password' name='Password' typeInfo='password' divClass="pb-4" >
              </Input>
              <div className="pb-5">
                <a href="/register" className="hover:underline text-custom-green w-full">Don't have an account with us?<br />Click here to register now!</a>
              </div>
              <FormSubmitBtn pendingText='Logging In...' title='Sign In' formAction={signIn}>Login</FormSubmitBtn>
            </center>
          </Form>
          {searchParams?.message && (
            <p className="mt-4 p-4 bg-foreground/10 text-foreground text-center text-black">
              {searchParams.message}
            </p>
          )}
        </div>
      </div>
      <FooterLayout />
    </>
  )
}

