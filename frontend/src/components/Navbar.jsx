import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSiteSettings } from '../api/cms';

const DEFAULT_SETTINGS = {
  contact: { phone: '07900 313484', email: 'you@kneadme.co.uk', address: 'KNEAD ME, 93 Botley Road, Oxford, OX2 9JQ' },
  links: { corporateUrl: 'https://corporate.kneadme.co.uk' },
};

const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Treatments', to: '/treatments' },
  { label: 'Massage Benefits', to: '/massage-benefits' },
  { label: 'What Knead Me Treats', to: '/what-knead-me-treats' },
  { label: 'Meet Your Therapist', to: '/meet-your-therapist' },
  { label: 'Gift a Treatment', to: '/gift-a-treatment' },
  { label: 'Corporate', corporate: true },
  { label: 'Blog', to: '/blog' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const settings = useSiteSettings(DEFAULT_SETTINGS);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-cream/90 backdrop-blur-sm border-b border-charcoal-900/5">
        <div className="grid grid-cols-[auto_1fr_auto] items-center gap-4 px-6 md:px-12 py-3">
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <img src="/logo.png" alt="Knead Me Massage & Wellness Clinic" className="h-20 w-20 rounded-full object-cover" />
            <span className="hidden sm:inline text-[19px] font-display text-brass-600">
              Knead Me®
            </span>
          </Link>

          <nav className="hidden lg:flex items-center justify-center gap-6">
            {NAV_LINKS.map((link) =>
              link.corporate ? (
                <a
                  key={link.label}
                  href={settings.links.corporateUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-charcoal-900/70 hover:text-charcoal-900"
                >
                  {link.label}
                </a>
              ) : (
                <NavLink
                  key={link.label}
                  to={link.to}
                  className={({ isActive }) =>
                    `text-sm ${isActive ? 'text-charcoal-900 font-medium' : 'text-charcoal-900/70'} hover:text-charcoal-900`
                  }
                >
                  {link.label}
                </NavLink>
              )
            )}
          </nav>

          <div className="flex items-center gap-4 justify-self-end">
            <Link to="/account" className="hidden md:inline text-sm text-charcoal-900/70 hover:text-charcoal-900">
              {user ? `Hi, ${user.name.split(' ')[0]}` : 'Sign in'}
            </Link>
            <Link to="/treatments" className="btn-primary hidden sm:inline-flex">
              Book Appointment
            </Link>
            <button
              aria-label="Open menu"
              onClick={() => setOpen(true)}
              className="flex flex-col gap-1.5 p-2"
            >
              <span className="block w-7 h-[2px] bg-charcoal-900" />
              <span className="block w-7 h-[2px] bg-charcoal-900" />
            </button>
          </div>
        </div>
      </header>

      {/* Full-screen big menu overlay */}
      <div
        className={`fixed inset-0 z-[60] bg-charcoal-950 text-cream transition-transform duration-500 ease-in-out overflow-y-auto ${
          open ? 'translate-y-0' : '-translate-y-full pointer-events-none'
        }`}
      >
        <div className="flex items-center justify-between px-6 md:px-12 py-4 border-b border-white/10 sticky top-0 bg-charcoal-950 z-10">
          <span className="font-display text-xl tracking-wide">KNEAD ME</span>
          <button aria-label="Close menu" onClick={() => setOpen(false)} className="text-3xl leading-none w-10 h-10 flex items-center justify-center hover:text-brass-400">
            &times;
          </button>
        </div>

        <nav className="flex flex-col md:flex-row md:items-start md:justify-between px-6 md:px-16 py-10 md:py-16 gap-10 md:gap-12">
          <ul className="space-y-1 md:space-y-2 md:max-w-xl w-full">
            {NAV_LINKS.map((link, i) => (
              <li key={link.label} className="border-b border-white/5 md:border-none">
                {link.corporate ? (
                  <a
                    href={settings.links.corporateUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex items-center gap-3 md:gap-5 font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light hover:text-brass-500 transition-colors py-2.5 md:py-3 leading-tight"
                  >
                    <span className="text-xs md:text-sm text-white/30 font-body shrink-0">{String(i + 1).padStart(2, '0')}</span>
                    <span className="break-words">{link.label}</span>
                    <span className="text-sm text-white/30 self-start mt-2">↗</span>
                  </a>
                ) : (
                  <NavLink
                    to={link.to}
                    onClick={() => setOpen(false)}
                    className="group flex items-center gap-3 md:gap-5 font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light hover:text-brass-500 transition-colors py-2.5 md:py-3 leading-tight"
                  >
                    <span className="text-xs md:text-sm text-white/30 font-body shrink-0">{String(i + 1).padStart(2, '0')}</span>
                    <span className="break-words">{link.label}</span>
                  </NavLink>
                )}
              </li>
            ))}
          </ul>

          <div className="max-w-xs w-full space-y-6 shrink-0">
            <Link to="/treatments" onClick={() => setOpen(false)} className="btn-accent w-full">
              Book Appointment
            </Link>
            <Link to="/account" onClick={() => setOpen(false)} className="btn-secondary w-full !text-cream !border-white/30">
              {user ? 'My Account' : 'Sign In / Sign Up'}
            </Link>
            <div className="pt-6 border-t border-white/10 text-sm text-white/60 space-y-1">
              <p>{settings.contact.address}</p>
              <p>{settings.contact.phone}</p>
              <p>{settings.contact.email}</p>
            </div>
          </div>
        </nav>
      </div>
    </>
  );
}