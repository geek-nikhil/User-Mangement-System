'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

export default function BuyModal({ isOpen, onClose, product, onConfirm }) {
    const [quantity, setQuantity] = useState(1);

    if (!isOpen || !product) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onConfirm(product, quantity);
        setQuantity(1); // Reset
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
                <div className="flex justify-between items-center p-4 border-b bg-gray-50">
                    <h2 className="text-xl font-semibold text-gray-800">Buy Product</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition-colors">
                        <X size={20} />
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <h3 className="text-lg font-medium text-gray-900">{product.name}</h3>
                        <p className="text-sm text-gray-500">Price: ${product.price}</p>
                        <p className="text-sm text-gray-500">Available Stock: {product.stock}</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                        <input 
                            type="number" 
                            min="1" 
                            max={product.stock}
                            value={quantity}
                            onChange={(e) => setQuantity(parseInt(e.target.value) || '')}
                            className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900"
                            required 
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <button 
                            type="button" 
                            onClick={onClose}
                            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-medium shadow-sm"
                            disabled={!quantity || quantity < 1 || quantity > product.stock}
                        >
                            Confirm Purchase
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
