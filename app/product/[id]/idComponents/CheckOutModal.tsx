import React from 'react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose }) => {
  return (
    <div
      className={`fixed inset-0 z-50 bg-gray-800 bg-opacity-75 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      style={{ transition: 'opacity 0.3s ease-in-out' }}
    >
      <div
        className={`fixed top-0 right-0 h-full bg-white transition-transform ${isOpen ? 'transform translate-x-0' : 'transform translate-x-full'} w-3/4 max-w-screen-lg`}
        style={{ width: '75%' }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          &times;
        </button>
        <div className="p-6 h-full">
          <h2 className="text-xl font-semibold mb-4">Checkout</h2>
          {/* Add your checkout content here */}
          <p>Checkout details will go here.</p>
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;
