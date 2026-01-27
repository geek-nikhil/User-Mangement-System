'use client';

import { Edit, Trash2 } from 'lucide-react';

export default function ProductTable({ products, onEdit, onDelete, onBuy, isAdmin }) {
    if (!products || products.length === 0) {
        return <div className="p-4 text-center text-gray-500">No products found.</div>;
    }

    return (
        <div className="overflow-x-auto bg-white rounded shadow text-gray-900">
            <table className="min-w-full text-left text-sm whitespace-nowrap">
                <thead className="uppercase tracking-wider border-b-2 dark:border-neutral-600 bg-neutral-50 border-t">
                    <tr>
                        <th className="px-6 py-4">Name</th>
                        <th className="px-6 py-4">Category</th>
                        <th className="px-6 py-4">Price</th>
                        <th className="px-6 py-4">Stock</th>
                        <th className="px-6 py-4">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product) => (
                        <tr key={product.id} className="border-b dark:border-neutral-600 hover:bg-neutral-100">
                            <td className="px-6 py-4 font-medium">{product.name}</td>
                            <td className="px-6 py-4 text-gray-500 bg-yellow-100 rounded-lg">{product.category}</td>
                            <td className="px-6 py-4 font-semibold text-green-600">${product.price}</td>
                            <td className="px-6 py-4">{product.stock}</td>
                            <td className="px-6 py-4 gap-2 flex">
                                {isAdmin ? (
                                    <>
                                        <button onClick={() => onEdit(product)} className="text-blue-600 hover:text-blue-800"><Edit size={18} /></button>
                                        <button onClick={() => onDelete(product.id)} className="text-red-600 hover:text-red-800"><Trash2 size={18} /></button>
                                    </>
                                ) : (
                                    <button 
                                        onClick={() => onBuy(product)} 
                                        disabled={product.stock <= 0}
                                        className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                                    >
                                        {product.stock > 0 ? 'Buy' : 'Out of Stock'}
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
