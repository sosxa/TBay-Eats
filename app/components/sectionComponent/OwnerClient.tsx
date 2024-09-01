'use client';
import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
const OwnerClient = ({ loading: parentLoading }: { loading: boolean }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [loading, setLoading] = useState(parentLoading); // Local loading state

  const handleNavigation = (path: any) => {
    setLoading(true);
    router.push(path);
  };

  useEffect(() => {
    setLoading(false); // Reset loading state once navigation is complete
  }, [pathname]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} className='2xl:-translate-y-[7rem] xl:-translate-y-[7rem] lg:-translate-y-[5rem] md:-translate-y-[1rem]'>
      <div className="inline-flex rounded-md shadow-sm mb-[8rem]" role="group">
        <button
          type="button"
          className={
            pathname === "/profile" ?
              "px-4 py-2 text-sm font-medium text-gray-600 bg-custom-yellow border border-custom-yellow rounded-s-lg hover:text-black focus:z-10 focus:ring-2" :
              "px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-custom-yellow rounded-s-lg hover:text-black focus:z-10 focus:ring-2"
          }
          onClick={() => handleNavigation('/profile')}
        >
          Profile
        </button>
        <button
          type="button"
          className={
            pathname === "/profile/management" ?
              "px-4 py-2 text-sm font-medium bg-custom-yellow text-gray-600 border-t border-e border-b border-custom-yellow hover:text-black focus:z-10 focus:ring-2" :
              "px-4 py-2 text-sm font-medium bg-white text-gray-600 border-t border-e border-b border-custom-yellow hover:text-black focus:z-10 focus:ring-2"
          }
          onClick={() => handleNavigation('/profile/management')}
        >
          Management
        </button>
        <button
          type="button"
          className={
            pathname === "/profile/order-history" ?
              "px-4 py-2 text-sm font-medium bg-custom-yellow text-gray-600 border-t border-b border-custom-yellow hover:text-black focus:z-10 focus:ring-2" :
              "px-4 py-2 text-sm font-medium bg-white text-gray-600 border-t border-b border-custom-yellow hover:text-black focus:z-10 focus:ring-2"
          }
          onClick={() => handleNavigation('/profile/order-history')}
        >
          Order History
        </button>
        <button
          type="button"
          className={
            pathname === "/profile/settings" ?
              "px-4 py-2 text-sm font-medium text-gray-600 bg-custom-yellow border border-custom-yellow rounded-e-lg hover:text-black focus:z-10 focus:ring-2" :
              "px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-custom-yellow rounded-e-lg hover:text-black focus:z-10 focus:ring-2"
          }
          onClick={() => handleNavigation('/profile/settings')}
        >
          Settings
        </button>
      </div>
    </div>
  )
}

export default OwnerClient;
