'use server'
import { createClient } from '@/utils/supabase/server'

const updatePfp = async (formData: FormData) => {
    const supabase = createClient()

    const file = formData.get('filePfp'); // Assuming 'filePfp' is the key for the File object
    if (file instanceof File) {
        const bucketName = 'pfp'

        // Get authenticated user
        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (userError || !user) {
            console.error('Error fetching user or user not authenticated:', userError);
            return null;
        }

        // Fetch user ID
        const { data: profile, error: profileError } = await supabase
            .from('profile')
            .select('id')
            .eq('email', user.email)
            .single();

        if (profileError || !profile) {
            console.error('Error fetching profile id:', profileError);
            return null;
        }

        const userId = profile.id;

        // List files in the user's folder
        const { data: files, error: listError } = await supabase
            .storage
            .from(bucketName)
            .list(userId + '/', {
                limit: 100,
                offset: 0,
                sortBy: { column: 'name', order: 'asc' }
            });

        if (listError) {
            console.error('Error listing files:', listError);
            return null;
        }

        // Delete existing files in the user's folder
        if (files && files.length > 0) {
            const existingFiles = files.map(file => `${userId}/${file.name}`);
            const { error: deleteError } = await supabase
                .storage
                .from(bucketName)
                .remove(existingFiles);

            if (deleteError) {
                console.error('Error deleting existing files:', deleteError);
                return null;
            }
        }

        // Upload the new file with the file name set to the user ID
        const { data: uploadData, error: uploadError } = await supabase
            .storage
            .from(bucketName)
            .upload(`${userId}/${userId}`, file, {
                cacheControl: '3600',
                upsert: true
            });

        if (uploadError) {
            console.error('Error uploading file:', uploadError);
            return null;
        }

        // Get the public URL of the uploaded file
        const { data: imgUrl} = await supabase
            .storage
            .from(bucketName)
            .getPublicUrl(`${userId}/${userId}`);

        return imgUrl.publicUrl;
    }

    return null;
}

export default updatePfp;
