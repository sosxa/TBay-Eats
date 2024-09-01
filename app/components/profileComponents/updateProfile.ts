'use server';
import { createClient } from '@/utils/supabase/server';

export const updateProfile = async (formData: FormData) => {
    const username = formData.get('username');
    const address = formData.get('address');
    const phone = formData.get('phone');
    const dob = formData.get('date');

    const supabase = createClient();

    // Get the authenticated user
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

    try {
      
        // Now update the profile with the new information
        const { data: updatedProfile, error: updateError } = await supabase
            .from('profile')
            .update({ username: username, address, phone, dob })
            .eq('email', usersEmail);

        if (updateError) {
            console.error('Error updating profile:', updateError);
            throw updateError;
        }

        console.log('Profile updated successfully:', updatedProfile);
        return updatedProfile;
    } catch (error) {
        console.error('Failed to update profile:', error);
        throw error;
    }
};
