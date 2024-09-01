'use server';
import { createClient } from '@/utils/supabase/server';

const deleteComboItem = async (comboName: string, comboItem: string) => {
    const supabase = createClient();

    // Fetching the user table data and pulling their username 
    const { data: usernameData, error: usernameError } = await supabase
        .from('profile')
        .select('username');

    if (usernameError) {
        throw usernameError;
    }

    const { data: id, error: idError } = await supabase
        .from('profile')
        .select('id');

    if (usernameError) {
        throw usernameError;
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

    const fetchedUserName = usernameData && usernameData[0] ? usernameData[0].username : null;
    const userId = id && id[0] ? id[0].id : null;

    if (!fetchedUserName) {
        throw new Error("Username not found");
    }

    // Getting the combo information for the specific combo name
    const { data: comboData, error: comboError } = await supabase
        .from('combo_info')
        .select("combo_items")
        .eq("email", usersEmail)
        .eq("combo_name", comboName);

    if (comboError) {
        throw comboError;
    }

    console.log('Raw comboData:', comboData);

    // Pretty-print the comboData to inspect its structure
    console.log('Stringified comboData:', JSON.stringify(comboData, null, 2));

    // Check if comboData exists and has items
    if (!comboData || comboData.length === 0) {
        throw new Error("Combo not found");
    }

    // Extract the combo_items array from comboData
    const comboItems = comboData[0].combo_items;

    console.log('comboItems:', comboItems);

    // Filter out the specific combo item
    const updatedComboItems = comboItems.filter((item: { label: string }) => item.label !== comboItem);

    console.log('updatedComboItems:', updatedComboItems);

    let updateData;
    let updateError;

    if (updatedComboItems.length === 0) {
        // Delete the row if no combo items are left
        const { data, error } = await supabase
            .from('combo_info')
            .delete()
            .eq("email", usersEmail)
            .eq("combo_name", comboName);

        updateData = data;
        updateError = error;

        // Fetching the image information
        const { data: getImg, error: getImgError } = await supabase
            .storage
            .from(`combo_img`)
            .list(userId + "/" + comboName + "/", {
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
                .from(`combo_img`)
                .remove([userId + "/" + comboName + "/" + getImg[0].name]);

            if (removeError) {
                throw removeError;
            }
        }

    } else {
        // Update the combo with the new list of items
        const { data, error } = await supabase
            .from('combo_info')
            .update({ combo_items: updatedComboItems })
            .eq("email", usersEmail)
            .eq("combo_name", comboName);

        updateData = data;
        updateError = error;
    }

    if (updateError) {
        throw updateError;
    }

    console.log(updateData);

    return updateData;
}

export default deleteComboItem;
