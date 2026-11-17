import { Link } from 'react-router-dom';
import { useSiteSettings } from '../api/cms';

const DEFAULT_SETTINGS = {
  contact: { phone: '07900 313484', email: 'you@kneadme.co.uk', address: 'KNEAD ME, 93 Botley Road, Oxford, OX2 9JQ' },
  links: { corporateUrl: 'https://corporate.kneadme.co.uk' },
};

export default function Footer() {
  const settings = useSiteSettings(DEFAULT_SETTINGS);

  return (
    <footer className="bg-charcoal-950 text-cream/80 px-6 md:px-12 lg:px-20 pt-16 pb-8">
      <div className="grid md:grid-cols-4 gap-10 pb-12 border-b border-white/10">
        <div>
          <span className="font-display text-xl text-cream">KNEAD ME</span>
          <p className="text-xs tracking-[0.2em] uppercase text-brass-500 mt-1">Massage &amp; Wellness Clinic</p>
          <p className="mt-4 text-sm text-cream/60 max-w-xs">
            Professional, evidence-based massage therapy in Oxford focused on clinical wellness and recovery.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-cream mb-3">Quick Links</h4>
          <ul className="space-y-2 text-sm text-cream/60">
            <li><Link to="/treatments" className="hover:text-brass-400">Treatments</Link></li>
            <li><Link to="/about" className="hover:text-brass-400">About</Link></li>
            <li><Link to="/gift-a-treatment" className="hover:text-brass-400">Gift a Treatment</Link></li>
            <li><a href={settings.links.corporateUrl} target="_blank" rel="noreferrer" className="hover:text-brass-400">Corporate ↗</a></li>
            <li><Link to="/blog" className="hover:text-brass-400">Blog</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-cream mb-3">Contact</h4>
          <ul className="space-y-2 text-sm text-cream/60">
            <li>{settings.contact.address}</li>
            <li>{settings.contact.phone}</li>
            <li>{settings.contact.email}</li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-cream mb-3">Book Now</h4>
          <Link to="/treatments" className="btn-accent inline-flex">Book Appointment</Link>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6">
        <p className="text-xs text-cream/40">
          &copy; {new Date().getFullYear()} Knead Me Massage &amp; Wellness Clinic. All rights reserved.
        </p>
        <div className="flex gap-4 text-xs text-cream/40">
          <Link to="/privacy-policy" className="hover:text-brass-400">Privacy Policy</Link>
          <Link to="/terms-conditions" className="hover:text-brass-400">Terms &amp; Conditions</Link>
          <Link to="/refund-policy" className="hover:text-brass-400">Refund Policy</Link>
        </div>
      </div>
    </footer>
  );
}
