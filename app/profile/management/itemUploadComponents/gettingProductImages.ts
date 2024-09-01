'use server';
import { createClient } from '@/utils/supabase/server';

const gettingProductImages = async (fileName: string) => {
    const supabase = createClient();

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

    // Fetch user profile data to get the user ID
    const { data: profile, error: profileError } = await supabase
        .from('profile')
        .select('id')
        .eq("email", usersEmail)
        .single();

    if (profileError) {
        console.error(profileError.message);
        return null;
    }

    const userId = profile.id;

    // Fetch the list of images from the storage bucket
    const { data: images, error: listError } = await supabase
        .storage
        .from('product_img')
        .list(`${userId}/${fileName}/`, {
            limit: 100,
            offset: 0,
            sortBy: { column: "name", order: "asc" }
        });

    if (listError) {
        console.error(`Error listing images: ${listError.message}`);
        return null;
    }

    if (!images || images.length === 0) {
        console.error('No images found.');
        return null;
    }

    // Fetch the public URL for the first image in the list
    const { data: publicUrlData } = await supabase
        .storage
        .from('product_img')
        .getPublicUrl(`${userId}/${fileName}/${images[0].name}`);

    return publicUrlData.publicUrl;
};

export default gettingProductImages;
