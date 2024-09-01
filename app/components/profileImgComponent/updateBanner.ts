'use server';
import { createClient } from '@/utils/supabase/server';

const updateBanner = async (formData: FormData) => {
    const supabase = createClient();

    const file = formData.get('fileBanner'); // Assuming 'fileBanner' is the key for the File object
    if (file instanceof File) {
        const bucketName = 'bg.banner';

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
        const { data: idData, error: idError } = await supabase
            .from('profile')
            .select('id')
            .eq('email', usersEmail)
            .single();

        if (idError) {
            console.error('Error fetching profile id:', idError);
            return null;
        }

        if (!idData || !idData.id) {
            console.error('No profile id found.');
            return null;
        }

        const userId = idData.id;

        // Check for existing files in the user's folder
        const { data: existingFiles, error: listError } = await supabase
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

        // If there is an existing file, delete it
        if (existingFiles && existingFiles.length > 0) {
            const fileNames = existingFiles.map(file => `${userId}/${file.name}`);
            const { error: deleteError } = await supabase
                .storage
                .from(bucketName)
                .remove(fileNames);

            if (deleteError) {
                console.error('Error deleting existing files:', deleteError);
                return null;
            }
        }

        // Upload the new image with the userId as its name
        const { data: uploadData, error: uploadError } = await supabase
            .storage
            .from(bucketName)
            .upload(userId + '/' + userId, file, {
                cacheControl: '3600',
                upsert: true
            });

        if (uploadError) {
            console.error('Error uploading new file:', uploadError);
            return null;
        }

        // Get the public URL of the newly uploaded image
        const { data: imgUrl } = await supabase
            .storage
            .from(bucketName)
            .getPublicUrl(userId + '/' + userId);

        return imgUrl.publicUrl;
    }

    return null;
}

export default updateBanner;
