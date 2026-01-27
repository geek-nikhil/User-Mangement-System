'use client';

export default function TransactionTable({ transactions }) {
    if (!transactions || transactions.length === 0) {
        return <div className="p-4 text-center text-gray-500">No transactions found.</div>;
    }

    // Helper to format status color
    const getStatusColor = (status) => {
        switch (status) {
            case 'completed': return 'bg-green-100 text-green-800';
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'failed': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="overflow-x-auto bg-white rounded shadow text-gray-900">
            <table className="min-w-full text-left text-sm whitespace-nowrap">
                <thead className="uppercase tracking-wider border-b-2 dark:border-neutral-600 bg-neutral-50 border-t">
                    <tr>
                        <th className="px-6 py-4">ID</th>
                        <th className="px-6 py-4">User</th>
                        <th className="px-6 py-4">Amount</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4">Date</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.map((tx) => (
                        <tr key={tx.id} className="border-b dark:border-neutral-600 hover:bg-neutral-100">
                            <td className="px-6 py-4 font-mono text-xs">{tx.id.slice(0, 8)}...</td>
                            <td className="px-6 py-4">
                                <div className="font-medium">{tx.users?.name || 'Unknown'}</div>
                                <div className="text-xs text-gray-500">{tx.users?.email}</div>
                            </td>
                            <td className="px-6 py-4 font-semibold text-gray-700">${tx.amount}</td>
                            <td className="px-6 py-4">
                                <span className={`px-2 py-1 rounded text-xs ${getStatusColor(tx.status)}`}>
                                    {tx.status}
                                </span>
                            </td>
                            <td className="px-6 py-4">{new Date(tx.created_at).toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
