'use server';
import { createClient } from '@/utils/supabase/server';

const fetchAll = async () => {
    console.log("running")
    const supabase = createClient();

    // Fetch all product info
    const { data: products, error: productError } = await supabase
        .from('product_info')
        .select('*')
        .eq('active', true);

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
                .list(imagePath)

            if (imageError) {
                throw Error('Error fetching image data: ' + imageError.message);
            }

            const { data: publicUrlData } = await supabase
                .storage
                .from('product_img')
                .getPublicUrl(`${userId}/${product.ogName}/${images[0].name}`);


            const finalUrl = publicUrlData.publicUrl;
            console.log("finalUrl")
            console.log(finalUrl)


            // Combine product data with the first image
            productsWithImages.push({
                ...product,
                finalUrl
            });
        }
    }

    return productsWithImages;
};


export default fetchAll;

