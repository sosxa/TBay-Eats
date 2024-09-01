'use server';
import { createClient } from '@/utils/supabase/server';

// product name
const submitDiscount = async (discountPricesAndSizes: any[], discountAmount: any, itemName: any) => {
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

    if (discountAmount === 0 || discountAmount === "0") {
        const { data, error } = await supabase
            .from('product_info')
            .select("active_discount")
            .eq("email", usersEmail)
            .eq("product_name", itemName)

        if (data && data.some(item => item.active_discount === true)) {
            const { data: updateData, error: updateError } = await supabase
                .from('product_info')
                .update({ "active_discount": false })
                .eq("email", usersEmail)
                .eq("product_name", itemName)
        }
    }


    if (discountAmount > 0) {

        try {
            // Update active_discount to true
            const { data: updateActiveDiscountData, error: updateActiveDiscountError } = await supabase
                .from('product_info')
                .update({ "active_discount": true })
                .eq("email", usersEmail)
                .eq("product_name", itemName);

            // Update discount_amount
            const { data: updateDiscountAmountData, error: updateDiscountAmountError } = await supabase
                .from('product_info')
                .update({ "discount_amount": discountAmount })
                .eq("email", usersEmail)
                .eq("product_name", itemName);

            // Update discount_price_size
            const { data: updateDiscountPriceSizeData, error: updateDiscountPriceSizeError } = await supabase
                .from('product_info')
                .update({ "discount_price_size": discountPricesAndSizes })
                .eq("email", usersEmail)
                .eq("product_name", itemName);

                console.log("worked worked worked")
        } catch (error) {
            throw error;
        }
    }
}

export default submitDiscount;