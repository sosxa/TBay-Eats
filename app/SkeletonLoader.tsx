import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

interface SkeletonLoaderProps {
  type: 'product' | 'combo' | 'restaurant';
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ type }) => {
  // Capitalize the first letter of the type
  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const capitalizedType = capitalizeFirstLetter(type);

  if (type === 'product' || type === 'combo') {
    return (
      <>
        <h1 className='p-4 font-semibold text-black text-2xl'>{capitalizedType}s</h1>
        <div className='w-full flex flex-wrap gap-2 md:gap-4 lg:gap-6 md:grid md:grid-cols-2 lg:grid-cols-3'>
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className='w-full rounded-xl shadow-lg p-4 flex flex-col'
            >
              <Skeleton height={300} width='100%' className='rounded-t-xl' />
              <div className='w-full flex flex-col gap-2 pt-4'>
                <Skeleton width='60%' height={30} />
                <Skeleton width='40%' height={30} />
              </div>
              <div className='w-full flex gap-4 py-2'>
                <Skeleton width={70} height={30} className='mr-2' />
                <Skeleton width={70} height={30} />
              </div>
              <div className='w-full pt-2'>
                <Skeleton height={40} width='100%' />
              </div>
            </div>
          ))}
        </div>
      </>
    );
  }

  if (type === 'restaurant') {
    return (
      <>
        <h1 className='font-semibold text-black text-2xl'>{capitalizedType}s</h1>
        <div className='w-full flex flex-wrap gap-4 md:grid md:grid-cols-2 lg:grid-cols-3'>
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className='w-full border bg-[#F9F6EE] border-gray-300 rounded-lg overflow-hidden shadow-lg p-4 flex flex-col items-center gap-4'
            >
              <Skeleton circle height={128} width={128} />
              <Skeleton height={200} width='100%' />
              <div className='w-full'>
                <Skeleton width='60%' height={30} />
              </div>
            </div>
          ))}
        </div>
      </>
    );
  }

  return null;
};

export default SkeletonLoader;
