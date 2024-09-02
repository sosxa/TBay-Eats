'use server';
import dynamic from 'next/dynamic';
import HeaderWithNav from '@/app/components/header/HeaderWithNav';
import FooterLayout from '@/app/components/footerLayouts/FooterLayout';
import getProductById from '../getProductById';
import { notFound } from 'next/navigation';
import BreadCrums from '@/app/combo/[id]/comboComponents/BreadCrums';
import HandleRelatedCombos from './otherItems/HandleRelatedCombos';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation'

// Lazy load components
const ProductInfo = dynamic(() => import('./idComponents/ProductInfo'));
const ProductImages = dynamic(() => import('./idComponents/ProductImages'));
const ProductDescAndReviews = dynamic(() => import('./idComponents/ProductDescAndReviews'));
const ListRelatedCombos = dynamic(() => import('./otherItems/ListRelatedCombos'));
const SuggestionProducts = dynamic(() => import('./idComponents/suggestionProducts'));
import relatedComboData from './otherItems/relatedComboData';
import grabRestaurantName from './idComponents/grabRestaurantName';

interface Product {
    id: string;
    product_name: string;
    finalUrls: any[];
    description: string;
    price_size: { price: number }[];
}

export async function generateMetadata({ params }: { params: { id: string } }) {
    const product = await getProductById(params.id);
    if (!product) {
        return { title: 'Product Not Found' };
    }
    return {
        title: product[0]?.product_name || 'Product Page',
        description: product[0]?.description || 'Product details and reviews',
    };
}

export default async function ProductPage({ params }: { params: { id: string } }) {
    const product = await getProductById(params.id);

    if (!product) {
        notFound();
    }

    const restaurantInfo = await grabRestaurantName(product?.[0]?.email);

    if (!restaurantInfo) {
        return notFound();
    }
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
        redirect("/login");
    }

    const restaurantName = restaurantInfo.name;
    const restaurantId = restaurantInfo.id;

    return (
        <div className="flex flex-col min-h-screen">
            <HeaderWithNav />
            <main className="flex-grow">
                <div className="container mx-auto px-4 md:px-8">
                    {/* Breadcrumbs */}
                    <BreadCrums
                        textOne="Home"
                        linkOne="/?category=all&type=products"
                        textTwo={product[0]?.origin[0]?.filter}
                        linkTwo={`/?category=${product[0]?.origin[0]?.filter}&type=products`}
                        textThree={restaurantName}
                        linkThree={`/restaurant/${restaurantId}`}
                        textFour="Products"
                        linkFour={`/restaurant/${restaurantId}?category=all&type=products`}
                        textFive={product[0]?.product_name}
                        linkFive={`/product/${product[0]?.id}`} // Adjust this according to your routing
                        activeFive={true}
                    />

                    {/* Main Product Section */}
                    <div className="flex flex-col lg:flex-row gap-8 mt-6">
                        {/* Product Images and Info */}
                        <div className="flex-1 space-y-8">
                            <div className="flex flex-col xl:flex-row gap-6">
                                <ProductImages images={product[0]?.finalUrls} />
                                <ProductInfo
                                    productName={product[0]?.product_name}
                                    reviews={product[0]?.rating_messages === null || product[0]?.rating_messages.length === 0 ? "0" : product[0]?.rating_messages.length}
                                    currentPrice={product[0]?.price_size[0]?.price}
                                    discountAmount={product[0]?.discount_amount}
                                    discountPrice={product[0]?.discount_price_size[0]?.price}
                                    ogPrice={product[0]?.price_size[0]?.price}
                                    active={product[0]?.active}
                                    activeDiscount={product[0]?.active_discount}
                                    origin={product[0]?.origin[0]?.filter}
                                    spiceLevel={product[0]?.spice_level}
                                    sizeAndPrices={product[0]?.price_size}
                                    discountSizeAndPrices={product[0]?.discount_price_size}
                                    productId={product[0]?.id}
                                    creatorEmail={product[0]?.email}
                                    firstImg={product[0]?.finalUrls[0]}
                                />
                            </div>
                            <ProductDescAndReviews
                                description={product[0]?.desc}
                                reviewAmount={product[0]?.rating_messages === null || product[0]?.rating_messages.length === 0 ? "0" : product[0]?.rating_messages.length}
                                reviews={product[0]?.rating_messages}
                                productEmail={product[0]?.email}
                                productName={product[0]?.ogName}
                            />
                        </div>

                        {/* Conditionally render Related Combos */}
                        <HandleRelatedCombos
                            productEmail={product[0]?.email}
                            ogName={product[0]?.ogName}
                        />
                    </div>

                    {/* Suggested Products */}
                    <section className="mt-12">
                        <center>
                            <h1 className='w-full pt-8 pb-4 text-center text-black text-3xl xl:text-[2rem] font-semibold'>
                                Other products from {restaurantName}
                            </h1>
                        </center>
                        <SuggestionProducts userEmail={product[0]?.email} />
                    </section>
                </div>
            </main>
            <FooterLayout />
        </div>
    );
}
