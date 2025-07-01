import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getCompanyInfo, setCompanyInfo } from '../../api/company';
import { toast } from 'react-toastify';
import FormInput from '../../components/ui/FormInput';
import Button from '../../components/ui/Button';

const CompanySettings = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    website: '',
  });

  useEffect(() => {
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
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-violet-600 border-solid" />
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-10 bg-gradient-to-br from-violet-50 via-purple-50 to-white transition">
      <div className="max-w-5xl mx-auto bg-white/80 backdrop-blur-lg border border-violet-100 shadow-2xl rounded-3xl px-6 py-10 sm:px-10">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-fuchsia-600 mb-10 text-center sm:text-left">
          Company Settings
        </h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              label="Company Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <FormInput
              label="Phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <FormInput
            label="Address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            textarea
            rows={3}
          />

          <FormInput
            label="Website"
            name="website"
            value={formData.website}
            onChange={handleChange}
            type="url"
          />

          {/* Save Button */}
          <div className="pt-6 border-t border-gray-100">
            <Button
              type="submit"
              variant="primary"
              className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white px-6 py-2 rounded-lg shadow-md transition-all"
            >
              Save Settings
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CompanySettings;
