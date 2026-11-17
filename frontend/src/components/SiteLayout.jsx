import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import ScrollToTop from './ScrollToTop';
import Footer from './Footer';
import WhatsAppButton from './WhatsAppButton';

export default function SiteLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <ScrollToTop />
      <Navbar />
      <main className="flex-1 pt-[96px]">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
