'use server';
import { createClient } from '@/utils/supabase/server';

const updateComboInfo = async (ogComboName: string, comboName: string, comboDesc: string, comboItems: any[]) => {

    // get the users email
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

    try {
        // go to the product using the ogProduct name and update all of the fields 
        const { data, error } = await supabase
            .from('combo_info')
            .update(
                [
                    {
                        combo_name: comboName,
                        combo_desc: comboDesc,
                        combo_items: comboItems
                    }
                ]
            )
            .eq('email', usersEmail)
            .eq('ogName', ogComboName)

        // Fetch user profile data to get the user ID
        const { data: profile, error: profileError } = await supabase
            .from('profile')
            .select('id')
            .eq("email", usersEmail)
            .single();

        if (profileError) {
            console.error(profileError.message);
            return null;
        }

        const userId = profile.id;

        // updating img name 
        // Copy the file to a new location with the new name
        const { data: copyData, error: copyError } = await supabase
            .storage
            .from('combo_img')
            .move(userId + '/' + ogComboName, userId + '/' + comboName)


        if (copyError) {
            console.error(copyError);
            return null;
        }

        if (error) {
            throw error
        } else {
            console.log("done done1")
            return data
        }



    } catch (error) {
        throw error;
    }

    // delete the images as well

}

export default updateComboInfo
