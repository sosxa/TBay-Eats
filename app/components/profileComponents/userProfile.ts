'use server';
import { createClient } from '@/utils/supabase/server';


const fetchUserProfile = async () => {
    const supabase = createClient();

    // Get the authenticated user
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError) {
        console.error('Error fetching user:', userError);
        return null;
    }

    if (!user || !user.email) {
        console.error('No authenticated user found.');
        return null;
    }

    const usersEmail = user.email;

    // Fetch the profile data using the email
    const { data: profile, error: profileError } = await supabase
        .from('profile')
        .select()
        .eq('email', usersEmail);

    if (profileError) {
        console.error('Error fetching profile:', profileError);
        return null;
    }

return profile;
}

export { fetchUserProfile };
