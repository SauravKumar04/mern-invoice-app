import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { verifyOtp, resendOtp } from '../../api/auth';
import { toast } from 'react-toastify';
import FormInput from '../../components/ui/FormInput';
import Button from '../../components/ui/Button';

const VerifyOtp = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
    } else {
      navigate('/register');
    }
  }, [location, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await verifyOtp({ email, otp });
      toast.success('Email verified successfully! Please login');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendLoading(true);
    try {
      await resendOtp({ email, type: 'verify' });
      toast.success('New OTP sent to your email');
    } catch (error) {
      toast.error('Failed to resend OTP');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 via-white to-purple-50 px-4 py-12">
      <div className="w-full max-w-md bg-white border border-purple-100 rounded-3xl shadow-2xl p-8 sm:p-10 transition-all">
        <div className="text-center mb-8">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-purple-700 mb-2">
            Verify Your Email
          </h2>
          <p className="text-sm text-purple-400 font-medium">
            Enter the 6-digit OTP sent to{' '}
            <span className="font-semibold text-purple-600">{email}</span>
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <FormInput
            label="OTP"
            name="otp"
            type="text"
            required
            placeholder="Enter 6-digit OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />

          <Button type="submit" fullWidth disabled={loading}>
            {loading ? 'Verifying...' : 'Verify Email'}
          </Button>

          <div className="text-center text-sm pt-2">
            <button
              type="button"
              onClick={handleResend}
              disabled={resendLoading}
              className="text-purple-500 font-semibold hover:underline disabled:opacity-50 transition duration-200"
            >
              {resendLoading ? 'Sending...' : 'Resend OTP'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VerifyOtp;
