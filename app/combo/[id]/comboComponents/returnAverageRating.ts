const returnAverageRating = (reviewArray: { rating: number }[]): number => {
    // Handle case where there are no reviews
    if (reviewArray.length === 0) return 0;

    // Handle case with a single review
    if (reviewArray.length === 1) return reviewArray[0].rating;

    // Calculate the sum of all ratings
    const totalRating = reviewArray.reduce((sum, review) => sum + review.rating, 0);

    // Calculate the average rating
    const averageRating = totalRating / reviewArray.length;

    return averageRating;
};

export default returnAverageRating;
