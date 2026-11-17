import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function CustomerLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const linkClass = ({ isActive }) =>
    `block px-4 py-2.5 rounded-lg text-sm ${isActive ? 'bg-charcoal-900 text-cream' : 'text-charcoal-900/70 hover:bg-charcoal-900/5'}`;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="section grid md:grid-cols-4 gap-8">
      <aside className="md:col-span-1">
        <p className="text-sm text-charcoal-900/50 mb-4">Welcome back,</p>
        <p className="font-display text-xl mb-6">{user?.name}</p>
        <nav className="space-y-1">
          <NavLink to="/account" end className={linkClass}>My Account</NavLink>
          <NavLink to="/account/bookings" className={linkClass}>My Bookings</NavLink>
          <NavLink to="/account/payments" className={linkClass}>My Payments</NavLink>
          <NavLink to="/account/gifts" className={linkClass}>My Gifts</NavLink>
          <button onClick={handleLogout} className="block w-full text-left px-4 py-2.5 rounded-lg text-sm text-red-600 hover:bg-red-50 mt-4">
            Log Out
          </button>
        </nav>
      </aside>
      <div className="md:col-span-3">
        <Outlet />
      </div>
    </div>
  );
}
