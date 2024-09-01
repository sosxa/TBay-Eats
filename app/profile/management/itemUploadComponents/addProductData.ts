'use server';
import { createClient } from '@/utils/supabase/server';

export const addProductData = async (formData: FormData, sizeAndPrice: Array<any>, spices: Array<any>, itemOrigin: Array<any>) => {
    const itemName = formData.get('item_name');
    const itemDesc = formData.get('item_desc');


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
        .from('product_info')
        .upsert([
            {
                product_name: itemName,
                desc: itemDesc,
                spice_level: spices,
                price_size: sizeAndPrice,
                email: usersEmail,
                origin: itemOrigin,
                ogName: itemName,
            }
        ])
        .eq("email", usersEmail)


    if (error) {
        console.log(false)
        return false
    } else {
        console.log(true)
        return true
    }
}


