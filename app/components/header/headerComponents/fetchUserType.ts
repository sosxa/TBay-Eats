'use server'
import { createClient } from '@/utils/supabase/server';

export default async function fetchUserType() {
    const supabase = createClient();
    const { data: userData } = await supabase.auth.getUser();
    return userData.user;
}
