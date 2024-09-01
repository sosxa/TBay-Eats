'use server';
import { createClient } from '@/utils/supabase/server';

const deleteProduct = async (productName: string, productSize: string, productPrice: string) => {
    const supabase = createClient();

    // Fetch authenticated user's username and id
    const { data: username, error: usernameError } = await supabase
        .from('profile')
        .select('username');
    if (usernameError) {
        throw usernameError;
    }

    const { data: id, error: idError } = await supabase
        .from('profile')
        .select('id');
    if (idError) {
        throw idError;
    }

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

    // Extract username and user id
    const fetchedUserName = username && username[0] ? username[0].username : null;
    const userId = id && id[0] ? id[0].id : null;

    if (!fetchedUserName) {
        throw new Error("Username not found");
    }

    // Fetch comboData for the specific product name
    const { data: comboData, error: comboError } = await supabase
        .from('product_info')
        .select("price_size")
        .eq("email", usersEmail)
        .eq("product_name", productName);

    if (comboError) {
        throw comboError;
    }

    console.log('Raw comboData:', comboData);

    // Check if comboData exists and has items
    if (!comboData || comboData.length === 0) {
        throw new Error("Combo not found");
    }

    // Extract the price_size array from comboData
    const comboItems = comboData[0].price_size;

    console.log('comboItems:', comboItems);

    // Filter out the specific product based on price and size
    const updatedComboItems = comboItems.filter((item: { price: string; size: string }) => item.price !== productPrice || item.size !== productSize);

    console.log('updatedComboItems:', updatedComboItems);

    let updateData;
    let updateError;

    if (updatedComboItems.length === 0) {
        // Delete the row if no combo items are left
        const { data: deleteData, error: deleteError } = await supabase
            .from('product_info')
            .delete()
            .eq("email", usersEmail)
            .eq("product_name", productName);

        if (deleteError) {
            throw deleteError;
        }

        updateData = deleteData;

        // Fetching the image information
        const { data: getImg, error: getImgError } = await supabase
            .storage
            .from(`product_img`)
            .list(userId + "/" + productName + "/", {
                limit: 100,
                offset: 0,
                sortBy: { column: "name", order: "asc" }
            });

        if (getImgError) {
            throw getImgError;
        }

        if (getImg && getImg.length > 0) {
            // Deleting the image from storage
            const { error: removeError } = await supabase
                .storage
                .from(`product_img`)
                .remove([userId + "/" + productName + "/" + getImg[0].name]);

            if (removeError) {
                throw removeError;
            }
        }
    } else {
        // Update the product with the new list of items
        const { data: updateData, error: updateError } = await supabase
            .from('product_info')
            .update({ price_size: updatedComboItems })
            .eq("email", usersEmail)
            .eq("product_name", productName);

        if (updateError) {
            throw updateError;
        }
    }

    console.log(updateData);

    return updateData;
}

export default deleteProduct;
