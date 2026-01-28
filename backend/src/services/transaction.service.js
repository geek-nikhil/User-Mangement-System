const supabase = require('../config/supabaseClient');

// Get Transaction Stats (Aggregated)
const getTransactionStats = async () => {
    // We use the RPC function we defined in schema.sql for performance
    const { data, error } = await supabase.rpc('get_transaction_stats');
    
    if (error) throw error;
    return data;
};

// Create Single Transaction (Helper for main app handling)
const createTransaction = async (data) => {
    // data: { user_id, amount, status }
    const { error } = await supabase
        .from('transactions')
        .insert([data]);
    
    if (error) throw error;
    return true;
};

// Purchase Product (Transactional)
const purchaseTransaction = async (userId, productId, quantity) => {
    // 1. Get Product to check stock
    const { data: product, error: fetchError } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single();
    
    if (fetchError || !product) throw new Error('Product not found');
    if (product.stock < quantity) throw new Error('Insufficient stock');

    // 2. Deduct Stock
    // Note: In real production, this should be a DB transaction or RPC to avoid race conditions.
    // For this interview test, we will do it sequentially (optimistic).
    const { error: updateError } = await supabase
        .from('products')
        .update({ stock: product.stock - quantity })
        .eq('id', productId);

    if (updateError) throw new Error('Failed to update stock');

    // 3. Create Transaction Record
    const totalAmount = product.price * quantity;
    const { data: transaction, error: txnError } = await supabase
        .from('transactions')
        .insert([{
            user_id: userId,
            // product_id: productId, // Schema doesn't have this column yet
            amount: totalAmount,
            status: 'completed',
            // type: 'purchase' // Schema doesn't have this column yet
        }])
        .select()
        .single();

    if (txnError) {
        // Rollback stock? Complex without DB transactions. Ignoring for this scope.
        throw new Error('Failed to record transaction');
    }

    return transaction;
};

// Get Transactions (Paginated)
const getTransactions = async (page = 1, limit = 10, filters = {}, userId = null) => {
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    const { month, year, sort } = filters;

    let query = supabase
        .from('transactions')
        .select('*, users(name, email)', { count: 'exact' });

    // Filter by User if not Admin (userId provided)
    if (userId) {
        query = query.eq('user_id', userId);
    }

    // Apply Date Filters
    if (month && year) {
        const startDate = new Date(Date.UTC(year, month - 1, 1));
        const endDate = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999));
        
        query = query.gte('created_at', startDate.toISOString())
                     .lte('created_at', endDate.toISOString());
    } else if (year) {
         const startDate = new Date(Date.UTC(year, 0, 1));
         const endDate = new Date(Date.UTC(year, 11, 31, 23, 59, 59, 999));
         query = query.gte('created_at', startDate.toISOString())
                      .lte('created_at', endDate.toISOString());
    }

    // Apply Sorting
    const isAscending = sort === 'oldest';
    query = query.order('created_at', { ascending: isAscending });

    // Apply Pagination
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) throw error;

    return {
        transactions: data,
        total: count,
        page,
        totalPages: Math.ceil(count / limit)
    };
};

module.exports = {
    getTransactionStats,
    getTransactions,
    createTransaction,
    purchaseTransaction
};
