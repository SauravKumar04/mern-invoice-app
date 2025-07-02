import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { verifyOtp, resendOtp } from '../../api/auth';
import { toast } from 'react-toastify';
import FormInput from '../../components/ui/FormInput';
import Button from '../../components/ui/Button';
import { FileText, Sparkles, Star, CheckCircle, RefreshCw } from 'lucide-react';

const VerifyOtp = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
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
    <div className="min-h-screen bg-gradient-to-br from-violet-900 via-purple-900 to-fuchsia-900 flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating icons */}
        <div className="absolute top-1/6 left-1/5 animate-float">
          <CheckCircle className="w-8 h-8 text-white/10 rotate-12" />
        </div>
        <div className="absolute top-1/4 right-1/5 animate-float-delayed">
          <RefreshCw className="w-6 h-6 text-white/10 -rotate-12" />
        </div>
        <div className="absolute bottom-1/5 left-1/4 animate-float">
          <FileText className="w-10 h-10 text-white/10 rotate-45" />
        </div>
        
        {/* Floating sparkles */}
        <div className="absolute top-1/8 right-1/8 animate-sparkle">
          <Sparkles className="w-4 h-4 text-violet-300/30" />
        </div>
        <div className="absolute bottom-1/8 left-1/8 animate-sparkle-delayed">
          <Star className="w-5 h-5 text-fuchsia-300/30" />
        </div>
        <div className="absolute top-3/4 right-1/4 animate-sparkle">
          <Star className="w-3 h-3 text-purple-300/30" />
        </div>
        
        {/* Gradient orbs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-violet-400/20 to-transparent rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-fuchsia-400/20 to-transparent rounded-full blur-3xl animate-pulse-slow animation-delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-purple-400/10 to-transparent rounded-full blur-2xl animate-spin-slow" />
      </div>

      {/* Main form */}
      <div className={`w-full max-w-md relative z-10 transition-all duration-1000 ${
        mounted 
          ? 'opacity-100 translate-y-0 scale-100' 
          : 'opacity-0 translate-y-8 scale-95'
      }`}>
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-8 sm:p-10 relative overflow-hidden">
          
          {/* Inner decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-violet-400/20 to-transparent rounded-full blur-2xl animate-pulse" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-fuchsia-400/20 to-transparent rounded-full blur-2xl animate-pulse animation-delay-500" />
          
          {/* Animated header */}
          <div className={`text-center mb-8 transition-all duration-1000 delay-300 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            <div className="flex items-center justify-center mb-4">
              <div className="relative">
                <CheckCircle className="w-12 h-12 text-violet-300 animate-bounce-slow" />
                <div className="absolute -top-1 -right-1">
                  <Sparkles className="w-4 h-4 text-fuchsia-300 animate-pulse" />
                </div>
              </div>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-violet-300 via-fuchsia-300 to-purple-300 drop-shadow-lg mb-2">
              Verify Your Email ✉️
            </h2>
            <p className="text-sm text-violet-200/80 font-medium animate-fade-in-up animation-delay-500">
              Enter the 6-digit OTP sent to{' '}
              <span className="font-semibold text-violet-300">{email}</span>
            </p>
          </div>

          {/* Form with staggered animations */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className={`transition-all duration-700 delay-500 ${
              mounted ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
            }`}>
              <FormInput
                label="OTP"
                name="otp"
                type="text"
                required
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                variant="light"
              />
            </div>

            <div className={`transition-all duration-700 delay-700 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}>
              <Button 
                type="submit" 
                fullWidth 
                disabled={loading}
                className="bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-semibold text-base py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 relative overflow-hidden group"
              >
                <span className="relative z-10">
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Verifying...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      Verify Email
                    </div>
                  )}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </Button>
            </div>

            <div className={`text-center text-sm pt-2 transition-all duration-700 delay-900 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
            }`}>
              <button
                type="button"
                onClick={handleResend}
                disabled={resendLoading}
                className="inline-flex items-center gap-2 text-violet-300 hover:text-violet-100 font-semibold hover:scale-105 disabled:opacity-50 transition-all duration-300"
              >
                <RefreshCw className={`w-4 h-4 ${resendLoading ? 'animate-spin' : ''}`} />
                {resendLoading ? 'Sending...' : 'Resend OTP'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtp;
