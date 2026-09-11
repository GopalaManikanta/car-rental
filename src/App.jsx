import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from './context/AuthContext';
import { CarProvider } from './context/CarContext';
import { CustomerProvider } from './context/CustomerContext';
import { BookingProvider } from './context/BookingContext';

import ProtectedRoute from './components/common/ProtectedRoute';
import Sidebar from './components/common/Sidebar';
import Navbar from './components/common/Navbar';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import CarsPage from './pages/CarsPage';
import CarDetailPage from './pages/CarDetailPage';
import AvailabilityPage from './pages/AvailabilityPage';
import CustomersPage from './pages/CustomersPage';
import BookingsPage from './pages/BookingsPage';
import NewBookingPage from './pages/NewBookingPage';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';
import NotFoundPage from './pages/NotFoundPage';

const AppLayout = ({ children, pageTitle }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-orange-50/40 text-slate-800 flex">
      {/* Sidebar Navigation */}
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        <Navbar setMobileOpen={setMobileOpen} pageTitle={pageTitle} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <CarProvider>
        <CustomerProvider>
          <BookingProvider>
            <Router>
              <Routes>
                {/* Public Auth Routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Protected App Routes */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <AppLayout pageTitle="Dashboard">
                        <DashboardPage />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/cars"
                  element={
                    <ProtectedRoute>
                      <AppLayout pageTitle="Car Inventory">
                        <CarsPage />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/cars/:id"
                  element={
                    <ProtectedRoute>
                      <AppLayout pageTitle="Car Details">
                        <CarDetailPage />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/availability"
                  element={
                    <ProtectedRoute>
                      <AppLayout pageTitle="Fleet Availability">
                        <AvailabilityPage />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/customers"
                  element={
                    <ProtectedRoute>
                      <AppLayout pageTitle="Customers">
                        <CustomersPage />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/bookings"
                  element={
                    <ProtectedRoute>
                      <AppLayout pageTitle="Booking History">
                        <BookingsPage />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/booking/new"
                  element={
                    <ProtectedRoute>
                      <AppLayout pageTitle="New Rental Booking">
                        <NewBookingPage />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/reports"
                  element={
                    <ProtectedRoute>
                      <AppLayout pageTitle="Reports & Analytics">
                        <ReportsPage />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/settings"
                  element={
                    <ProtectedRoute>
                      <AppLayout pageTitle="System Settings">
                        <SettingsPage />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />

              {/* Root redirect */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />

              {/* 404 Catch All */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Router>

          {/* Global Toast Feedback Container */}
          <ToastContainer
            position="top-right"
            autoClose={3500}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
          </BookingProvider>
        </CustomerProvider>
      </CarProvider>
    </AuthProvider>
  );
}

export default App;
