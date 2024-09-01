'use server';
import { createClient } from '@/utils/supabase/server';

const addProductImg = async (formData: FormData) => {
    const supabase = createClient();
    const files: File[] = [];

    // Get user email
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

    const imgName = formData.get("item_name") as string;

    // For every key and value inside of the form data,
    // for every key that starts with file and is the type file,
    // we will push that index into the files array
    for (const [key, value] of formData.entries()) {
        if (key.startsWith('file') && value instanceof File) {
            files.push(value);
        }
    }

    // Get user profile by email
    const { data: profile, error: profileError } = await supabase
        .from('profile')
        .select('id')
        .eq('email', usersEmail)
        .single(); // Assuming you only have one profile per user

    if (profileError) {
        console.error(profileError.message);
        return false;
    }

    const userId = profile.id;

    // Upload each file to Supabase storage
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileName = `${userId}/${imgName}/${file.name}`; // Generate a unique file name

        // Upload the file to Supabase storage
        const { data: uploadData, error: uploadError } = await supabase
            .storage
            .from('product_img')
            .upload(fileName, file);

        if (uploadError) {
            console.error(`Error uploading ${fileName}: ${uploadError.message}`);
            return false; // Return false on error
        }
    }

    return true; // Return true if all files are uploaded successfully
};

export default addProductImg;
