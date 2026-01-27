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

// Get Transactions (Paginated)
const getTransactions = async (page = 1, limit = 10, filters = {}) => {
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    const { month, year, sort } = filters;

    let query = supabase
        .from('transactions')
        .select('*, users(name, email)', { count: 'exact' });

    // Apply Date Filters
    if (month && year) {
        // Construct start and end dates for the month
        // month is 1-12
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
    const isAscending = sort === 'oldest'; // Default is newest (desc)
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
    createTransaction
};
