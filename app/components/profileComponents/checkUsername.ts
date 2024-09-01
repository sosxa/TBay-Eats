'use server';
import { createClient } from '@/utils/supabase/server';

const checkUsername = async (newUsername: string) => {

    const supabase = createClient();

    const { data: profile, error: profileError } = await supabase
        .from('profile')
        .select()
    if (profileError) {
        throw profileError
    }

    const isUsernameTaken = profile.some(user => user.username === newUsername);

    console.log(isUsernameTaken); // Output: true if a match is found, false otherwise


}

export default checkUsername
