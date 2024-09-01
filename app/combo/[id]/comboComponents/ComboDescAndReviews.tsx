'use client';
import React, { useState, useEffect } from 'react';
import StarRating from '@/app/product/[id]/idComponents/StarRating';
import submitComboReview from './submitComboReview';

interface DescReviewsProps {
    description: string;
    reviews: any[]; // Update type to an array of objects
    reviewAmount: any;
    productEmail: string;
    productName: string;
}

const ProductDescAndReviews: React.FC<DescReviewsProps> = ({ description, reviews, reviewAmount, productEmail, productName }) => {
    const [activeTab, setActiveTab] = useState<'description' | 'reviews'>('description');
    const [showReviewForm, setShowReviewForm] = useState<boolean>(false);
    const [reviewTitle, setReviewTitle] = useState<string>('');
    const [reviewMessage, setReviewMessage] = useState<string>('');
    const [titleError, setTitleError] = useState<string | null>(null);
    const [messageError, setMessageError] = useState<string | null>(null);
    const [rating, setRating] = useState<number>(0);
    const [ratingError, setRatingError] = useState<string | null>(null);
    const [expandedReview, setExpandedReview] = useState<Set<number>>(new Set());
    const [visibleReviewsCount, setVisibleReviewsCount] = useState<number>(3); // Start with 5 reviews initially
    const [showAllReviews, setShowAllReviews] = useState<boolean>(false); // Track whether all reviews are shown

    // Function to handle tab changes
    const handleTabClick = (tab: 'description' | 'reviews') => {
        setActiveTab(tab);
        // Update the URL hash
        window.history.replaceState(null, '', `#${tab}`);
    };

    // Effect to handle URL hash on mount and hash change
    useEffect(() => {
        const hash = window.location.hash.replace('#', '') as 'description' | 'reviews';
        if (hash === 'reviews' || hash === 'description') {
            setActiveTab(hash);
        }
    }, []);

    // Handle form submission
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validate title, message, and rating
        let isValid = true;

        if (reviewTitle.length < 3 || reviewTitle.length > 30) {
            setTitleError('Title must be between 3 and 30 characters.');
            isValid = false;
        } else {
            setTitleError(null);
        }

        if (reviewMessage.length < 3 || reviewMessage.length > 300) {
            setMessageError('Message must be between 3 and 300 characters.');
            isValid = false;
        } else {
            setMessageError(null);
        }

        if (rating === 0) {
            setRatingError('Please provide a rating.');
            isValid = false;
        } else {
            setRatingError(null);
        }

        if (isValid) {
            // Handle valid form submission (e.g., send to API)
            console.log('Review submitted:', { title: reviewTitle, message: reviewMessage, rating });
            // Reset form
            setReviewTitle('');
            setReviewMessage('');
            setRating(0);
            setShowReviewForm(false);
        }
    };

    // Toggle review expansion
    const toggleReview = (index: number) => {
        setExpandedReview(prev => {
            const newSet = new Set(prev);
            if (newSet.has(index)) {
                newSet.delete(index);
            } else {
                newSet.add(index);
            }
            return newSet;
        });
    };

    // Show more reviews
    const showMoreReviews = () => {
        setVisibleReviewsCount(prevCount => prevCount + 5);
        setShowAllReviews(true);
    };

    // Show less reviews
    const showLessReviews = () => {
        setVisibleReviewsCount(3);
        setShowAllReviews(false);
    };

    console.log("reviews")
    console.log(reviews)
    const reviewsToDisplay = reviews.slice(0, visibleReviewsCount);

    return (
        <div className="w-full px-3 pb-10 pt-2 flex flex-col bg-gray-200">
            <div className="flex text-sm font-medium text-center text-gray-500 border-b border-gray-200">
                <ul className="flex flex-wrap -mb-px">
                    <li className="me-2">
                        <a
                            onClick={() => handleTabClick('description')}
                            className={`inline-block p-4 border-b-2 rounded-t-lg ${activeTab === 'description' ? 'text-custom-green border-custom-green hover:text-custom-dark-green hover:border-custom-dark-green cursor-pointer' : 'text-gray-500 border-transparent'} hover:text-gray-600 hover:border-gray-600 cursor-pointer`}
                            id="Description"
                            aria-current={activeTab === 'description' ? 'page' : undefined}
                        >
                            Product Description
                        </a>
                    </li>
                    <li className="me-2">
                        <a
                            onClick={() => handleTabClick('reviews')}
                            className={`inline-block p-4 border-b-2 rounded-t-lg ${activeTab === 'reviews' ? 'text-custom-green border-custom-green hover:text-custom-dark-green hover:border-custom-dark-green cursor-pointer' : 'text-gray-500 border-transparent'} hover:text-gray-600 hover:border-gray-600 cursor-pointer`}
                            id='Reviews'
                            aria-current={activeTab === 'reviews' ? 'page' : undefined}
                        >
                             ({reviews && reviews.length >= 0 ? reviews.length : "0"})
                        </a>
                    </li>
                </ul>
            </div>
            <div className="pt-4 px-2">
                {activeTab === 'description' && <p className="text-gray-700">{description}</p>}
                {activeTab === 'reviews' && (
                    <>
                        <button
                            onClick={() => setShowReviewForm(!showReviewForm)}
                            className="mb-4 px-4 py-2 bg-blue-500 text-white rounded"
                        >
                            {showReviewForm ? 'Cancel' : 'Add Review'}
                        </button>

                        {showReviewForm && (
                            <form onSubmit={handleSubmit} className="mb-4">
                                <div className="mb-4">
                                    <label htmlFor="reviewTitle" className="block text-gray-700">Review Title</label>
                                    <input
                                        type="text"
                                        id="reviewTitle"
                                        value={reviewTitle}
                                        onChange={(e) => setReviewTitle(e.target.value)}
                                        className="mt-1 p-2 border border-gray-300 rounded w-full"
                                    />
                                    {titleError && <p className="text-red-500 text-sm mt-1">{titleError}</p>}
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="reviewMessage" className="block text-gray-700">Review Message</label>
                                    <textarea
                                        id="reviewMessage"
                                        value={reviewMessage}
                                        onChange={(e) => setReviewMessage(e.target.value)}
                                        className="mt-1 p-2 border border-gray-300 rounded w-full"
                                    />
                                    {messageError && <p className="text-red-500 text-sm mt-1">{messageError}</p>}
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700">Rating</label>
                                    <StarRating onRatingChange={(newRating) => setRating(newRating)} />
                                    {ratingError && <p className="text-red-500 text-sm mt-1">{ratingError}</p>}
                                </div>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-green-500 text-white rounded"
                                    onClick={() => submitComboReview(reviewTitle, reviewMessage, rating, productEmail, productName)}
                                >
                                    Submit Review
                                </button>
                            </form>
                        )}

                        {/* Display reviews here */}
                        {reviewsToDisplay.length > 0 ? (
                            reviewsToDisplay.map((review, index) => (
                                <article key={index} className="md:gap-8 md:grid md:grid-cols-3 mb-6">
                                    <div className="flex items-center mb-6">
                                        <img className="w-10 h-10 rounded-full" src={review.pfp || "/path/to/default-image.jpg"} alt={review.username} />
                                        <div className="ms-4">
                                            <p className="font-medium text-black">{review.username}</p>
                                            <p className="text-gray-500 text-sm"><time>{review.date}</time></p>
                                            <StarRating rating={review.rating} isReadOnly={true} /> {/* Display mode */}
                                        </div>
                                    </div>
                                    <div className="col-span-2 mt-6 md:mt-0">
                                        <h4 className="text-xl font-bold text-black">{review.title}</h4>
                                        <p className="mb-2 text-black">
                                            {expandedReview.has(index)
                                                ? review.desc
                                                : review.desc.length > 100
                                                    ? review.desc.slice(0, 100) + '...'
                                                    : review.desc
                                            }
                                        </p>
                                        {review.desc.length > 100 && (
                                            <button
                                                onClick={() => toggleReview(index)}
                                                className="text-blue-500 hover:underline"
                                            >
                                                {expandedReview.has(index) ? 'Read Less' : 'Read More'}
                                            </button>
                                        )}
                                        <aside className="flex items-center mt-3">
                                            <a href="#" className="inline-flex items-center text-sm font-medium text-blue-600 hover:underline dark:text-blue-500">
                                                <svg className="w-3.5 h-3.5 me-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 18">
                                                    <path d="M3 7H1a1 1 0 0 0-1 1v8a2 2 0 0 0 4 0V8a1 1 0 0 0-1-1Zm12.954 0H12l1.558-4.5a1.778 1.778 0 0 0-3.331-1.06A24.859 24.859 0 0 1 6 6.8v9.586h.114C8.223 16.969 11.015 18 13.6 18c1.4 0 1.592-.526 1.88-1.317l2.354-7A2 2 0 0 0 15.954 7Z" />
                                                </svg>
                                                Helpful
                                            </a>
                                            <a href="#" className="inline-flex items-center text-sm font-medium text-blue-600 hover:underline dark:text-blue-500 group ms-5">
                                                <svg className="w-3.5 h-3.5 me-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 18">
                                                    <path d="M11.955 2.117h-.114C9.732 1.535 6.941.5 4.356.5c-1.4 0-1.592.526-1.879 1.316l-2.355 7A2 2 0 0 0 2 11.5h3.956L4.4 16a1.779 1.779 0 0 0 3.332 1.061 24.8 24.8 0 0 1 4.226-5.36l-.003-9.584ZM15 11h2a1 1 0 0 0 1-1V2a2 2 0 1 0-4 0v8a1 1 0 0 0 1 1Z" />
                                                </svg>
                                                Not helpful
                                            </a>
                                        </aside>
                                    </div>
                                </article>
                            ))
                        ) : (
                            <p className="text-gray-600">No reviews yet.</p>
                        )}
                        {/* Show More / Show Less Reviews Button */}
                        {reviews.length > 5 && (
                            <div className="mt-4 flex gap-4">
                                {showAllReviews ? (
                                    <>
                                        <button
                                            onClick={showLessReviews}
                                            className="px-4 py-2 bg-blue-500 text-white rounded"
                                        >
                                            Show Less Reviews
                                        </button>
                                        <button
                                            onClick={showMoreReviews}
                                            className="px-4 py-2 bg-blue-500 text-white rounded"
                                        >
                                            Show More Reviews
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        onClick={showMoreReviews}
                                        className="px-4 py-2 bg-blue-500 text-white rounded"
                                    >
                                        Show More Reviews
                                    </button>
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

export default ProductDescAndReviews;
