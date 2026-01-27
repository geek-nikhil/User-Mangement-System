const supabase = require('../config/supabaseClient');

// Create a new user
const createUser = async (userData) => {
    // We expect { name, email, password, role }
    const { data, error } = await supabase
        .from('users')
        .insert([userData])
        .select()
        .single();
    
    if (error) throw error;
    return data;
};

// Find user by email
const findUserByEmail = async (email) => {
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

    // specific error for no rows logic can be handled in controller or here
    // Supabase returns error code PGRST116 for no rows found on single()
    if (error && error.code !== 'PGRST116') throw error;
    return data;
};

// Find user by ID
const findUserById = async (id) => {
    const { data, error } = await supabase
        .from('users')
        .select('id, name, email, role, created_at') // Exclude password
        .eq('id', id)
        .single();
    
    if (error) throw error;
    return data;
};

// Get all users (for admin)
const getAllUsers = async () => {
    const { data, error } = await supabase
        .from('users')
        .select('id, name, email, role, created_at')
        .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
};

// Update user
const updateUser = async (id, updates) => {
    const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', id)
        .select('id, name, email, role')
        .single();
    
    if (error) throw error;
    return data;
};

// Delete user
const deleteUser = async (id) => {
    const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', id);
    
    if (error) throw error;
    return true;
};

module.exports = {
    createUser,
    findUserByEmail,
    findUserById,
    getAllUsers,
    updateUser,
    deleteUser
};
