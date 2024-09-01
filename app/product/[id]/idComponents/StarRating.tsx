// 'use client';
// import React, { useState } from 'react';

// interface StarRatingProps {
//     onRatingChange: (rating: number) => void;
// }

// const StarRating: React.FC<StarRatingProps> = ({ onRatingChange }) => {
//     const [rating, setRating] = useState<number>(0);
//     const [hoverRating, setHoverRating] = useState<number>(0);

//     // Function to handle click on a star
//     const handleClick = (index: number) => {
//         setRating(index);
//         onRatingChange(index); // Notify parent component of rating change
//     };

//     // Function to handle mouse enter on a star
//     const handleMouseEnter = (index: number) => {
//         setHoverRating(index);
//     };

//     // Function to handle mouse leave from a star
//     const handleMouseLeave = () => {
//         setHoverRating(0);
//     };

//     // Function to determine the class for each star
//     const getStarClass = (index: number) => {
//         if (hoverRating >= index) {
//             return 'text-yellow-500';
//         } else if (rating >= index) {
//             return 'text-yellow-400';
//         } else {
//             return 'text-gray-300 dark:text-neutral-600';
//         }
//     };

//     return (
//         <div className="flex items-center">
//             {[1, 2, 3, 4, 5].map((starIndex) => (
//                 <button
//                     key={starIndex}
//                     type="button"
//                     className={`size-5 inline-flex justify-center items-center text-2xl rounded-full ${getStarClass(starIndex)} hover:${getStarClass(starIndex)}`}
//                     onClick={() => handleClick(starIndex)}
//                     onMouseEnter={() => handleMouseEnter(starIndex)}
//                     onMouseLeave={handleMouseLeave}
//                 >
//                     <svg className="shrink-0 size-5" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
//                         <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"></path>
//                     </svg>
//                 </button>
//             ))}
//         </div>
//     );
// };

// export default StarRating;
'use client';
import React, { useState, useEffect } from 'react';

interface StarRatingProps {
    onRatingChange?: (rating: number) => void;
    rating?: number; // Optional prop to set initial rating
    isReadOnly?: boolean; // New prop to determine read-only mode
}

const StarRating: React.FC<StarRatingProps> = ({
    onRatingChange,
    rating = 0,
    isReadOnly = false
}) => {
    const [currentRating, setCurrentRating] = useState<number>(rating);
    const [hoverRating, setHoverRating] = useState<number>(0);

    useEffect(() => {
        setCurrentRating(rating); // Update state if rating prop changes
    }, [rating]);

    // Function to handle click on a star
    const handleClick = (index: number) => {
        if (!isReadOnly && onRatingChange) {
            setCurrentRating(index);
            onRatingChange(index); // Notify parent component of rating change
        }
    };

    // Function to handle mouse enter on a star
    const handleMouseEnter = (index: number) => {
        if (!isReadOnly) {
            setHoverRating(index);
        }
    };

    // Function to handle mouse leave from a star
    const handleMouseLeave = () => {
        if (!isReadOnly) {
            setHoverRating(0);
        }
    };

    // Function to determine the class for each star
    const getStarClass = (index: number) => {
        if (hoverRating >= index) {
            return 'text-yellow-500';
        } else if (currentRating >= index) {
            return 'text-yellow-400';
        } else {
            return 'text-gray-300 dark:text-neutral-600';
        }
    };

    return (
        <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((starIndex) => (
                <button
                    key={starIndex}
                    type="button"
                    className={`inline-flex justify-center items-center text-2xl rounded-full ${getStarClass(starIndex)} hover:${getStarClass(starIndex)}`}
                    onClick={() => handleClick(starIndex)}
                    onMouseEnter={() => handleMouseEnter(starIndex)}
                    onMouseLeave={handleMouseLeave}
                    disabled={isReadOnly} // Disable interaction in read-only mode
                >
                    <svg className="w-6 h-6 shrink-0" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"></path>
                    </svg>
                </button>
            ))}
        </div>
    );
};

export default StarRating;
