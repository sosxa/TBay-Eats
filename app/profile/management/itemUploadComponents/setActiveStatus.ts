'use server';
import { createClient } from '@/utils/supabase/server';

const setActiveStatus = async (itemName: any, newValue: boolean) => {
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
        .update({ active: newValue })
        .match({ email: usersEmail, product_name: itemName })

    // console.log("data");
    // if (data && data[0] && data[0].active) {
    //     console.log(data[0].active);
    // }



    // console.log("new value");
    // console.log(newValue);

    if (error) {
        throw error
    } else {
        return data
    }


}

export default setActiveStatus;