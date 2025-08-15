// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { NotificationProvider } from './context/NotificationContext'
import MainLayout from './layout/MainLayout'
import AdminLayout from './layout/AdminLayout'

import Home from './pages/Home'
import About from './pages/About'
import Donate from './pages/Donate'
import Contact from './pages/Contact'
import NotFound from './pages/NotFound'
import Programs from './pages/Programs'
import Gallery from './components/Gallery'
import Events from './pages/Events'
import Blog from './pages/Blog'
import Impact from './pages/Impact'
import Volunteer from './pages/Volunteer'
import GetInvolved from './pages/GetInvolved'
import FAQs from './pages/FAQs'
import PrivacyPolicy from './pages/PrivacyPolicy'
import TermsOfService from './pages/TermsOfService'
import Mission from './pages/Mission'

// Admin Components
import AdminLogin from './pages/admin/Login'
import Dashboard from './pages/admin/Dashboard'
import EventsManagement from './pages/admin/EventsManagement'
import BlogManagement from './pages/admin/BlogManagement'
import GalleryManagement from './pages/admin/GalleryManagement'
import ContactsManagement from './pages/admin/ContactsManagement'
import VolunteersManagement from './pages/admin/VolunteersManagement'
import ProgramsManagement from './pages/admin/ProgramsManagement'
import DonationsManagement from './pages/admin/DonationsManagement'
import NewsletterManagement from './pages/admin/NewsletterManagement'
import CampaignManagement from './pages/admin/CampaignManagement'



export default function App() {
  return (
    <HelmetProvider>
      <NotificationProvider>
        <Router>
          <Routes>
          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/*" element={
            <AdminLayout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/analytics" element={<div>Analytics Page (Coming Soon)</div>} />
                <Route path="/events" element={<EventsManagement />} />
                <Route path="/blog" element={<BlogManagement />} />
                <Route path="/gallery" element={<GalleryManagement />} />
                <Route path="/programs" element={<ProgramsManagement />} />
                <Route path="/contacts" element={<ContactsManagement />} />
                <Route path="/volunteers" element={<VolunteersManagement />} />
                <Route path="/donations" element={<DonationsManagement />} />
                <Route path="/newsletter" element={<NewsletterManagement />} />
                <Route path="/campaigns" element={<CampaignManagement />} />
                <Route path="/settings" element={<div>Settings (Coming Soon)</div>} />
                <Route path="*" element={<div>Admin Page Not Found</div>} />
              </Routes>
            </AdminLayout>
          } />
          
          {/* Public Routes */}
          <Route path="/*" element={
            <MainLayout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/donate" element={<Donate />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/programs" element={<Programs />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/events" element={<Events />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/impact" element={<Impact />} />
                <Route path="/volunteer" element={<Volunteer />} />
                <Route path="/get-involved" element={<GetInvolved />} />
                <Route path="/faqs" element={<FAQs />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/terms-of-service" element={<TermsOfService />} />
                <Route path="/mission" element={<Mission />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </MainLayout>
          } />
          </Routes>
        </Router>
      </NotificationProvider>
    </HelmetProvider>
  )
}