import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../../api/auth';
import { useAuthContext } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import FormInput from '../../components/ui/FormInput';
import Button from '../../components/ui/Button';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login: authLogin } = useAuthContext();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { token, user } = await login(formData);
      authLogin(user, token);
      toast.success('Login successful!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-fuchsia-200 via-rose-100 to-indigo-100 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md bg-white/90 backdrop-blur-lg border border-purple-200 rounded-3xl shadow-2xl p-8 sm:p-10 relative overflow-hidden">

        {/* Decorative gradient blobs */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-purple-300 rounded-full opacity-20 blur-3xl animate-pulse -z-10" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-fuchsia-300 rounded-full opacity-20 blur-3xl animate-pulse delay-200 -z-10" />

              {/* Heading */}
        <div className="text-center mb-8">
          <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-indigo-600 to-fuchsia-600 drop-shadow">
            Welcome Back 👋
          </h2>
          <p className="text-sm text-purple-500 mt-1">
            Login to continue managing your invoices
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <FormInput
            label="Email address"
            name="email"
            type="email"
            required
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
          />

          <FormInput
            label="Password"
            name="password"
            type="password"
            required
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
          />

          <div className="flex justify-end text-sm">
            <Link
              to="/forgot-password"
              className="text-fuchsia-600 hover:text-fuchsia-800 font-semibold transition-all duration-200"
            >
              Forgot password?
            </Link>
          </div>

          <Button
            type="submit"
            fullWidth
            disabled={loading}
            className="bg-gradient-to-r from-fuchsia-600 via-purple-600 to-indigo-600 hover:from-fuchsia-700 hover:to-indigo-700 text-white font-semibold text-base py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </Button>

          <p className="text-center text-sm text-gray-500">
            Don’t have an account?{' '}
            <Link
              to="/register"
              className="text-purple-600 hover:text-purple-800 font-medium transition duration-200"
            >
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
