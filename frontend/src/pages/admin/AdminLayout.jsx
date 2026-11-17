import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';

const NAV = [
  { to: '/admin', label: 'Dashboard', end: true },
  { to: '/admin/calendar', label: 'Calendar' },
  { to: '/admin/bookings', label: 'Bookings' },
  { to: '/admin/customers', label: 'Customers' },
  { to: '/admin/services', label: 'Services' },
  { to: '/admin/gifts', label: 'Gifted Treatments' },
  { to: '/admin/cms', label: 'Content (CMS)' },
  { to: '/admin/blog', label: 'Blog' },
  { to: '/admin/analytics', label: 'Analytics' },
  { to: '/admin/account', label: 'Account' },
];

export default function AdminLayout() {
  const { admin, logout } = useAdminAuth();
  const navigate = useNavigate();

  const linkClass = ({ isActive }) =>
    `block px-4 py-2.5 rounded-lg text-sm ${isActive ? 'bg-brass-500 text-white' : 'text-cream/70 hover:bg-white/5'}`;

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen flex bg-charcoal-50">
      <aside className="w-64 bg-charcoal-950 text-cream flex flex-col shrink-0">
        <div className="px-6 py-6 border-b border-white/10">
          <p className="font-display text-lg">KNEAD ME</p>
          <p className="text-xs text-brass-400 tracking-wider uppercase">Admin Panel</p>
        </div>
        <nav className="flex-1 px-3 py-6 space-y-1">
          {NAV.map((n) => (
            <NavLink key={n.to} to={n.to} end={n.end} className={linkClass}>{n.label}</NavLink>
          ))}
        </nav>
        <div className="px-6 py-4 border-t border-white/10">
          <p className="text-xs text-cream/50 mb-2">{admin?.email}</p>
          <button onClick={handleLogout} className="text-sm text-red-400 hover:text-red-300">Log Out</button>
        </div>
      </aside>
      <main className="flex-1 p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
