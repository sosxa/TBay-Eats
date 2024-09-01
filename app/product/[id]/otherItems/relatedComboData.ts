'use server';
import { createClient } from '@/utils/supabase/server';

const relatedComboData = async (email: string, ogProductName: string) => {
    const supabase = createClient();

    // Fetch all active product info for the user
    const { data: products, error: productError } = await supabase
        .from('combo_info')
        .select('*')
        .eq('active', true)
        .eq('email', email);

    if (productError) {
        throw new Error('Error fetching product data: ' + productError.message);
    }

    // Fetch user ID
    const { data: findId, error: findIdErr } = await supabase
        .from('profile')
        .select('*')
        .eq('email', email);

    if (findIdErr) {
        throw new Error('Error fetching user data: ' + findIdErr.message);
    }

    const userId = findId[0]?.id;

    if (!userId) {
        throw new Error('User ID not found');
    }

    const productsWithImages = [];

    // Iterate through each product
    for (const product of products) {
        const comboItems = product.combo_items;

        // Check if any combo item matches the ogProductName
        const hasMatchingItem = comboItems.some((item: any) => item.ogValue === ogProductName);

        if (hasMatchingItem) {
            const ogName = product.ogName;

            // Construct the path to query images
            const imagePath = `${userId}/${ogName}/`;

            // Fetch the images for the current product
            const { data: images, error: imageError } = await supabase
                .storage
                .from('combo_img')
                .list(imagePath);

            if (imageError) {
                throw new Error('Error fetching image data: ' + imageError.message);
            }

            if (!images || images.length === 0) {
                console.log(`No images found for ${ogName}`);
                continue; // Skip this product if no images are found
            }

            // Fetch the public URL for the first image
            const { data: publicUrlData } = await supabase
                .storage
                .from('combo_img')
                .getPublicUrl(`${imagePath}${images[0].name}`);

            const finalUrl = publicUrlData.publicUrl;

            // Add the product and its image URL to the result
            productsWithImages.push({
                ...product,
                finalUrl
            });
        }
    }

    return productsWithImages;
}

export default relatedComboData;
