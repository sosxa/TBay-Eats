'use server';
import { createClient } from '@/utils/supabase/server';

const checkingRestaurantName = async (newUsername: string) => {
    const supabase = createClient();

    const { data: profile, error: restaurantError } = await supabase
        .from('restaurant_info')
        .select();

    if (restaurantError) {
        throw restaurantError;
    }

    // Check if newUsername matches any existing restaurant_name
    const isUsernameTaken = profile.some(user => user.restaurant_name === newUsername);

    return isUsernameTaken; // true if match false no match
};

export default checkingRestaurantName;
