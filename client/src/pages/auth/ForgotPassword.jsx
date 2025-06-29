import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { forgotPassword } from '../../api/auth';
import { toast } from 'react-toastify';
import FormInput from '../../components/ui/FormInput';
import Button from '../../components/ui/Button';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await forgotPassword(email);
      toast.success('OTP sent to your email');
      navigate('/reset-password', { state: { email } });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-white to-purple-100 px-4 py-12">
      <div className="w-full max-w-lg bg-white/90 backdrop-blur-lg border border-purple-200 rounded-3xl shadow-[0_10px_40px_rgba(140,85,255,0.2)] px-10 py-12 relative overflow-hidden transition-all duration-500">

        {/* Glowing background blobs */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-300 rounded-full opacity-20 blur-3xl animate-pulse -z-10" />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-pink-300 rounded-full opacity-20 blur-3xl animate-pulse delay-200 -z-10" />

        <div className="text-center mb-8">
          <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-indigo-600 to-fuchsia-600 drop-shadow">
            Forgot Password 🔐
          </h2>
          <p className="text-sm text-purple-500 mt-1">
            Enter your email to receive an OTP
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <FormInput
            label="Email Address"
            name="email"
            type="email"
            required
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Button
            type="submit"
            fullWidth
            disabled={loading}
            className="bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 text-white font-semibold text-base py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            {loading ? 'Sending OTP...' : 'Send OTP'}
          </Button>

          <div className="text-center text-sm pt-3 text-gray-500">
            Remember your password?{' '}
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

export default ForgotPassword;
