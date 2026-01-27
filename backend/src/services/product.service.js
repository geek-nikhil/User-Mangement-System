const supabase = require('../config/supabaseClient');

// Create Product
const createProduct = async (productData) => {
    const { data, error } = await supabase
        .from('products')
        .insert([productData])
        .select()
        .single();
    
    if (error) throw error;
    return data;
};

// Get Products with Filters, Sorting, Pagination
const getProducts = async ({ category, minPrice, maxPrice, sortBy, sortOrder, page = 1, limit = 10 }) => {
    let query = supabase
        .from('products')
        .select('*', { count: 'exact' }); // Get total count too

    // Filters
    if (category) {
        query = query.eq('category', category);
    }
    if (minPrice) {
        query = query.gte('price', minPrice);
    }
    if (maxPrice) {
        query = query.lte('price', maxPrice);
    }

    // Sorting
    // sortBy: 'price', 'created_at', etc.
    // sortOrder: 'asc' or 'desc' (default asc)
    if (sortBy) {
        query = query.order(sortBy, { ascending: sortOrder === 'asc' });
    } else {
        query = query.order('created_at', { ascending: false }); // Default new first
    }

    // Pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) throw error;
    
    return { data, count };
};

// Get Product By ID
const getProductById = async (id) => {
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();
    
    if (error) throw error;
    return data;
};

// Update Product
const updateProduct = async (id, updates) => {
    const { data, error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
    
    if (error) throw error;
    return data;
};

// Delete Product
const deleteProduct = async (id) => {
    const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
    
    if (error) throw error;
    return true;
};

module.exports = {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct
};
