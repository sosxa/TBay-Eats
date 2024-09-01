'use server';
import { createClient } from '@/utils/supabase/server';

const fetchNew = async () => {
    const supabase = createClient();

    // Get the current date and the date 14 days ago
    const now = new Date();
    const fourteenDaysAgo = new Date(now.setDate(now.getDate() - 14)).toISOString();

    // Fetch all active product info
    const { data: products, error: productError } = await supabase
        .from('product_info')
        .select('*')
        .eq('active', true)
        .gte('created_at', fourteenDaysAgo); // Filter by date

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

        if (userId) {
            // Construct the path to query images
            const imagePath = `${userId}/${product.ogName}/`;

            // Fetch the images for the current product
            const { data: images, error: imageError } = await supabase
                .storage
                .from('product_img')
                .list(imagePath);

            if (imageError) {
                throw new Error('Error fetching image data: ' + imageError.message);
            }

            // Get the URL of the first image
            let finalUrl = null;
            if (images.length > 0) {
                const { data: publicUrlData } = await supabase
                    .storage
                    .from('product_img')
                    .getPublicUrl(`${userId}/${product.ogName}/${images[0].name}`);


                finalUrl = publicUrlData.publicUrl;
            }

            // Combine product data with the first image
            productsWithImages.push({
                ...product,
                finalUrl
            });
        }
    }
    return productsWithImages;
};

export default fetchNew;
