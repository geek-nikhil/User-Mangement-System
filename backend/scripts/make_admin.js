const supabase = require('../src/config/supabaseClient');

const makeAdmin = async (email) => {
    if (!email) {
        console.error('Please provide an email address.');
        console.log('Usage: node scripts/make_admin.js <email>');
        process.exit(1);
    }

    try {
        const { data, error } = await supabase
            .from('users')
            .update({ role: 'admin' })
            .eq('email', email)
            .select();

        if (error) {
            console.error('Error updating user:', error);
            return;
        }

        if (data.length === 0) {
            console.log(`No user found with email: ${email}`);
        } else {
            console.log(`Successfully upgraded ${email} to admin.`);
            console.table(data);
        }

    } catch (err) {
        console.error('Unexpected error:', err);
    }
};

const email = process.argv[2];
makeAdmin(email);
