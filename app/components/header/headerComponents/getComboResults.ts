'use server';
import { createClient } from '@/utils/supabase/server';

const getComboResults = async (searchQuery: string) => {
    const supabase = createClient();

    // Convert the search query to lowercase and add wildcards
    const formattedQuery = `%${searchQuery.toLowerCase()}%`;

    // Fetch product details based on the search query
    const { data: fromProduct, error: productError } = await supabase
        .from("combo_info")
        .select()
        .eq("active", true)
        .ilike('combo_name', formattedQuery); // Use ilike for partial matching

    if (productError) {
        throw productError.message;
    }

    // Array to hold products with image data
    const productsWithImages = await Promise.all(fromProduct.map(async (product) => {
        try {
            // Fetch user ID based on product email
            const { data: userProfile, error: getUserIdError } = await supabase
                .from("profile")
                .select('id')
                .eq("email", product.email)
                .single();

            if (getUserIdError) {
                throw getUserIdError.message;
            }

            // Fetch product images
            const { data: imageList } = await supabase
                .storage
                .from("combo_img")
                .list(`${userProfile.id}/${product.ogName}/`);


            // Get the URL of the first image if available
            if (imageList && imageList.length > 0) {
                const { data: firstImgUrl } = await supabase
                    .storage
                    .from("combo_img")
                    .getPublicUrl(`${userProfile.id}/${product.ogName}/${imageList[0].name}`);

                // Return product with the first image URL
                return {
                    ...product,
                    firstImgUrl
                };
            } else {
                return {
                    ...product,
                    firstImageUrl: null
                };
            }

        } catch (error) {
            console.error('Error processing product:', error);
            return {
                ...product,
                firstImageUrl: null
            };
        }
    }));

    console.log("productsWithImages");
    console.log(productsWithImages);
    return productsWithImages;
}

export default getComboResults;
