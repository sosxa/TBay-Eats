'use server';
import { createClient } from '@/utils/supabase/server';

const updateProduct = async (ogProductName: any, productName: any, ogProductDesc: any, productDesc: any, productPriceAndSize: any) => {
    console.log("starting here...");
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
        // Fetch the original product name
        const { data: getOgName, error: getOgNameErr } = await supabase
            .from('product_info')
            .select("ogName")
            .eq('email', usersEmail)
            .eq('product_name', ogProductName)
            .single();

        if (getOgNameErr) {
            throw new Error('Error fetching product data: ' + getOgNameErr.message);
        }

        const originalOgName = getOgName.ogName;

        // Update product information
        const { data: updateData, error: updateError } = await supabase
            .from('product_info')
            .update({
                product_name: productName,
                desc: productDesc,
                price_size: productPriceAndSize
            })
            .eq('email', usersEmail)
            .eq('product_name', ogProductName);

        if (updateError) {
            console.error(updateError.message);
            return null;
        }

        // Fetch all combo_info records for the user
        const { data: grabCombos, error: grabCombosErr } = await supabase
            .from('combo_info')
            .select('*')
            .eq('email', usersEmail);

        if (grabCombosErr) {
            throw new Error('Error fetching user data: ' + grabCombosErr.message);
        }

        // Function to replace text before the hyphen
        const replaceTextBeforeHyphen = (text: string, newText: string) => {
            const [prefix, suffix] = text.split(' - ');
            if (suffix) {
                return `${newText} - ${suffix}`;
            }
            return text;
        };

        // Update the profile with new combo_items
        for (const combo of grabCombos) {
            if (combo.combo_items) {
                const updatedComboItems = combo.combo_items.map((item: any) => {
                    if (item.ogValue === originalOgName) {
                        return {
                            ...item,
                            value: replaceTextBeforeHyphen(item.value, productName),
                            label: replaceTextBeforeHyphen(item.label, productName)
                        };
                    }
                    return item;
                });

                // Update the combo_info with the modified combo_items
                const { data: updateComboData, error: updateComboError } = await supabase
                    .from('combo_info')
                    .update({ combo_items: updatedComboItems })
                    .eq('email', usersEmail)
                    .eq('combo_name', combo.combo_name); // Assuming combo_name is used to identify the specific combo

                if (updateComboError) {
                    console.error(updateComboError.message);
                    return null;
                }
            }
        }

        console.log("Product and combo items updated successfully");
        return updateData;
    } catch (error) {
        console.error('Error during update:', error);
        throw error;
    }
}

export default updateProduct;
// 'use server';
// const updateProduct = async (ogProductName: any, productName: any, ogProductDesc: any, productDesc: any, productPriceAndSize: any) => {
//     console.log("updated updated");
// }

// export default updateProduct
