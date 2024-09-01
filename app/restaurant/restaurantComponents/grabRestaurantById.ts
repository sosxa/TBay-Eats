'use server';
import { createClient } from '@/utils/supabase/server';

export default async function grabRestaurantById(restaurantId: any) {
    const supabase = createClient();

    // Fetch all product info
    const { data: grabbingName, error: grabbingNameErr } = await supabase
        .from('restaurant_info')
        .select('restaurant_name')
        .eq('id', restaurantId);

    if (grabbingNameErr) {
        throw new Error('Error fetching product data: ' + grabbingNameErr.message);
    }

    // Fetch all product info
    const { data: grabbingEmail, error: grabbingEmailErr } = await supabase
        .from('restaurant_info')
        .select('email')
        .eq('id', restaurantId);

    if (grabbingEmailErr) {
        throw new Error('Error fetching product data: ' + grabbingEmailErr.message);
    }

    const { data: grabbingProfileId, error: grabbingProfileIdErr } = await supabase
        .from('profile')
        .select('id')
        .eq('email', grabbingEmail[0]?.email);

    if (grabbingProfileIdErr) {
        throw new Error('Error fetching product data: ' + grabbingProfileIdErr.message);
    }



    const { data: publicUrlData } = await supabase
        .storage
        .from('bg.banner')
        .getPublicUrl(`${grabbingProfileId[0]?.id}/${grabbingProfileId[0]?.id}`);

    return {
        email: grabbingEmail[0]?.email,
        banner: publicUrlData.publicUrl,
        id: grabbingProfileId[0]?.id,
        name: grabbingName[0]?.restaurant_name
    }
}
