'use server';
import { createClient } from "@/utils/supabase/server";

const GetUser = async () => {

    // this will be the href depending if the active session is true or not
    const supabase = createClient();

    const { data: user } = await supabase.auth.getUser();
    // console.log(user.user)

    const {
        data: { session },
    } = await supabase.auth.getSession();


    // fetching the user table data and pulling their username 
    const { data: profile, error } = await supabase
        .from('profile')
        .select('user');
    // throwing error if there is one 
    if (error) {
        throw error;
    }
    const userType = profile[0]?.user;
    
    return user;
}

export default GetUser
