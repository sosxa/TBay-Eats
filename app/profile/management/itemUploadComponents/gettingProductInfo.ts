'use server';
import { createClient } from '@/utils/supabase/server';

const gettingProductInfo = async () => {
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

    // getting the product information 
    const { data, error } = await supabase
        .from('product_info')
        .select()
        .eq("email", usersEmail)

    if (error) {
        throw error
    } else {
        return data
    }


}

export default gettingProductInfo;