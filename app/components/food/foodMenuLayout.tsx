import { useCart } from '../header/headerComponents/CartContext';
import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import fetchFilter from '@/app/menuLogic/fetchFilter';
import SlidingAside from './SlidingAside';

interface FoodDivProps {
  filter: string;
  prices: { min: number; max: number };
  type: 'combos' | 'products';
  rdyToFetch: boolean;
}

interface Product {
  id: string;
  finalUrl: string;
  product_name?: string;
  combo_name?: string;
  price: number;
  discount_price_size?: { price: number }[];
  active_discount?: boolean;
  discount_amount?: number;
  combo_items?: any[];
  spice_level?: { label: string }[];
  price_size?: { size: string; price: number }[];
  rating_messages?: { rating: number }[];
  email?: string;
  ogName?: string;
  origin?: { filter: string }[];
}

const FoodDiv: React.FC<FoodDivProps> = ({ filter, prices, type, rdyToFetch }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [asideOpen, setAsideOpen] = useState<boolean>(false);
  const router = useRouter();
  const [page, setPage] = useState<number>(1); // Track the current page
  const [hasMore, setHasMore] = useState(true);
  const { dispatch } = useCart();
  const itemsPerPage = 9; // Number of items to fetch per page

  const fetchData = useCallback(async () => {
    if (rdyToFetch) {
      try {
        setLoading(true);
        const data = await fetchFilter(filter, [prices.min, prices.max], type, page, itemsPerPage);

        if (data && data.length < itemsPerPage) {
          setHasMore(false); // No more products to load
        }

        // Use an empty array as the default value if prevProducts is undefined
        setProducts(prevProducts => [...(prevProducts || []), ...data]);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    }
  }, [filter, prices.min, prices.max, type, rdyToFetch, page]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleLoadMore = () => {
    if (hasMore) {
      setPage(prevPage => prevPage + 1);
    }
  };

  const handleChange = (productId: string) => {
    const route = type === 'combos' ? 'combo' : 'product';
    router.push(`/${route}/${productId}`);
  };

  const handleAddToCartClick = (event: React.MouseEvent<HTMLButtonElement>, product: Product) => {
    event.stopPropagation();

    const isCombo = !!product.combo_name;
    const isProduct = !!product.product_name;

    if (!isCombo && !isProduct) {
      console.error("Product must have either combo_name or product_name");
      return;
    }

    const item = {
      itemId: product.id,
      itemName: isCombo ? product.combo_name || 'Unknown Combo' : product.product_name || 'Unknown Product',
      type: isCombo ? 'combo' : 'product',
      firstImgUrl: product.finalUrl,
      itemOgName: product.ogName,
      creatorEmail: product.email,
      filter: product.origin?.[0]?.filter,
      price: isCombo ? product.price : (product.price_size?.[0]?.price || product.price),
      quantity: 1,
      ogPrice: isCombo ? product.price : (product.price_size?.[0]?.price || product.price),
      activeDiscount: product.active_discount,
      discountPrice: !isCombo && product.discount_price_size?.[0]?.price ? product.discount_price_size?.[0]?.price : product.active_discount_price,
      discountAmount: product.discount_amount,
      comboItems: isCombo ? product.combo_items : undefined,
      spiceLevel: isProduct ? product.spice_level?.[0]?.label : undefined,
      size: isProduct ? product.price_size?.[0]?.size : undefined
    };

    const computedPrice = (item.ogPrice * (item.quantity || 1)).toFixed(2);

    dispatch({
      type: 'ADD_ITEM',
      payload: {
        ...item,
        quantity: item.quantity ?? 1,
        price: computedPrice,
      },
    });

    setSelectedProduct(product);
    setAsideOpen(true);
  };

  const handleCloseAside = () => {
    setAsideOpen(false);
    setSelectedProduct(null);
  };

  return (
    <>
      {loading ? (
        <div className='w-full flex flex-wrap gap-2 md:gap-4 lg:gap-6 md:grid md:grid-cols-2 lg:grid-cols-3'>
          {Array.from({ length: itemsPerPage }).map((_, index) => (
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
      ) : products.length === 0 ? (
        <div className='w-full text-center py-8'>
          <p className='text-lg font-semibold text-gray-600'>No products found matching the selected filters.</p>
        </div>
      ) : (
        <div className='w-full flex flex-wrap gap-2 px-3 sm:px-[4rem] md:px-5 md:gap-4 lg:px-2 md:grid md:grid-cols-2 lg:grid-cols-3'>
          {products.map((product) => (
            <div
              key={product.id}
              className='w-full rounded-xl shadow-lg bg-[#F9F6EE] transform transition-transform duration-300 ease-in-out hover:scale-105 cursor-pointer relative p-4'
              onClick={() => handleChange(product.id)}
              role="button"
              aria-label={`View details for ${type === "products" ? product.product_name : product.combo_name}`}
            >
              <img
                src={product.finalUrl}
                width={500}
                height={500}
                alt={type === "products" ? `Image of ${product.product_name}` : `Image of ${product.combo_name}`}
                className='w-full h-[20rem] object-cover rounded-t-xl'
              />
              {product.active_discount && (
                <div className='absolute top-2 right-2 bg-custom-yellow text-white rounded-md p-2'>
                  <p className='text-lg font-bold'>{product.discount_amount}%</p>
                </div>
              )}
              <div className='w-full pt-[1.5rem] pb-[0rem] px-[.5rem] flex items-center justify-between'>
                <h4 className='text-xl font-semibold'>
                  {type === "products" ? product.product_name : product.combo_name || 'N/A'}
                </h4>
                <h4 className='text-xl font-semibold'>
                  {!loading && type === "products"
                    ? `$${product.active_discount ? product.discount_price_size?.[0]?.price : product.price_size?.[0]?.price}`
                    : `$${product.active_discount ? product.active_discount_price : product.price}`
                  }
                </h4>
              </div>
              <div className='w-full px-[.5rem] flex gap-4 pb-[1rem]'>
                <div className='bg-gray-300 rounded-md w-[3.5rem] flex items-center justify-center px-5'>
                  <div className='w-6 h-6 flex items-center justify-center'>
                    <svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 122.88 117.19" className="w-4 h-4">
                      <path d="M64.39,2,80.11,38.76,120,42.33a3.2,3.2,0,0,1,1.83,5.59h0L91.64,74.25l8.92,39a3.2,3.2,0,0,1-4.87,3.4L61.44,96.19,27.09,116.73a3.2,3.2,0,0,1-4.76-3.46h0l8.92-39L1.09,47.92A3.2,3.2,0,0,1,3,42.32l39.74-3.56L58.49,2a3.2,3.2,0,0,1,5.9,0Z" />
                    </svg>
                  </div>
                  <p className='tracking-wide text-md font-medium ml-1'>
                    {!loading && product.rating_messages && product.rating_messages.length > 0 && (
                      (() => {
                        const totalRating = product.rating_messages.reduce((acc: number, prev: { rating: number }) => acc + prev.rating, 0);
                        const averageRating = totalRating / product.rating_messages.length;
                        return <p className='tracking-wide text-md font-medium'>{averageRating.toFixed(1)}</p>
                      })()
                    )}
                    {!loading && (!product.rating_messages || product.rating_messages.length < 1) && (
                      <p className='tracking-wide text-md font-medium'>0</p>
                    )}
                  </p>
                </div>
                <div className='bg-gray-300 rounded-md w-auto flex flex-nowrap items-center gap-1'>
                  <p className='tracking-wide text-md font-medium'>30 - 45 min</p>
                </div>
              </div>
              <div className='w-full px-[.5rem] pb-[1rem]'>
                <button
                  className='w-full bg-custom-yellow text-white font-bold py-2 rounded-md hover:bg-yellow-600 transition-colors'
                  onClick={(event) => handleAddToCartClick(event, product)}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
          {hasMore && (
            <div className="text-center mt-4">
              <button onClick={handleLoadMore} className="bg-blue-500 text-white px-4 py-2 rounded">
                Load More
              </button>
            </div>
          )}
        </div>
      )}

      {selectedProduct && (
        <SlidingAside
          isOpen={asideOpen}
          onClose={handleCloseAside}
          product={selectedProduct}
        />
      )}
    </>
  );
};

export default FoodDiv;
