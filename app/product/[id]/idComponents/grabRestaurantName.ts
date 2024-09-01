'use server';
import { createClient } from '@/utils/supabase/server';

const grabRestaurantName = async (email: string) => {
    const supabase = createClient();

    // Fetch restaurant info including both name and ID
    const { data, error } = await supabase
        .from('restaurant_info')
        .select('restaurant_name, id')
        .eq('email', email)
        .single(); // Use .single() if you expect a single row to be returned

    if (error) {
        throw new Error('Error fetching restaurant data: ' + error.message);
    }

    if (!data) {
        console.log('No restaurant found');
        return null; // Return null or an empty object to indicate no results
    }

    const { restaurant_name, id: restaurantId } = data;

    console.log("zz")
    console.log({
        name: restaurant_name,
        id: restaurantId
    })
    return {
        name: restaurant_name,
        id: restaurantId
    };
};

export default grabRestaurantName;
