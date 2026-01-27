const supabase = require('./src/config/supabaseClient');

const SEED_COUNT = 100000;
const BATCH_SIZE = 1000;

const seedTransactions = async () => {
    console.log(`Starting seed of ${SEED_COUNT} transactions...`);
    const startTime = Date.now();

    try {
        // Generate mock data in batches
        for (let i = 0; i < SEED_COUNT; i += BATCH_SIZE) {
            const batch = [];
            for (let j = 0; j < BATCH_SIZE; j++) {
                batch.push({
                    user_id: null, // For simplicity in this test, or allow valid UUIDs if needed
                    amount: (Math.random() * 1000).toFixed(2),
                    status: Math.random() > 0.1 ? 'completed' : 'failed', // 90% success
                    created_at: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString() // Random past date
                });
            }

            const { error } = await supabase.from('transactions').insert(batch);
            if (error) {
                console.error('Error inserting batch:', error);
                // process.exit(1); // Optional: stop on error
            }
            
            // Log progress
            if ((i + BATCH_SIZE) % 10000 === 0) {
                console.log(`Inserted ${i + BATCH_SIZE} records...`);
            }
        }

        const duration = (Date.now() - startTime) / 1000;
        console.log(`Seeding completed in ${duration}s`);

    } catch (err) {
        console.error('Seeding failed:', err);
    }
};

seedTransactions();
