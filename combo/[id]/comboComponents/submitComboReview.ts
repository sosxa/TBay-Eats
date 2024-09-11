'use server';
import { createClient } from '@/utils/supabase/server';

const submitComboReview = async (reviewTitle: string, reviewDesc: string, reviewStars: any, creatorEmail: string, productName: string) => {
    const supabase = createClient();

    // Fetch the logged-in user
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) throw new Error('Error fetching logged-in user: ' + userError.message);

    const userEmail = userData.user?.email;
    if (!userEmail) throw new Error('User is not authenticated');

    // Find the user ID and username from the profile table
    const { data: userProfile, error: userProfileErr } = await supabase
        .from('profile')
        .select("id, username")
        .eq('email', userEmail)
        .single();

    if (userProfileErr) throw new Error('Error fetching user profile: ' + userProfileErr.message);

    const { id: userId, username } = userProfile;

    if (!userId || !username) throw new Error('User profile is incomplete');

    // Define the storage bucket and path
    const bucketName = 'pfp';
    const profilePicturePath = `${userId}/${userId}`;

    // Fetch the public URL of the profile picture
    const { data: publicURLData } = supabase.storage.from(bucketName).getPublicUrl(profilePicturePath);
    const publicURL = publicURLData.publicUrl;

    console.log("reviewStars")
    console.log(reviewStars)
    // Check the current product's rating_messages 
    const { data: productInfo, error: productInfoErr } = await supabase
        .from('combo_info')
        .select("rating_messages")
        .eq('email', creatorEmail)
        .eq('ogName', productName)
        .single();

    if (productInfoErr) throw new Error('Error fetching product info: ' + productInfoErr.message);

    const nonStringDate = new Date().toISOString();
    const date = new Date(nonStringDate);
    // const date = new Date(isoDate);

    // Format date and time without seconds
    const formattedDate = date.toLocaleDateString(); // e.g., "8/9/2024"
    const formattedTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // e.g., "12:09 AM"
    const formattedDateTime = `${formattedDate} ${formattedTime}`;

    let updatedRatingMessages = [];

    // Prepare the new rating message
    const newRatingMessage = {
        userId,
        username,
        rating: reviewStars,
        title: reviewTitle,
        desc: reviewDesc,
        pfp: publicURL,
        email: userEmail,
        date: formattedDateTime
    };

    if (productInfo && productInfo.rating_messages) {
        // If rating_messages exists, append the new message
        updatedRatingMessages = [...productInfo.rating_messages, newRatingMessage];
    } else {
        // Otherwise, start a new array with the new message
        updatedRatingMessages = [newRatingMessage];
    }

    const { error: upsertError } = await supabase
        .from('combo_info')
        .update(
            {
                email: creatorEmail,
                ogName: productName, // This ensures the correct matching with the `ogName` field
                rating_messages: updatedRatingMessages,
            }
        )
        .eq('email', userEmail)
        .eq('ogName', productName);


    if (upsertError) throw new Error('Error upserting product info: ' + upsertError.message);

    // Return the public URL or any other meaningful response
    return publicURL;
};

export default submitComboReview;
