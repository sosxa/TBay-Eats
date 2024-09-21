'use server';
import { createClient } from '@/utils/supabase/server';

const restaurantFilter = async (restaurantEmail: string, userId: string, filter: string | undefined, priceFilter: any[], type: string) => {
    console.log("priceFilter")
    console.log(priceFilter)
    const supabase = createClient();

    if (type === "combos") {
        if (filter === "All") {
            const { data: products, error: productError } = await supabase
                .from('combo_info')
                .select('*')
                .eq("email", restaurantEmail)
                .eq('active', true)
                .limit(9);

            if (productError) {
                throw new Error('Error fetching product data: ' + productError.message);
            }



            // Initialize an array to hold the combined product data
            const productsWithImages = [];

            // Iterate over each product to fetch associated images
            for (const product of products) {
                const priceInRange = !priceFilter || (product.price >= priceFilter[0] && product.price <= priceFilter[1]);
                console.log("priceInRange");
                console.log(priceInRange);
                // Fetch user ID based on the product's email
                if (userId && priceInRange) {
                    // Construct the path to query images
                    const imagePath = `${userId}/${product.ogName}/`;

                    // Fetch the images for the current product
                    const { data: images, error: imageError } = await supabase
                        .storage
                        .from('combo_img')
                        .list(imagePath)

                    if (imageError) {
                        throw Error('Error fetching image data: ' + imageError.message);
                    }

                    const { data: publicUrlData } = await supabase
                        .storage
                        .from('combo_img')
                        .getPublicUrl(`${userId}/${product.ogName}/${images[0].name}`);


                    const finalUrl = publicUrlData.publicUrl;

                    productsWithImages.push({
                        ...product,
                        finalUrl
                    });
                }
            }

            return productsWithImages;
        } else {
            // Fetch all products with active status
            const { data: products, error: productError } = await supabase
                .from('combo_info')
                .select('*')
                .eq("email", restaurantEmail)
                .eq('active', true)
                .limit(9);

            if (productError) {
                throw new Error('Error fetching product data: ' + productError.message);
            }

            // Initialize an array to hold the combined product data
            const productsWithImages = [];

            // Iterate over each product to fetch associated images
            for (const product of products) {
                // Check if any origin matches the filter
                const originMatches = product.origin.some((originItem: any) => originItem.filter === filter);

                const priceInRange = !priceFilter || (product.price >= priceFilter[0] && product.price <= priceFilter[1]);


                if (!filter || originMatches && priceInRange) {
                    // Default image URL or handle case where user data might not be available
                    let finalUrl = '';

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


                        if (images.length > 0) {
                            const { data: publicUrlData } = await supabase
                                .storage
                                .from('combo_img')
                                .getPublicUrl(`${userId}/${product.ogName}/${images[0].name}`);

                            finalUrl = publicUrlData.publicUrl;
                        }
                    } else {
                        // Handle case where userId is not available
                        // Set a default image URL if user-specific images are not available
                        finalUrl = 'default_image_url'; // Replace with an actual default image URL
                    }

                    // Combine product data with the first image (or default image)
                    productsWithImages.push({
                        ...product,
                        finalUrl
                    });
                }
            }
            return productsWithImages
        }
    }

    if (type === "products") {

        if (filter === "All") {
            const { data: products, error: productError } = await supabase
                .from('product_info')
                .select('*')
                .eq("email", restaurantEmail)
                .eq('active', true)
                .limit(9);

            if (productError) {
                throw new Error('Error fetching product data: ' + productError.message);
            }



            // Initialize an array to hold the combined product data
            const productsWithImages = [];

            // Iterate over each product to fetch associated images
            for (const product of products) {
                const priceInRange = !priceFilter || (product.price_size[0].price >= priceFilter[0] && product.price_size[0].price <= priceFilter[1]);

                if (userId && priceInRange) {
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
                    console.log("images");
                    console.log(images[0].name);
                    if (images.length > 0 && images[0]) {
                        const { data: publicUrlData } = await supabase
                            .storage
                            .from('product_img')
                            .getPublicUrl(`${userId}/${product.ogName}/${images[0].name}`);


                        const finalUrl = publicUrlData.publicUrl;
                        // Combine product data with the first image
                        productsWithImages.push({
                            ...product,
                            finalUrl
                        });
                    }
                }
            }

            return productsWithImages;
        } else {
            // Fetch all products with active status
            const { data: products, error: productError } = await supabase
                .from('product_info')
                .select('*')
                .eq("email", restaurantEmail)
                .eq('active', true)
                .limit(9);

            if (productError) {
                throw new Error('Error fetching product data: ' + productError.message);
            }

            // Initialize an array to hold the combined product data
            const productsWithImages = [];

            // Iterate over each product to fetch associated images
            for (const product of products) {
                // Check if any origin matches the filter
                const originMatches = product.origin.some((originItem: any) => originItem.filter === filter);


                const priceInRange = !priceFilter || (product.price_size[0].price >= priceFilter[0] && product.price_size[0].price <= priceFilter[1]);


                if (!filter || originMatches && priceInRange) {
                    // Default image URL or handle case where user data might not be available
                    let finalUrl = '';

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


                        if (images.length > 0 && images[0].name) {
                            const { data: publicUrlData } = await supabase
                                .storage
                                .from('product_img')
                                .getPublicUrl(`${userId}/${product.ogName}/${images[0].name}`);

                            finalUrl = publicUrlData.publicUrl;
                        }
                    } else {
                        // Handle case where userId is not available
                        // Set a default image URL if user-specific images are not available
                        finalUrl = 'default_image_url'; // Replace with an actual default image URL
                    }

                    // Combine product data with the first image (or default image)
                    productsWithImages.push({
                        ...product,
                        finalUrl
                    });
                }
            }
            return productsWithImages
        }
    }
};

export default restaurantFilter;
