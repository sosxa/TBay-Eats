'use server';
import { createClient } from '@/utils/supabase/server';

const setActiveCombo = async (itemName: any, newValue: boolean) => {
    console.log("newValue");
    console.log(newValue);
    console.log("itemName");
    console.log(itemName);
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
        .from('combo_info')
        .update({ active: newValue })
        .match({ email: usersEmail, combo_name: itemName })

    console.log("data");
    console.log(data);

    // if (data && data[index] && data[index].active) {
    //     console.log(data[index].active);
    // }



    console.log("new value");
    console.log(newValue);

    if (error) {
        throw error
    } else {
        return data
    }


}

export default setActiveCombo;