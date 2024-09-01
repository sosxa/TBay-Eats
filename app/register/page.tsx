import Link from "next/link";
import { headers } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { SubmitButton } from "./submit-button";

import React, { useState } from 'react'
import Form from '../components/forms/Form'
import Input from '../components/forms/Input'
import FormSubmitBtn from '../components/forms/FormSubmitBtn'
import FormHeader from '../components/forms/FormHeader'
import HeaderWithNav from '../components/header/HeaderWithNav'
import FooterLayout from '../components/footerLayouts/FooterLayout'
import inputTrack from "./inputTrack";
import RadioInput from "../components/forms/RadioInputProps";

export default function SignUp({
  searchParams,
}: {
  searchParams: { message: string };
}) {
  const hide = "hidden";
  var showBoolean = false;
  const show = "block";

  const signUp = async (formData: FormData) => {
    "use server";

    const origin = headers().get("origin");
    const username = formData.get("username") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirm_password") as string;
    const user = formData.get("user") as string;
    const customer = formData.get("customer") as string;
    const owner = formData.get("owner") as string;
    const supabase = createClient();


    // Check if the username already exists
    const { data: existingUsername } = await supabase
      .from('profile')
      .select('username')
      .eq('username', username)
      .single();

    if (existingUsername) {
      return redirect("/register?message=Username already exists");
    }



    if (confirmPassword != password) {
      return redirect("/register?message=Both of the password fields don't match");
    }
    // make sure the email that the user is signing up with isn't already inside of the database
    else if (confirmPassword === password) {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          // redirecting user back to the login page on website once they confirm through their email 
          emailRedirectTo: `${origin}/login`,
        },
      });

      if (error) {
        console.log(error);
        return redirect("/register?message=Could not authenticate user");
      }

      // Insert username and confirmPassword into Supabase table
      const { data, error: insertError } = await supabase.from("profile").insert([
        { username: username, user: user, email: email },
      ]);

      if (insertError) {
        console.error(insertError);
        return redirect("/register?message=Error inserting data into database");
      }
      console.log(username, email, password, user);
      return redirect("/register?message=You have successfully signed up! Check your email's inbox for a verification email from us.");

    } else {
      showBoolean = true;
    }
  };

  return (
    <>
      <HeaderWithNav />
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <div>
          <FormHeader classname="pb-2" textClass='text-custom-green' title="Sign Up" para='Sign Up and hop onto the food journey!' />
          <Form className="space-y-6" method="post">
            <center>
              <Input divClass="py-4" type='text' name='Username' typeInfo='username' />
              <Input divClass="pb-4" name='Email' type="email" typeInfo='email' />
              <Input divClass="pb-4" name='Password' type="password" typeInfo='password' />
              <Input divClass="pb-4" name='Confirm Password' type="password" typeInfo='confirm_password'
                inCorrectPassword="Password fields don't match"
                inCorrectPasswordClass={!showBoolean ? hide : show}
              />
              <fieldset className='pb-2'>
                <center className="flex w-1/2">
                  <RadioInput
                    divClass="w-full"
                    labelName="Owner"
                    name="user"
                    typeInfo="user"
                    value="owner"
                  />
                  <RadioInput
                    divClass="w-full"
                    labelName="Customer"
                    name="user"
                    typeInfo="user"
                    value="customer"
                  />
                </center>
              </fieldset>
              <FormSubmitBtn pendingText='Signing Up...' formAction={signUp}>Sign Up</FormSubmitBtn>
            </center>
          </Form>
          {searchParams?.message && (
            <p className="mt-4 p-4 bg-foreground/10 text-foreground text-center text-black">
              {searchParams.message}
            </p>
          )}
        </div>
      </div >
      <FooterLayout />
    </>
  );
}

