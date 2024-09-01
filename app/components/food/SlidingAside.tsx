import React, { useEffect } from 'react';

interface SlidingAsideProps {
    isOpen: boolean;
    onClose: () => void;
    product: any;
}

const SlidingAside: React.FC<SlidingAsideProps> = ({ isOpen, onClose, product }) => {
    // Ensure product has required properties
    const isProduct = product.product_name !== undefined;
    const isCombo = product.combo_name !== undefined;

    useEffect(() => {
        // Add or remove the "no-scroll" class on body based on sidebar state
        if (isOpen) {
            document.body.classList.add('no-scroll');
        } else {
            document.body.classList.remove('no-scroll');
        }

        // Cleanup on component unmount
        return () => {
            document.body.classList.remove('no-scroll');
        };
    }, [isOpen]);

    return (
        <div>
            {/* Background overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black opacity-50 z-40"
                    onClick={onClose}
                    aria-hidden="true" // Improve accessibility by hiding from screen readers
                />
            )}

            {/* Sliding aside */}
            <div
                className={`fixed top-0 right-0 w-80 h-full bg-white shadow-lg transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0 z-50' : 'translate-x-full'}`}
                aria-hidden={!isOpen} // Improve accessibility by hiding content off-screen
            >
                <button
                    className="absolute top-4 right-4 text-xl font-bold text-gray-600"
                    onClick={onClose}
                    aria-label="Close"
                >
                    &times;
                </button>
                <div className="p-4">
                    {isProduct && (
                        <>
                            <h2 className="text-xl font-semibold mt-4">Successfully added product to cart</h2>
                            <p className="text-gray-600 mb-2">{product.type}</p>
                            <img src={product.finalUrl} alt={product.product_name} className="w-full h-48 object-cover mb-4 rounded" />
                            <h3 className="text-lg font-medium mb-2">{product.product_name}</h3>
                            {product.active_discount ? (
                                <>
                                    <p className="text-lg font-semibold">
                                        ${product.discount_price_size[0].price} ({product.discount_amount}% off)
                                    </p>
                                    <p>Size: {product.discount_price_size[0].size}</p>
                                </>
                            ) : (
                                <>
                                    <p className="text-lg font-semibold">${product.price_size[0].price}</p>
                                    <p>Size: {product.price_size[0].size}</p>
                                </>
                            )}
                        </>
                    )}

                    {isCombo && (
                        <>
                            <h2 className="text-xl font-semibold mt-4">Successfully added combo to cart</h2>
                            <p className="text-gray-600 mb-2">{product.type}</p>
                            <img src={product.finalUrl} alt={product.combo_name} className="w-full h-48 object-cover mb-4 rounded" />
                            <h3 className="text-lg font-medium mb-2">{product.combo_name}</h3>
                            {product.active_discount ? (
                                <p className="text-lg font-semibold">
                                    ${product.active_discount_price} ({product.discount_amount}% off)
                                </p>
                            ) : (
                                <p className="text-lg font-semibold">${product.price}</p>
                            )}
                            <p className="font-medium mt-4">Items:</p>
                            <ul className="list-disc ml-5">
                                {product.combo_items.map((item: any, index: number) => (
                                    <li key={index} className="text-gray-600">{item.label}</li>
                                ))}
                            </ul>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SlidingAside;
