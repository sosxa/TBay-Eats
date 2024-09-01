import React, { useEffect, useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { DualRangeSlider } from './DualRangeSliderProps';

interface DualRangeSliderDemoProps {
    setSelectedPriceRange: React.Dispatch<React.SetStateAction<{ min: number; max: number }>>;
    minValue: number;
    maxValue: number;
    initialValues: { min: number; max: number };
    onChange?: (values: [number, number]) => void; // New prop
}

const DualRangeSliderDemo: React.FC<DualRangeSliderDemoProps> = ({
    setSelectedPriceRange,
    minValue,
    maxValue,
    initialValues,
    onChange
}) => {
    const [values, setValues] = useState<[number, number]>([initialValues.min, initialValues.max]);
    const [isDragging, setIsDragging] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const router = useRouter();
    const searchParams = useSearchParams();

    // Update slider values when initial values change
    useEffect(() => {
        setValues([initialValues.min, initialValues.max]);
    }, [initialValues]);

    // Debounce effect for updating price range and URL
    useEffect(() => {
        if (!isDragging) {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }

            timeoutRef.current = setTimeout(() => {
                setSelectedPriceRange({ min: values[0], max: values[1] });

                const category = searchParams.get("category") || 'all';
                const price = `${values[0]},${values[1]}`;

                // Uncomment the following line to update the URL
                // router.replace(`?category=${category}&price=${price}`);
            }, 500); // Debounce timeout
        }

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [values, isDragging, router, searchParams, setSelectedPriceRange]);

    // Handlers for slider changes and mouse/touch events
    const handleSliderChange = (newValues: number[]) => {
        const [minValue, maxValue] = newValues as [number, number];
        setValues([minValue, maxValue]);
        setIsDragging(true);

        // Call the onChange prop if it's provided
        if (onChange) {
            onChange([minValue, maxValue]);
        }
    };

    const handleEnd = () => {
        if (isDragging) {
            setIsDragging(false);
        }
    };

    useEffect(() => {
        window.addEventListener('mouseup', handleEnd);
        window.addEventListener('touchend', handleEnd);

        return () => {
            window.removeEventListener('mouseup', handleEnd);
            window.removeEventListener('touchend', handleEnd);
        };
    }, [isDragging]);

    return (
        <div className="max-w-full mx-auto px-5 py-8 lg:w-1/2 lg:mt-52 xl:mt-0 xl:w-auto">
            <div className="bg-gray-200 shadow-md rounded-lg max-w-full p-6">
                <h2 className="text-2xl font-semibold mb-10 text-gray-800">Select Price Range</h2>

                <DualRangeSlider
                    label={(value) => `$${value}`}
                    value={values}
                    onValueChange={handleSliderChange}
                    min={minValue}
                    max={maxValue}
                    step={1}
                    className='text-black'
                />

                <div className="flex justify-between mt-4 text-gray-600">
                    <span className="text-lg font-medium">Min: ${values[0]}</span>
                    <span className="text-lg font-medium">Max: ${values[1]}</span>
                </div>
            </div>
        </div>
    );
};

export default DualRangeSliderDemo;
