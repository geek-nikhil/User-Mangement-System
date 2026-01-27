'use client';

import { useState, useEffect, useCallback } from 'react';
import ProtectedRoute from '../../components/ProtectedRoute';
import ProductTable from '../../components/ProductTable';
import ProductModal from '../../components/ProductModal';
import BuyModal from '../../components/BuyModal';
import useAuth from '../../hooks/useAuth';
import Navbar from '../../components/Navbar';
import api from '../../utils/api';
import { Plus } from 'lucide-react';

export default function ProductsPage() {
    const { user } = useAuth();
    const isAdmin = user?.role === 'admin';

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({ category: '', minPrice: '', maxPrice: '', sortBy: 'created_at' });
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    
    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    // Buy Modal State
    const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);
    const [selectedProductToBuy, setSelectedProductToBuy] = useState(null);

    // Fetch Products
    // useCallback prevents re-creation on every render, optimizing dependency chain for useEffect
    const fetchProducts = useCallback(async () => {
        setLoading(true);
        try {
            const params = { ...filters, page, limit: 10 };
            const res = await api.get('/products', { params });
            if (res.data.success) {
                setProducts(res.data.data.products);
                setTotalPages(res.data.data.totalPages);
            }
        } catch (error) {
            console.error('Fetch error:', error);
        } finally {
            setLoading(false);
        }
    }, [filters, page]); // Dependencies: re-fetch if filters or page changes

    useEffect(() => {
        if (user) {
            fetchProducts();
        }
    }, [fetchProducts, user]);

    // Handlers
    const handleFilterChange = (e) => {
        setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
        setPage(1); // Reset to first page
    };

    const handleCreate = () => {
        setEditingProduct(null);
        setIsModalOpen(true);
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this product?')) return;
        try {
            await api.delete(`/products/${id}`);
            fetchProducts(); // Refresh
        } catch (error) {
            alert('Delete failed');
        }
    };

    const handleFormSubmit = async (data) => {
        try {
            if (editingProduct) {
                await api.put(`/products/${editingProduct.id}`, data);
            } else {
                await api.post('/products', data);
            }
            setIsModalOpen(false);
            fetchProducts();
        } catch (error) {
            alert('Operation failed');
        }
    };

    const handleBuy = (product) => {
        setSelectedProductToBuy(product);
        setIsBuyModalOpen(true);
    };

    const handleConfirmPurchase = async (product, quantity) => {
        try {
            setLoading(true);
            await api.post('/transactions/buy', { productId: product.id, quantity });
            alert("Purchase successful!");
            setIsBuyModalOpen(false);
            fetchProducts(); // Refresh to show updated stock
        } catch (error) {
            alert(error.response?.data?.message || "Purchase failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-gray-50 pb-8 text-gray-900">
                <Navbar />
                <div className="px-8 max-w-7xl mx-auto">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold">Products Management</h1>
                        {isAdmin && (
                            <button onClick={handleCreate} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                                <Plus size={20} /> Add Product
                            </button>
                        )}
                    </div>

                    {/* Filters */}
                    <div className="bg-white p-4 rounded shadow mb-6 flex flex-wrap gap-4">
                        <select name="category" value={filters.category} onChange={handleFilterChange} className="border p-2 rounded text-gray-900">
                            <option value="">All Categories</option>
                            <option value="Electronics">Electronics</option>
                            <option value="Clothing">Clothing</option>
                            <option value="Books">Books</option>
                            <option value="Home">Home</option>
                            <option value="Toys">Toys</option>
                        </select>
                        <input 
                            name="minPrice" 
                            placeholder="Min Price" 
                            type="number" 
                            min="0"
                            onInput={(e) => e.target.value = e.target.value < 0 ? 0 : e.target.value}
                            value={filters.minPrice} 
                            onChange={handleFilterChange} 
                            className="border p-2 rounded text-gray-900 placeholder-gray-500" 
                        />
                        <input 
                            name="maxPrice" 
                            placeholder="Max Price" 
                            type="number" 
                            min="0"
                            onInput={(e) => e.target.value = e.target.value < 0 ? 0 : e.target.value}
                            value={filters.maxPrice} 
                            onChange={handleFilterChange} 
                            className="border p-2 rounded text-gray-900 placeholder-gray-500" 
                        />
                        <select name="sortBy" value={filters.sortBy} onChange={handleFilterChange} className="border p-2 rounded text-gray-900">
                            <option value="created_at">Newest</option>
                            <option value="price">Price</option>
                        </select>
                    </div>

                    {loading ? (
                        <div className="text-gray-700">Loading...</div>
                    ) : (
                        <>
                            <ProductTable products={products} isAdmin={isAdmin} onEdit={handleEdit} onDelete={handleDelete} onBuy={handleBuy} />
                            
                            {/* Pagination */}
                            <div className="mt-4 flex justify-center gap-2 text-gray-800">
                                <button 
                                    disabled={page === 1} 
                                    onClick={() => setPage(page - 1)}
                                    className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300"
                                >
                                    Previous
                                </button>
                                <span className="self-center">Page {page} of {totalPages}</span>
                                <button 
                                    disabled={page === totalPages} 
                                    onClick={() => setPage(page + 1)}
                                    className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300"
                                >
                                    Next
                                </button>
                            </div>
                        </>
                    )}


                </div>
                <ProductModal 
                    isOpen={isModalOpen} 
                    onClose={() => setIsModalOpen(false)} 
                    onSubmit={handleFormSubmit} 
                    initialData={editingProduct} 
                />
                
                <BuyModal 
                    isOpen={isBuyModalOpen}
                    onClose={() => setIsBuyModalOpen(false)}
                    product={selectedProductToBuy}
                    onConfirm={handleConfirmPurchase}
                />
            </div>
        </ProtectedRoute>
    );
}
