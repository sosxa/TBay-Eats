'use server';
import { createClient } from '@/utils/supabase/server';

const fetchAllRestaurants = async () => {
    const supabase = createClient();

    // Fetch all product info
    const { data: products, error: productError } = await supabase
        .from('restaurant_info')
        .select('*')

    if (productError) {
        throw new Error('Error fetching product data: ' + productError.message);
    }



    // Initialize an array to hold the combined product data
    const productsWithImages = [];

    // Iterate over each product to fetch associated images
    for (const product of products) {
        console.log("product")
        console.log(product)
        console.log("product.email")
        console.log(product.email)
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
            const imagePath = `${userId}/`;

            // Fetch the images for the current product
            const { data: images, error: imageError } = await supabase
                .storage
                .from('pfp')
                .list(imagePath)

            if (imageError) {
                throw Error('Error fetching image data: ' + imageError.message);
            }

            const { data: publicUrlData } = await supabase
                .storage
                .from('pfp')
                .getPublicUrl(`${userId}/${images[0].name}`);


            const pfpUrl = publicUrlData.publicUrl;
            console.log("pfpUrl")
            console.log(pfpUrl)

            // Fetch the images for the current product
            const { data: bannerImg, error: bannerImgErr } = await supabase
                .storage
                .from('bg.banner')
                .list(imagePath)

            if (bannerImgErr) {
                throw Error('Error fetching image data: ' + bannerImgErr.message);
            }

            const { data: publicBannerUrl } = await supabase
                .storage
                .from('bg.banner')
                .getPublicUrl(`${userId}/${bannerImg[0].name}`);


            const bannerUrl = publicBannerUrl.publicUrl;
            console.log("bannerUrl")
            console.log(bannerUrl)


            // Combine product data with the first image
            productsWithImages.push({
                ...product,
                pfpUrl,
                bannerUrl
            });

            console.log(productsWithImages);
        }
    }

    return productsWithImages;
};


export default fetchAllRestaurants;

