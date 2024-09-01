'use server';
import React from "react";
import { createClient } from '@/utils/supabase/server';

export const updateRestaurant = async (formData: FormData) => {
    const restaurant_name = formData.get('restaurant_name');
    const restaurant_address = formData.get("restaurant_address")
    const restaurant_number = formData.get("restaurant_number")
    const date = formData.get("date")

    const supabase = createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) {
        console.error('Error fetching user:', userError);
        throw userError;
    }

    if (!user || !user.email) {
        console.error('No authenticated user found.');
        return null;
    }

    const usersEmail = user.email;


    const { data, error } = await supabase
        .from('restaurant_info')
        .select()
        .eq("email", usersEmail)

    if (error) {
        console.log(error)
    }


    if (data && data.length > 0) {
        try {
            const { data, error } = await supabase
                .from('restaurant_info')
                .update({
                    restaurant_name: restaurant_name,
                    restaurant_address: restaurant_address,
                    restaurant_number: restaurant_number,
                }).eq("email", usersEmail)

            console.log("worked1")

        }
        catch (error) {
            throw error;
        }
    } else {

        try {
            const { data, error } = await supabase
                .from('restaurant_info')
                .upsert({
                    restaurant_name: restaurant_name,
                    restaurant_address: restaurant_address,
                    restaurant_number: restaurant_number,
                    email: usersEmail
                })
            console.log("worked2")

        } catch (error) {
            throw error;
        }
    }
}