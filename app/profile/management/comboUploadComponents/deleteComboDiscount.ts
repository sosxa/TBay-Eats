'use server';
import { createClient } from '@/utils/supabase/server';

const deleteComboDiscount = async (productName: string, productSize: string) => {
    const supabase = createClient();

    // Fetch authenticated user's email
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

    // Check if the product exists before proceeding
    const { data: productData, error: productError } = await supabase
        .from('combo_info')
        .select()
        .eq("email", usersEmail)
        .eq("combo_name", productName);

    if (productError) {
        throw productError;
    }

    if (!productData || productData.length === 0) {
        // Product not found, return or handle accordingly
        console.error('Product not found in combo_info table.');
        return;
    }

    // Product exists, proceed with delete operation on discount_price_size
    const discountData = productData[0].discount_price_size;

    // Filter out the specific product based on size
    const updatedDiscountItems = discountData.filter((item: { size: string }) => item.size !== productSize);

    // Update discount_price_size with the filtered items
    const { data: updateData, error: updateError } = await supabase
        .from('combo_info')
        .update({ discount_price_size: updatedDiscountItems })
        .eq("email", usersEmail)
        .eq("combo_name", productName);

    if (updateError) {
        throw updateError;
    }

    console.log('Discount updateData:', updateData);

    return updateData;
}

export default deleteComboDiscount;
