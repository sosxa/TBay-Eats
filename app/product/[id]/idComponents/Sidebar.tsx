import React, { useState, useEffect } from 'react';
import { XMarkIcon, TrashIcon, PencilIcon } from '@heroicons/react/24/outline';
import { CartItem } from './CartItem';
import CheckoutModal from './CheckOutModal';
import { useRouter } from 'next/navigation';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
    cartItems: CartItem[];
    onRemoveItem: (itemId: string) => void;
    onUpdateItemQuantity: (itemId: string, quantity: number) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
    isOpen,
    onClose,
    cartItems,
    onRemoveItem,
    onUpdateItemQuantity
}) => {
    const [editableItemId, setEditableItemId] = useState<string | null>(null);
    const [tempQuantity, setTempQuantity] = useState<number | null>(null);
    const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
    const router = useRouter();

    useEffect(() => {
        // Toggle no-scroll class on body based on sidebar state
        if (isOpen) {
            document.body.classList.add('no-scroll');
        } else {
            document.body.classList.remove('no-scroll');
        }

        return () => {
            document.body.classList.remove('no-scroll');
        };
    }, [isOpen]);

    const handleQuantityChange = (itemId: string, newQuantity: number) => {
        // Ensure quantity is between 1 and 100
        if (newQuantity < 1) newQuantity = 1;
        if (newQuantity > 100) newQuantity = 100;
        onUpdateItemQuantity(itemId, newQuantity);
    };

    const handleEditClick = (itemId: string, currentQuantity: number) => {
        setEditableItemId(itemId);
        setTempQuantity(currentQuantity);
    };

    const handleSaveClick = (itemId: string) => {
        if (tempQuantity !== null) {
            handleQuantityChange(itemId, tempQuantity);
        }
        setEditableItemId(null);
        setTempQuantity(null);
    };

    const handleCancelClick = () => {
        setEditableItemId(null);
        setTempQuantity(null);
    };

    const openCheckoutModal = () => setIsCheckoutOpen(true);
    const closeCheckoutModal = () => setIsCheckoutOpen(false);

    const handleRedirect = () => router.push('/checkout');

    const handleOverlayClick = () => onClose();

    const isCartEmpty = cartItems.length === 0;

    return (
        <div>
            {/* Background overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black opacity-50 z-40"
                    onClick={handleOverlayClick}
                    aria-hidden="true"
                />
            )}

            {/* Sidebar */}
            <div
                className={`fixed top-0 right-0 h-full bg-gray-800 bg-opacity-75 transition-transform transform ${isOpen ? 'translate-x-0 z-50' : 'translate-x-full'} w-80`}
            >
                <div className="relative bg-white h-full p-6 flex flex-col">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                    >
                        <XMarkIcon className="h-6 w-6" />
                    </button>
                    <h2 className="text-xl font-semibold mb-4">Cart Items</h2>
                    <ul className="flex-1 overflow-y-auto">
                        {cartItems.length === 0 ? (
                            <li className="text-gray-600">Your cart is empty.</li>
                        ) : (
                            cartItems.map(item => {
                                const quantity = editableItemId === item.itemId ? tempQuantity ?? item.quantity : item.quantity;
                                const itemPrice = item.activeDiscount ? parseFloat(item.discountPrice) : parseFloat(item.price);
                                const dynamicPrice = (itemPrice * quantity).toFixed(2);

                                return (
                                    <li key={item.itemId} className="border-b border-gray-200 py-2 flex items-center">
                                        <img
                                            src={item.firstImgUrl}
                                            alt={item.itemName}
                                            className="w-16 h-16 object-cover mr-4"
                                        />
                                        <div className="flex-1">
                                            <p className="font-medium">{item.itemName}</p>
                                            <p className="text-gray-600">{item.filter} food</p>
                                            <p className="text-gray-700">${dynamicPrice} {item.activeDiscount && `(%${item.discountAmount} off)`}</p>

                                            <div className="flex items-center space-x-2">
                                                {editableItemId === item.itemId ? (
                                                    <>
                                                        <input
                                                            type="number"
                                                            value={tempQuantity ?? ''}
                                                            min="1"
                                                            max="100"
                                                            onChange={(e) => setTempQuantity(Number(e.target.value))}
                                                            className="w-16 text-center border border-gray-300"
                                                        />
                                                        <button
                                                            onClick={() => handleSaveClick(item.itemId)}
                                                            className="bg-green-500 text-white p-1 rounded-lg hover:bg-green-600"
                                                        >
                                                            Save
                                                        </button>
                                                        <button
                                                            onClick={handleCancelClick}
                                                            className="bg-red-500 text-white p-1 rounded-lg hover:bg-red-600"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <p className="text-gray-700">Quantity: {item.quantity}</p>
                                                        <button
                                                            onClick={() => handleEditClick(item.itemId, item.quantity)}
                                                            className="ml-2 text-blue-500 hover:text-blue-700"
                                                        >
                                                            <PencilIcon className="h-5 w-5" />
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => onRemoveItem(item.itemId)}
                                            className="ml-4 text-red-500 hover:text-red-700"
                                        >
                                            <TrashIcon className="h-6 w-6" />
                                        </button>
                                    </li>
                                );
                            })
                        )}
                    </ul>
                    <button
                        onClick={handleRedirect}
                        disabled={isCartEmpty}
                        className={`mt-auto py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-green ${isCartEmpty ? 'bg-gray-400 cursor-not-allowed' : 'bg-custom-green text-white hover:bg-custom-dark-green'}`}
                    >
                        Checkout
                    </button>
                </div>
                <CheckoutModal isOpen={isCheckoutOpen} onClose={closeCheckoutModal} />
            </div>
        </div>
    );
};

export default Sidebar;
