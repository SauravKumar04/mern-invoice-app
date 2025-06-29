import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../../api/auth';
import { toast } from 'react-toastify';
import FormInput from '../../components/ui/FormInput';
import Button from '../../components/ui/Button';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
      toast.success('Registration successful! Please check your email for OTP');
      navigate('/verify-otp', { state: { email: formData.email } });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 via-white to-purple-50 px-4 py-10">
      <div className="w-full max-w-2xl bg-white/90 backdrop-blur-lg border border-purple-200 rounded-3xl shadow-[0_10px_40px_rgba(140,85,255,0.2)] px-10 py-12 relative overflow-hidden transition-all duration-500">

        {/* Glowing background blobs */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-pink-300 rounded-full opacity-20 blur-3xl animate-pulse -z-10" />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-purple-300 rounded-full opacity-20 blur-3xl animate-pulse delay-200 -z-10" />

        <div className="text-center mb-8">
          <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-indigo-600 to-fuchsia-600 drop-shadow">
            Create Account
          </h2>
          <p className="text-sm text-purple-500 mt-1">
            Start your invoicing journey today ✨
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              label="Full Name"
              name="name"
              type="text"
              required
              placeholder="Your name"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
            />
            <FormInput
              label="Email Address"
              name="email"
              type="email"
              required
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              label="Password"
              name="password"
              type="password"
              required
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
            />
            <FormInput
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              required
              placeholder="Repeat password"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
            />
          </div>

          <Button
            type="submit"
            fullWidth
            disabled={loading}
            className="bg-gradient-to-r from-fuchsia-600 via-purple-600 to-indigo-600 hover:from-fuchsia-700 hover:to-indigo-700 text-white font-semibold text-base py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            {loading ? 'Registering...' : 'Register'}
          </Button>

          <div className="text-center text-sm text-gray-500 pt-3">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-purple-600 hover:text-purple-800 font-medium transition duration-200"
            >
              Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
