const supabase = require('../src/config/supabaseClient');

const checkUsers = async () => {
    console.log('Connecting to Supabase...');
    try {
        const { data, error } = await supabase
            .from('users')
            .select('id, email, role, created_at');

        if (error) {
            console.error('Error fetching users:', error);
            return;
        }

        console.log('Users found count:', data ? data.length : 0);
        if (data && data.length > 0) {
            data.forEach(u => {
                console.log(`[${u.email}]`);
            });
        } else {
            console.log('No users found in the database. Ensure you have signed up first.');
        }

    } catch (err) {
        console.error('Unexpected error:', err);
    }
};

checkUsers();
