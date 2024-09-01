'use server';
import { createClient } from '@/utils/supabase/server';

export const uploadComboData = async (formData: FormData, selectedItemsArray: Array<boolean>, productFilter: Array<any>) => {
    const comboName = formData.get("comboName");
    const comboDesc = formData.get("comboDesc");
    const comboPrice = formData.get("comboPrice");

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
        .from('combo_info')
        .upsert([
            {
                email: usersEmail,
                combo_name: comboName,
                combo_desc: comboDesc,
                price: comboPrice,
                combo_items: selectedItemsArray,
                origin: productFilter,
                ogName: comboName,
            }
        ])


    if (error) {
        return false;
    } else {
        return true;
    }
}


