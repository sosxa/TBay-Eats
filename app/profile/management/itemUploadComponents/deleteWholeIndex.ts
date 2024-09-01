'use server';
import { createClient } from '@/utils/supabase/server';

const deleteWholeIndex = async (productName: string) => {
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

    // Fetch comboData for the specific product name
    const { data: comboData, error: comboError } = await supabase
        .from('product_info')
        .delete()
        .eq('email', usersEmail)
        .eq('product_name', productName);

    if (comboError) {
        throw comboError;
    }

}
export default deleteWholeIndex;