import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { forgotPassword } from '../../api/auth';
import { toast } from 'react-toastify';
import FormInput from '../../components/ui/FormInput';
import Button from '../../components/ui/Button';
import { FileText, Sparkles, Star, Mail, Lock } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setMounted(true);
  }, []);

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
    <div className="min-h-screen bg-gradient-to-br from-violet-900 via-purple-900 to-fuchsia-900 flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating icons */}
        <div className="absolute top-1/6 left-1/5 animate-float">
          <Lock className="w-8 h-8 text-white/10 rotate-12" />
        </div>
        <div className="absolute top-1/4 right-1/5 animate-float-delayed">
          <Mail className="w-6 h-6 text-white/10 -rotate-12" />
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
      <div className={`w-full max-w-lg relative z-10 transition-all duration-1000 ${
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
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-violet-300 via-fuchsia-300 to-purple-300 rounded-xl shadow-lg animate-bounce-slow">
                  <span className="text-violet-900 font-extrabold text-lg">X</span>
                </div>
                <div className="absolute -inset-1 bg-gradient-to-r from-violet-400/30 via-fuchsia-400/30 to-purple-400/30 rounded-xl blur-sm opacity-0 animate-pulse" />
                <Lock className="absolute -bottom-1 -right-1 w-5 h-5 text-fuchsia-300 animate-pulse" />
              </div>
            </div>
            <p className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-violet-200 to-fuchsia-200 mb-2">
              Invo<span className="text-fuchsia-200">X</span>
            </p>
            <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-violet-300 via-fuchsia-300 to-purple-300 drop-shadow-lg">
              Forgot Password 🔐
            </h2>
            <p className="text-sm text-violet-200/80 mt-2 animate-fade-in-up animation-delay-500">
              Enter your email to receive an OTP
            </p>
          </div>

          {/* Form with staggered animations */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className={`transition-all duration-700 delay-500 ${
              mounted ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
            }`}>
              <FormInput
                label="Email Address"
                name="email"
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                      Sending OTP...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <Mail className="w-5 h-5" />
                      Send OTP
                    </div>
                  )}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </Button>
            </div>

            <div className={`text-center text-sm pt-3 text-violet-200/70 transition-all duration-700 delay-900 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
            }`}>
              Remember your password?{' '}
              <Link
                to="/login"
                className="text-violet-300 hover:text-violet-100 font-medium transition-all duration-300 hover:scale-105 inline-block"
              >
                Sign in
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
