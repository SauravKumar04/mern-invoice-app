import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/ui/PrivateRoute';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import VerifyOtp from './pages/auth/VerifyOtp';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import Profile from './pages/Profile';
import Invoices from './pages/invoices/Invoices';
import InvoiceCreate from './pages/invoices/InvoiceCreate';
import InvoiceEdit from './pages/invoices/InvoiceEdit';
import InvoiceView from './pages/invoices/InvoiceView';
import CompanySettings from './pages/company/CompanySettings';
import 'react-toastify/dist/ReactToastify.css';
import { Navigate } from 'react-router-dom';


function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} /> 
          <Route path="profile" element={<Profile />} />
          <Route path="invoices" element={<Invoices />} />
          <Route path="invoices/create" element={<InvoiceCreate />} />
          <Route path="invoices/edit/:id" element={<InvoiceEdit />} />
          <Route path="invoices/view/:id" element={<InvoiceView />} />
          <Route path="company-settings" element={<CompanySettings />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
