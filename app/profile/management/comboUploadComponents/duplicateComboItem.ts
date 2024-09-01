'use server';
import { createClient } from '@/utils/supabase/server';

const duplicateProducts = async (newUsername: any) => {
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

    let { data: combo_info, error } = await supabase
        .from('combo_info')
        .select()
        .eq("email", usersEmail);

    if (error) {
        throw error;
    }

    // Check for duplicates
    if (combo_info) {
        const isDuplicate = combo_info.some(item => item.combo_name === newUsername);
        console.log("isDuplicate");
        console.log(isDuplicate);
        return isDuplicate; // true if duplicate, false if not
    } else {
        console.error('No combo_info found.');
        return false; // No data found means no duplicates
    }
};

export default duplicateProducts;
