import HeaderWithNav from '@/app/components/header/HeaderWithNav';
import FooterLayout from '@/app/components/footerLayouts/FooterLayout';
import grabComboById from "./comboComponents/grabComboById";
import { notFound } from 'next/navigation';
import ProductImages from '@/app/product/[id]/idComponents/ProductImages';
import grabRestaurantName from '@/app/product/[id]/idComponents/grabRestaurantName';
import SuggestionProducts from '@/app/product/[id]/idComponents/suggestionProducts';
import ComboDescAndReviews from './comboComponents/ComboDescAndReviews';
import ComboInfo from './comboComponents/ComboInfo';
import BreadCrums from './comboComponents/BreadCrums';

interface Product {
    id: string;
    product_name: string;
    finalUrls: any[];
    description: string;
    price_size: { price: number }[];
}

export async function generateMetadata({ params }: { params: { id: string } }) {
    const product = await grabComboById(params.id);
    if (!product) {
        return { title: 'Product Not Found' };
    }
    console.log(product);
    return product;
}

export default async function ProductPage({ params }: { params: { id: string } }) {
    const product = await grabComboById(params.id);

    if (!product) {
        notFound();
    }

    const restaurantName = await grabRestaurantName(product?.[0]?.email);

    if (!restaurantName) {
        return notFound();
    }

    return (
        <div>
            <HeaderWithNav />
            <main className='container mx-auto px-4 md:px-8'>
                {/* Main Layout */}
                <div className='flex flex-col lg:flex-row gap-6'>
                    {/* Left Side: Product Images, Info, and Description */}
                    <div className='flex-1 flex flex-col gap-6'>
                        <BreadCrums
                            textOne="Home"
                            linkOne="/"
                            textTwo={product[0]?.origin[0]?.filter}
                            linkTwo="#"
                            textThree={restaurantName.name}
                            linkThree="#"
                            textFour="Combos"
                            linkFour="#"
                            textFive={product[0]?.combo_name}
                            linkFive="#"
                            activeFive={true}
                        />
                        <div className='flex flex-col lg:flex-row gap-6'>
                            {/* Product Images and Product Info */}
                            <div className='flex-1'>
                                <ProductImages images={product?.[0]?.finalUrls} />
                            </div>
                            <div className='flex-1'>
                                <ComboInfo
                                    comboName={product[0]?.combo_name}
                                    reviews={product[0]?.rating_messages}
                                    currentPrice={product[0]?.price}
                                    discountAmount={product[0]?.discount_amount}
                                    discountPrice={product[0]?.active_discount_price}
                                    ogPrice={product[0]?.price}
                                    active={product[0]?.active}
                                    activeDiscount={product[0]?.active_discount}
                                    origin={product[0]?.origin[0]?.filter}
                                    comboItemArr={product[0]?.combo_items}
                                    rating={product[0]?.rating}
                                    ogName={product[0]?.ogName}
                                    itemId={product[0]?.id}
                                    creatorEmail={product[0]?.email}
                                    firstImgUrl={product?.[0]?.finalUrls[0]}
                                />
                            </div>
                        </div>

                        {/* Product Description and Reviews */}
                        <div className='flex-1'>
                            <ComboDescAndReviews
                                description={product[0]?.combo_desc}
                                reviewAmount={product[0]?.rating === "-" ? "0" : product[0]?.rating}
                                reviews={product[0]?.rating_messages} // Pass the reviews array
                                productEmail={product?.[0]?.email}
                                productName={product?.[0]?.ogName}
                            />
                        </div>
                    </div>
                </div>

                {/* Other products from the restaurant */}
                <div className='mt-10'>
                    <h1 className="text-3xl font-semibold mb-4 text-center">
                        Other products from {restaurantName.name}
                    </h1>
                    <SuggestionProducts userEmail={product?.[0]?.email} />
                </div>
            </main>
            <FooterLayout />
        </div>
    );
}
