import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getCompanyInfo, setCompanyInfo } from '../../api/company';
import { toast } from 'react-toastify';
import FormInput from '../../components/ui/FormInput';
import Button from '../../components/ui/Button';
import { Building2, Phone, Globe, MapPin, Sparkles, Settings } from 'lucide-react';

const CompanySettings = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    website: '',
  });

  useEffect(() => {
    setMounted(true);
    const fetchCompanyInfo = async () => {
      try {
        const data = await getCompanyInfo();
        setCompany(data);
        setFormData({
          name: data?.name || '',
          address: data?.address || '',
          phone: data?.phone || '',
          website: data?.website || '',
        });
      } catch (error) {
        toast.error('Failed to load company info');
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyInfo();
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('address', formData.address);
      data.append('phone', formData.phone);
      data.append('website', formData.website);

      const savedCompany = await setCompanyInfo(data);
      setCompany(savedCompany);
      toast.success('Company information saved successfully!');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Failed to save company information');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-violet-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-violet-600 border-solid mx-auto" />
          <p className="mt-4 text-gray-600 font-medium">Loading company settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-10 bg-gradient-to-br from-gray-50 via-white to-violet-50">
      {/* Floating decorative elements */}
      <div className="fixed top-20 right-10 animate-pulse opacity-20">
        <Sparkles className="w-6 h-6 text-violet-400" />
      </div>
      <div className="fixed top-40 left-10 animate-pulse opacity-15 animation-delay-1000">
        <Building2 className="w-5 h-5 text-purple-400" />
      </div>

      <div className={`max-w-5xl mx-auto transition-all duration-1000 ${
        mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}>
        {/* Header Card */}
        <div className="bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 sm:p-8 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-violet-100/30 to-transparent rounded-full blur-2xl" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-purple-100/20 to-transparent rounded-full blur-xl" />
          
          <div className="relative z-10 flex items-center gap-4">
            <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-violet-500 to-purple-600 rounded-xl text-white shadow-lg">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">
                Company Settings
              </h1>
              <p className="text-gray-600 mt-1">
                Configure your company information for invoices
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 sm:p-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-100/40 to-transparent rounded-full blur-xl" />
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-green-100/30 to-transparent rounded-full blur-lg" />
          
          <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
            {/* Company Details */}
            <div className="bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6 shadow-md">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-2 h-2 bg-violet-500 rounded-full animate-pulse" />
                <h2 className="text-lg font-semibold text-gray-800">Company Details</h2>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <FormInput
                  label="Company Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  variant="dark"
                  placeholder="Enter your company name"
                />
                <FormInput
                  label="Phone Number"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  variant="dark"
                  placeholder="(555) 123-4567"
                />
              </div>
            </div>

            {/* Address & Website */}
            <div className="bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6 shadow-md">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                <h2 className="text-lg font-semibold text-gray-800">Contact Information</h2>
              </div>
              
              <div className="space-y-6">
                <div className="relative">
                  <FormInput
                    label="Company Address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    variant="dark"
                    placeholder="123 Business St, City, State 12345"
                    textarea
                    rows={3}
                  />
                  <MapPin className="absolute top-8 right-3 w-5 h-5 text-gray-400" />
                </div>

                <div className="relative">
                  <FormInput
                    label="Website URL"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    type="url"
                    variant="dark"
                    placeholder="https://yourcompany.com"
                  />
                  <Globe className="absolute top-8 right-3 w-5 h-5 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end pt-6">
              <Button
                type="submit"
                disabled={submitting}
                className="bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 relative overflow-hidden group"
              >
                <span className="relative z-10 flex items-center gap-2">
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Saving Settings...
                    </>
                  ) : (
                    <>
                      <Settings className="w-4 h-4" />
                      Save Settings
                    </>
                  )}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CompanySettings;
