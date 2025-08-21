import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { useScrollToTop } from './hooks/useScrollToTop';

// Layout components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Pages
import HomePage from './pages/HomePage';
import BookingPage from './pages/BookingPage';
import HowItWorksPage from './pages/HowItWorksPage';
import AboutPage from './pages/AboutPage';
import PricingPage from './pages/PricingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import DashboardPage from './pages/DashboardPage';
import BookingDetailsPage from './pages/BookingDetailsPage';
import ProfilePage from './pages/ProfilePage';
import CompanionDashboard from './pages/CompanionDashboard';
import NotFoundPage from './pages/NotFoundPage';
import CorporatePlansPage from './pages/CorporatePlansPage';
import FamilyPackagesPage from './pages/FamilyPackagesPage';
import EmergencySupportPage from './pages/EmergencySupportPage';
import HelpCenterPage from './pages/HelpCenterPage';
import FAQsPage from './pages/FAQsPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsOfServicePage from './pages/TermsOfServicePage';

// Components
import WhatsAppWidget from './components/common/WhatsAppWidget';

function AppContent() {
  useScrollToTop();

  return (
    <>
      <Header />
      <main className="min-h-screen">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/book" element={<BookingPage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          
          {/* Coming Soon Pages */}
          <Route path="/corporate-plans" element={<CorporatePlansPage />} />
          <Route path="/family-packages" element={<FamilyPackagesPage />} />
          <Route path="/emergency-support" element={<EmergencySupportPage />} />
          <Route path="/help-center" element={<HelpCenterPage />} />
          <Route path="/faqs" element={<FAQsPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/terms-of-service" element={<TermsOfServicePage />} />
          
          {/* Protected Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          } />
          <Route path="/booking/:id" element={
            <ProtectedRoute>
              <BookingDetailsPage />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } />
          <Route path="/companion/dashboard" element={
            <ProtectedRoute>
              <CompanionDashboard />
            </ProtectedRoute>
          } />
          
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
      <WhatsAppWidget />
    </>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#FF6B35',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 4000,
              },
            }}
          />
          <AppContent />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;