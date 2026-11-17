import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '../../api/client';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    adminApi.get('/dashboard').then((res) => setStats(res.data.stats));
  }, []);

  if (!stats) return <p className="text-charcoal-900/50">Loading dashboard...</p>;

  const cards = [
    { label: 'Revenue This Month', value: `£${stats.revenueThisMonth.toFixed(2)}` },
    { label: 'Revenue All Time', value: `£${stats.revenueAllTime.toFixed(2)}` },
    { label: 'Total Customers', value: stats.totalCustomers },
    { label: 'Total Bookings', value: stats.totalBookings },
  ];

  return (
    <div>
      <h1 className="text-2xl mb-6">Dashboard</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {cards.map((c) => (
          <div key={c.label} className="card p-5">
            <p className="text-xs text-charcoal-900/50 uppercase tracking-wide">{c.label}</p>
            <p className="font-display text-3xl mt-2">{c.value}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl">Upcoming Bookings</h2>
        <Link to="/admin/calendar" className="text-sm text-brass-600 underline">View Full Calendar →</Link>
      </div>
      <div className="card overflow-hidden">
        {stats.upcomingBookings.length === 0 && <p className="p-5 text-charcoal-900/50">No upcoming bookings.</p>}
        {stats.upcomingBookings.map((b) => (
          <div key={b._id} className="flex flex-wrap justify-between items-center gap-3 px-5 py-4 border-b border-charcoal-900/5 last:border-0">
            <div>
              <p className="font-medium">{b.service?.name}</p>
              <p className="text-xs text-charcoal-900/50">{b.customer?.name} · {b.customer?.email}</p>
            </div>
            <div className="text-sm text-charcoal-900/60">{b.date} at {b.startTime}</div>
            <span className="text-xs px-2 py-1 rounded-full bg-sage-100 text-sage-600 capitalize">{b.status.replace('_', ' ')}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
