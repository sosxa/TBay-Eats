'use server';
import { createClient } from '@/utils/supabase/server';

const fetchAll = async (comboId: any) => {
    const supabase = createClient();

    // Fetch all product info
    const { data: products, error: productError } = await supabase
        .from('combo_info')
        .select('*')
        .eq('active', true)
        .eq('id', comboId);

    if (productError) {
        throw new Error('Error fetching product data: ' + productError.message);
    }

    // Initialize an array to hold the combined product data
    const productsWithImages = [];

    // Iterate over each product to fetch associated images
    for (const product of products) {
        // Fetch user ID based on the product's email
        const { data: user, error: userError } = await supabase
            .from('profile')
            .select('id')
            .eq('email', product.email)
            .single();

        if (userError) {
            throw new Error('Error fetching user data: ' + userError.message);
        }

        const userId = user?.id;
        console.log("userId");
        console.log(userId);
        if (userId) {
            // Construct the path to query images
            const imagePath = `${userId}/${product.ogName}/`;

            // Fetch the images for the current product
            const { data: images, error: imageError } = await supabase
                .storage
                .from('combo_img')
                .list(imagePath);

            if (imageError) {
                throw new Error('Error fetching image data: ' + imageError.message);
            }

            // Initialize an array to hold the public URLs of images
            const finalUrls = [];

            // Iterate over the images array to get the public URL for each image
            for (const image of images) {
                const { data: publicUrlData } = await supabase
                    .storage
                    .from('combo_img')
                    .getPublicUrl(`${imagePath}${image.name}`);

                finalUrls.push(publicUrlData.publicUrl);
            }

            // Combine product data with the images' public URLs
            productsWithImages.push({
                ...product,
                finalUrls // Array of image URLs
            });
        }
    }

    return productsWithImages;
};

export default fetchAll;
