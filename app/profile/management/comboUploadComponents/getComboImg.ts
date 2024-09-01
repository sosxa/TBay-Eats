'use server';
import { createClient } from '@/utils/supabase/server';

const getComboImg = async (fileName: String) => {
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

    // fetching the user table data and pulling their username 
    const { data: id } = await supabase
        .from('profile')
        .select('id')
        .eq("email", usersEmail)

    // user id 
    const userId = id && id[0] ? id[0].id : null;

    const { data: getImg } = await supabase
        .storage
        .from('combo_img')
        .list(userId + "/" + fileName + "/", {
            limit: 100,
            offset: 0,
            sortBy: { column: "name", order: "asc" }
        })

    if (getImg) {
        const { data } = await supabase
            .storage
            .from('combo_img')
            .getPublicUrl(userId + "/" + fileName + "/" + getImg[0].name)
        return data
    }
}

export default getComboImg;