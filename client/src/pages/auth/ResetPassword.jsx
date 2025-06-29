import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { resetPassword } from '../../api/auth';
import { toast } from 'react-toastify';
import FormInput from '../../components/ui/FormInput';
import Button from '../../components/ui/Button';

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [formData, setFormData] = useState({
    otp: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
    } else {
      navigate('/forgot-password');
    }
  }, [location, navigate]);

  const validate = () => {
    const newErrors = {};
    if (!formData.otp) newErrors.otp = 'OTP is required';
    if (!formData.newPassword) newErrors.newPassword = 'Password is required';
    if (formData.newPassword.length < 6) newErrors.newPassword = 'Password must be at least 6 characters';
    if (formData.newPassword !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await resetPassword({
        email,
        otp: formData.otp,
        newPassword: formData.newPassword
      });
      toast.success('Password reset successful! Please login');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Password reset failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-fuchsia-100 via-white to-purple-100 px-4 py-12">
      <div className="w-full max-w-lg bg-white/90 backdrop-blur-xl border border-purple-200 rounded-3xl shadow-[0_10px_40px_rgba(140,85,255,0.2)] px-10 py-12 relative overflow-hidden transition-all duration-500">

        {/* Decorative background blobs */}
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-purple-300 rounded-full opacity-20 blur-3xl animate-pulse -z-10" />
        <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-pink-300 rounded-full opacity-20 blur-3xl animate-pulse delay-200 -z-10" />

        <div className="text-center mb-8">
          <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-indigo-600 to-fuchsia-600 drop-shadow">
            Reset Password 🔁
          </h2>
          <p className="text-sm text-purple-500 mt-1">
            Enter the OTP sent to your email and set your new password
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <FormInput
            label="OTP"
            name="otp"
            type="text"
            required
            placeholder="Enter 6-digit OTP"
            value={formData.otp}
            onChange={handleChange}
            error={errors.otp}
          />
          <FormInput
            label="New Password"
            name="newPassword"
            type="password"
            required
            placeholder="New password"
            value={formData.newPassword}
            onChange={handleChange}
            error={errors.newPassword}
          />
          <FormInput
            label="Confirm New Password"
            name="confirmPassword"
            type="password"
            required
            placeholder="Confirm new password"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
          />

          <Button
            type="submit"
            fullWidth
            disabled={loading}
            className="bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 text-white font-semibold text-base py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
