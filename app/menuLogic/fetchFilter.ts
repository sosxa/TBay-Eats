'use server';
import { createClient } from '@/utils/supabase/server';

const fetchFilter = async (filter: string | undefined, priceFilter: any[], type: string) => {
    const supabase = createClient();

    // Replace "+" with a space and capitalize the first letter of each word
    const capitalizeWords = (str: string) => {
        return str
            .replace(/\+/g, ' ') // Replace "+" with a space
            .split(' ') // Split the string into words
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize each word
            .join(' '); // Join the words back into a single string
    };

    const modifiedFilter = filter ? capitalizeWords(filter) : '';

    if (type === "combos") {
        if (modifiedFilter === "All") {

            const { data: products, error: productError } = await supabase
                .from('combo_info')
                .select('*')
                .eq('active', true);

            if (productError) {
                throw new Error('Error fetching product data: ' + productError.message);
            }

            // Initialize an array to hold the combined product data
            const productsWithImages = [];

            // Iterate over each product to fetch associated images
            for (const product of products) {
                const priceInRange = !priceFilter || (product.price >= priceFilter[0] && product.price <= priceFilter[1]);
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

                if (userId && priceInRange) {
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
                .from('combo_info')
                .select('*')
                .eq('active', true);

            if (productError) {
                throw new Error('Error fetching product data: ' + productError.message);
            }

            // Initialize an array to hold the combined product data
            const productsWithImages = [];

            // Iterate over each product to fetch associated images
            for (const product of products) {
                // Check if any origin matches the filter
                const originMatches = product.origin.some((originItem: any) => originItem.filter === modifiedFilter);

                const priceInRange = !priceFilter || (product.price >= priceFilter[0] && product.price <= priceFilter[1]);

                if (!modifiedFilter || originMatches && priceInRange) {
                    // Default image URL or handle case where user data might not be available
                    let finalUrl = '';

                    // Fetch user ID based on the product's email, if necessary
                    const { data: user, error: userError } = await supabase
                        .from('profile')
                        .select('id')
                        .eq('email', product.email)
                        .single();

                    if (userError) {
                        console.error('Error fetching user data: ' + userError.message);
                    }

                    const userId = user?.id;

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
            return productsWithImages;
        }
    }

    if (type === "products") {

        if (modifiedFilter === "All") {

            // Fetch active products with a limit of 16
            const { data: products, error: productError } = await supabase
                .from('product_info')
                .select('*')
                .eq('active', true)
                .limit(16);  // Add limit to fetch only 16 products

            if (productError) {
                throw new Error('Error fetching product data: ' + productError.message);
            }

            // Initialize an array to hold the combined product data
            const productsWithImages = [];

            // Iterate over each product to fetch associated images
            for (const product of products) {
                // Check if product price falls within the price filter range
                const priceInRange = !priceFilter || (product.price_size[0].price >= priceFilter[0] && product.price_size[0].price <= priceFilter[1]);

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

                if (userId && priceInRange) {
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

                    if (images.length > 0) {
                        // Get the public URL for the first image
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
                    } else {
                        // Handle the case where no images are found
                        productsWithImages.push({
                            ...product,
                            finalUrl: null  // Or use a default image URL
                        });
                    }
                }
            }

            return productsWithImages;
        }
        else {
            // Fetch all products with active status
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
                // Check if any origin matches the filter
                const originMatches = product.origin.some((originItem: any) => originItem.filter === modifiedFilter);

                const priceInRange = !priceFilter || (product.price_size[0].price >= priceFilter[0] && product.price_size[0].price <= priceFilter[1]);

                if (!modifiedFilter || originMatches && priceInRange) {
                    // Default image URL or handle case where user data might not be available
                    let finalUrl = '';

                    // Fetch user ID based on the product's email, if necessary
                    const { data: user, error: userError } = await supabase
                        .from('profile')
                        .select('id')
                        .eq('email', product.email)
                        .single();

                    if (userError) {
                        console.error('Error fetching user data: ' + userError.message);
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

                        if (images.length > 0) {
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
            return productsWithImages;
        }
    }
};

export default fetchFilter;
