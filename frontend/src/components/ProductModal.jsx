'use client';

import { useState, useEffect } from 'react';

export default function ProductModal({ isOpen, onClose, onSubmit, initialData }) {
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        category: '',
        stock: '',
        description: ''
    });

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        } else {
            setFormData({ name: '', price: '', category: '', stock: '', description: '' });
        }
    }, [initialData, isOpen]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 text-gray-900">
                <h2 className="text-xl font-bold mb-4">{initialData ? 'Edit Product' : 'Add Product'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Name</label>
                        <input name="name" value={formData.name} onChange={handleChange} required className="w-full border rounded p-2" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Price</label>
                            <input name="price" type="number" step="0.01" min="0" value={formData.price} onChange={handleChange} required className="w-full border rounded p-2 text-gray-900" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Category</label>
                            <select name="category" value={formData.category} onChange={handleChange} required className="w-full border rounded p-2 text-gray-900">
                                <option value="">Select Category</option>
                                <option value="Electronics">Electronics</option>
                                <option value="Clothing">Clothing</option>
                                <option value="Books">Books</option>
                                <option value="Home">Home</option>
                                <option value="Toys">Toys</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Stock</label>
                        <input name="stock" type="number" value={formData.stock} onChange={handleChange} className="w-full border rounded p-2" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Description</label>
                        <textarea name="description" value={formData.description} onChange={handleChange} className="w-full border rounded p-2" rows="3" />
                    </div>
                    <div className="flex justify-end gap-2 mt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Cancel</button>
                        <button type="submit" className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded">Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
