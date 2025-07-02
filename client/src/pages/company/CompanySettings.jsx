import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getCompanyInfo, setCompanyInfo } from '../../api/company';
import { toast } from 'react-toastify';
import FormInput from '../../components/ui/FormInput';
import Button from '../../components/ui/Button';
import { 
  Building2, 
  Phone, 
  Globe, 
  MapPin, 
  Sparkles, 
  Settings,
  Star,
  Save,
  Building,
  Users,
  Briefcase,
  Mail,
  Link2,
  CheckCircle,
  Info,
  ArrowRight,
  Edit3
} from 'lucide-react';

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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600 border-solid mx-auto" />
            <div className="absolute -top-2 -right-2">
              <Sparkles className="w-6 h-6 text-blue-500 animate-pulse" />
            </div>
          </div>
          <p className="mt-6 text-gray-600 font-medium">Loading company settings...</p>
          <p className="text-sm text-gray-500 mt-2">Preparing your business information</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 p-4 sm:p-6 lg:p-8">
      {/* Floating decorative elements */}
      <div className="fixed top-20 right-10 opacity-20 pointer-events-none">
        <Sparkles className="w-8 h-8 text-blue-500 animate-pulse" />
      </div>
      <div className="fixed top-40 left-10 opacity-15 pointer-events-none">
        <Star className="w-6 h-6 text-purple-500 animate-pulse" style={{ animationDelay: '1s' }} />
      </div>
      <div className="fixed bottom-20 right-20 opacity-10 pointer-events-none">
        <Building2 className="w-7 h-7 text-indigo-500 animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className={`max-w-6xl mx-auto transition-all duration-1000 ${
        mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}>
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-lg">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Company Settings</h1>
              <p className="text-gray-600 mt-1">Configure your business information for professional invoices</p>
            </div>
          </div>
          
          {/* Company Info Quick View */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-indigo-100/30 to-purple-100/20 rounded-full blur-xl" />
            <div className="relative z-10 flex items-center gap-6">
              <div className="relative group">
                <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                  <Building className="w-10 h-10" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 border-2 border-white rounded-full animate-pulse" />
              </div>
              
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900">
                  {company?.name || formData.name || 'Your Company'}
                </h2>
                <p className="text-gray-600 flex items-center gap-2 mt-1">
                  <Users className="w-4 h-4" />
                  Business Profile
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-green-600 font-medium">Ready for Invoicing</span>
                </div>
              </div>

              <div className="hidden sm:flex items-center gap-4">
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center text-white font-bold text-sm">
                    100%
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Complete</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className={`space-y-8 transition-all duration-1000 delay-300 ${
          mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          
          {/* Information Banner */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-blue-100/50 rounded-full blur-xl" />
            <div className="relative z-10 flex items-start gap-4">
              <div className="p-2 bg-blue-500 rounded-xl shadow-lg">
                <Info className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-blue-900 mb-2">Why Company Information Matters</h3>
                <p className="text-blue-700 text-sm mb-3">
                  Your company details appear on all invoices and help establish trust with clients. Complete information ensures professional presentation and legal compliance.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">Professional Branding</span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">Legal Compliance</span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">Client Trust</span>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Company Details */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 hover:shadow-2xl transition-all duration-300 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-indigo-100/30 to-transparent rounded-full blur-xl" />
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-xl shadow-lg">
                    <Briefcase className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Business Details</h3>
                    <p className="text-sm text-gray-600">Core information about your company</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="relative">
                    <FormInput
                      label="Company Name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      variant="dark"
                      placeholder="Enter your company name"
                    />
                    <Edit3 className="absolute top-8 right-3 w-4 h-4 text-gray-400" />
                  </div>
                  
                  <div className="relative">
                    <FormInput
                      label="Phone Number"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      variant="dark"
                      placeholder="(555) 123-4567"
                    />
                    <Phone className="absolute top-8 right-3 w-4 h-4 text-gray-400" />
                  </div>
                </div>

                <div className="mt-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="w-4 h-4 text-indigo-600" />
                    <span className="text-sm font-medium text-indigo-700">Pro Tip</span>
                  </div>
                  <p className="text-xs text-indigo-600">
                    Use your official business name exactly as it appears on legal documents for maximum professionalism.
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 hover:shadow-2xl transition-all duration-300 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-green-100/30 to-transparent rounded-full blur-xl" />
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow-lg">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Contact Information</h3>
                    <p className="text-sm text-gray-600">Address and online presence details</p>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div className="relative">
                    <FormInput
                      label="Business Address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      variant="dark"
                      placeholder="123 Business Street, City, State 12345"
                      textarea
                      rows={3}
                    />
                    <MapPin className="absolute top-8 right-3 w-4 h-4 text-gray-400" />
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
                    <Globe className="absolute top-8 right-3 w-4 h-4 text-gray-400" />
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="w-4 h-4 text-yellow-600" />
                      <span className="text-sm font-medium text-yellow-700">Address Tips</span>
                    </div>
                    <p className="text-xs text-yellow-600">
                      Include full address for legal compliance and professional appearance on invoices.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Link2 className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-700">Website Benefits</span>
                    </div>
                    <p className="text-xs text-blue-600">
                      Adding your website builds credibility and provides clients with more information.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Preview Section */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 hover:shadow-2xl transition-all duration-300 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-purple-100/30 to-transparent rounded-full blur-xl" />
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl shadow-lg">
                    <Star className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Invoice Preview</h3>
                    <p className="text-sm text-gray-600">How your company info will appear</p>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border-2 border-dashed border-gray-300">
                  <div className="text-center mb-4">
                    <h4 className="text-lg font-bold text-gray-800">
                      {formData.name || 'Your Company Name'}
                    </h4>
                  </div>
                  
                  <div className="space-y-2 text-sm text-gray-600">
                    {formData.address && (
                      <p className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 mt-0.5 text-gray-400" />
                        {formData.address}
                      </p>
                    )}
                    {formData.phone && (
                      <p className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        {formData.phone}
                      </p>
                    )}
                    {formData.website && (
                      <p className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-gray-400" />
                        {formData.website}
                      </p>
                    )}
                  </div>
                  
                  {!formData.name && !formData.address && !formData.phone && !formData.website && (
                    <p className="text-center text-gray-500 italic py-8">
                      Fill in your company details to see the preview
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center pt-6">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="group flex items-center gap-2 text-gray-600 hover:text-gray-800 font-medium transition-colors duration-200"
              >
                ← Back to Dashboard
              </button>
              
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setFormData({ name: '', address: '', phone: '', website: '' });
                  }}
                  className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-all duration-200"
                >
                  Reset Form
                </button>
                
                <button
                  type="submit"
                  disabled={submitting}
                  className="group bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 relative overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {submitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Saving Settings...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
                        Save Company Settings
                        <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                      </>
                    )}
                  </span>
                  
                  {/* Shimmer effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CompanySettings;
