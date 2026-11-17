import { Routes, Route } from 'react-router-dom';
import SiteLayout from './components/SiteLayout';
import { CustomerProtectedRoute, AdminProtectedRoute } from './components/ProtectedRoutes';

import Home from './pages/Home';
import WhatWeTreat from './pages/WhatWeTreat';
import CorporateMassage from './pages/CorporateMassage';
import About from './pages/About';
import Treatments from './pages/Treatments';
import TreatmentDetail from './pages/TreatmentDetail';
import BookAppointment from './pages/BookAppointment';
import MassageBenefits from './pages/MassageBenefits';
import GiftATreatment from './pages/GiftATreatment';
import ClaimGift from './pages/ClaimGift';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import MeetYourTherapist from './pages/MeetYourTherapist';
import TermsConditions from './pages/TermsConditions';
import PrivacyPolicy from './pages/PrivacyPolicy';
import RefundPolicy from './pages/RefundPolicy';
import Login from './pages/Login';
import Signup from './pages/Signup';
import NotFound from './pages/NotFound';
import PaymentResult from './pages/PaymentResult';

import CustomerLayout from './pages/customer/CustomerLayout';
import MyAccount from './pages/customer/MyAccount';
import MyBookings from './pages/customer/MyBookings';
import MyPayments from './pages/customer/MyPayments';
import MyGifts from './pages/customer/MyGifts';

import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminCalendar from './pages/admin/AdminCalendar';
import AdminBookings from './pages/admin/AdminBookings';
import AdminCustomers from './pages/admin/AdminCustomers';
import AdminServices from './pages/admin/AdminServices';
import AdminGifts from './pages/admin/AdminGifts';
import AdminCmsPages from './pages/admin/AdminCmsPages';
import AdminCmsEditor from './pages/admin/AdminCmsEditor';
import AdminBlog from './pages/admin/AdminBlog';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import AdminAccount from './pages/admin/AdminAccount';

export default function App() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/what-knead-me-treats" element={<WhatWeTreat />} />
        <Route path="/corporate-massage" element={<CorporateMassage />} />
        <Route path="/treatments" element={<Treatments />} />
        <Route path="/treatments/:slug" element={<TreatmentDetail />} />
        <Route path="/book-appointment" element={<BookAppointment />} />
        <Route path="/massage-benefits" element={<MassageBenefits />} />
        <Route path="/gift-a-treatment" element={<GiftATreatment />} />
        <Route path="/payment-result" element={<PaymentResult />} />
        <Route path="/claim-gift/:token" element={<ClaimGift />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/meet-your-therapist" element={<MeetYourTherapist />} />
        <Route path="/terms-conditions" element={<TermsConditions />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/refund-policy" element={<RefundPolicy />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Customer account area */}
        <Route element={<CustomerProtectedRoute />}>
          <Route path="/account" element={<CustomerLayout />}>
            <Route index element={<MyAccount />} />
            <Route path="bookings" element={<MyBookings />} />
            <Route path="payments" element={<MyPayments />} />
            <Route path="gifts" element={<MyGifts />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Admin area - separate layout, no public navbar/footer */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route element={<AdminProtectedRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="calendar" element={<AdminCalendar />} />
          <Route path="bookings" element={<AdminBookings />} />
          <Route path="customers" element={<AdminCustomers />} />
          <Route path="services" element={<AdminServices />} />
          <Route path="gifts" element={<AdminGifts />} />
          <Route path="cms" element={<AdminCmsPages />} />
          <Route path="cms/:pageKey" element={<AdminCmsEditor />} />
          <Route path="blog" element={<AdminBlog />} />
          <Route path="analytics" element={<AdminAnalytics />} />
          <Route path="account" element={<AdminAccount />} />
        </Route>
      </Route>
    </Routes>
  );
}
