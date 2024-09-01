'use server';
import { createClient } from '@/utils/supabase/server';

const fetchUserRestaurant = async () => {
    const supabase = createClient();

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) {
        console.error('Error fetching user:', userError);
        throw userError;
    }

    if (!user || !user.email) {
        console.error('No authenticated user found.');
        return null;
    }

    const usersEmail = user.email;

    try {
        const { data: restaurant_info, error } = await supabase
            .from('restaurant_info')
            .select()
            .eq('email', usersEmail);

        if (error) {
            console.error('Error fetching restaurant info:', error);
            throw error;
        }

        return restaurant_info;

    } catch (error) {
        console.error('Error in fetchUserRestaurant:', error);
        throw error;
    }
};

export { fetchUserRestaurant };
