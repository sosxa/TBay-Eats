'use server';
import { createClient } from '@/utils/supabase/server';

async function currentPfp() {
    const supabase = createClient();

    // Get the authenticated user
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError) {
        console.error('Error fetching user:', userError);
        return null;
    }

    if (!user || !user.email) {
        console.error('No authenticated user found.');
        return null;
    }

    const usersEmail = user.email;

    // Fetch the user ID from the profile table
    const { data: profile, error: profileError } = await supabase
        .from('profile')
        .select('id')
        .eq('email', usersEmail)
        .single();

    if (profileError || !profile) {
        console.error('Error fetching profile id:', profileError);
        return null;
    }

    const userId = profile.id;
    const bucketName = 'pfp';

    // List files in the user's folder
    const { data: files, error: listError } = await supabase
        .storage
        .from(bucketName)
        .list(`${userId}/`, {
            limit: 1 // Limit to 1 file to check if folder is empty
        });


    if (listError) {
        console.error('Error listing files:', listError);
        return null;
    }

    // Check if the directory is empty
    if (!files || files.length === 0 || files[0].name === ".emptyFolderPlaceholder") {
        return null;
    }

    // Get the public URL of the image
    const { data: imgUrl } = await supabase
        .storage
        .from(bucketName)
        .getPublicUrl(`${userId}/${files[0].name}`);

    if (!imgUrl || !imgUrl.publicUrl) {
        return null;
    }

    return imgUrl.publicUrl;
}

export default currentPfp;
