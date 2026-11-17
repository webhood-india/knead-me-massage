import { useEffect, useState } from 'react';
import { adminApi } from '../../api/client';

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.get('/customers').then((res) => setCustomers(res.data.customers)).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="text-2xl mb-6">Customers</h1>
      {loading && <p className="text-charcoal-900/50">Loading...</p>}

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-charcoal-900/50 border-b border-charcoal-900/5">
              <th className="px-5 py-3">Name</th>
              <th className="px-5 py-3">Email</th>
              <th className="px-5 py-3">Phone</th>
              <th className="px-5 py-3">Total Bookings</th>
              <th className="px-5 py-3">Total Spend</th>
              <th className="px-5 py-3">Joined</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c._id} className="border-b border-charcoal-900/5 last:border-0">
                <td className="px-5 py-3">{c.name}</td>
                <td className="px-5 py-3">{c.email}</td>
                <td className="px-5 py-3">{c.phone || '-'}</td>
                <td className="px-5 py-3">{c.totalBookings}</td>
                <td className="px-5 py-3">£{c.totalSpend.toFixed(2)}</td>
                <td className="px-5 py-3">{new Date(c.createdAt).toLocaleDateString('en-GB')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
