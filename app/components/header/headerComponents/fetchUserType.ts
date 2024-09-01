'use server'
import { createClient } from '@/utils/supabase/server';

export default async function fetchUserType() {
    const supabase = createClient();
    const { data: user } = await supabase.auth.getUser();
    const {
        data: { session },
    } = await supabase.auth.getSession();
    console.log("user.user?.email")
console.log(user.user?.email)

    // const { data: profile, error } = await supabase
    //     .from('profile')
    //     .select(user)
    //     .eq("email", email)
    // if (error) {
    //     throw error;
    // }
    // const userType = profile[0]?.user;

    // return userType;
}
