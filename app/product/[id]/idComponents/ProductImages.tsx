'use client';
import React, { useState } from 'react';
import Skeleton from 'react-loading-skeleton';

// Define a TypeScript interface for the props
interface ProductImagesProps {
    images: string[];
}

const ProductImages: React.FC<ProductImagesProps> = ({ images }) => {
    // Default to the first image or a placeholder if no images are provided
    const [mainImage, setMainImage] = useState<string>(images[0] || '');

    // Handle the thumbnail click
    const handleThumbnailClick = (src: string) => {
        setMainImage(src);
    };

    return (
        <div className="grid gap-2 w-full">
            {/* Display the main image */}
            <div>
                <img
                    className="h-auto w-full max-w-full rounded-none object-cover object-center md:h-[480px]"
                    src={mainImage}
                    alt="Main product"
                />
            </div>

            {/* Display the thumbnails */}
            <div className={`grid place-items-center ${images.length === 1 ? 'grid-cols-1' : images.length <= 2 ? 'grid-cols-2' : 'grid-cols-5'} gap-4`}>
                {images.map((src, index) => (
                    <div key={index}>
                        <img
                            src={src}
                            className="object-cover object-center h-20 max-w-full rounded-none cursor-pointer"
                            alt={`Thumbnail ${index + 1}`}
                            onClick={() => handleThumbnailClick(src)}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductImages;
