import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { updateProfile } from "../api/auth";
import { toast } from "react-toastify";
import FormInput from "../components/ui/FormInput";
import Button from "../components/ui/Button";
import Loader from "../components/ui/Loader";
import AvatarUpload from "../components/ui/AvatarUpload";

const Profile = () => {
  const { currentUser, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [avatar, setAvatar] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.name,
        email: currentUser.email,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }
  }, [currentUser]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const validate = () => {
    const newErrors = {};
    if (formData.newPassword && formData.newPassword.length < 6) {
      newErrors.newPassword = "Password must be at least 6 characters";
    }
    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('email', formData.email);
      
      if (formData.currentPassword && formData.newPassword) {
        formDataToSend.append('currentPassword', formData.currentPassword);
        formDataToSend.append('newPassword', formData.newPassword);
      }

      if (avatar) {
        formDataToSend.append('avatar', avatar);
      }

      const updatedUser = await updateProfile(formDataToSend);
      updateUser(updatedUser.user);
      toast.success("Profile updated successfully!");
      setFormData({
        ...formData,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setAvatar(null);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) return <Loader size="lg" />;

  return (
    <div className="min-h-screen px-4 py-10 bg-gradient-to-br from-violet-100 via-purple-50 to-white transition-all duration-300">
      <div className="max-w-5xl mx-auto bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl p-6 sm:p-10">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 mb-8 text-center sm:text-left">
          Profile Settings
        </h1>

        <div className="flex flex-col md:flex-row gap-10">
          {/* Avatar Section */}
          <div className="md:w-1/3 flex justify-center">
            <AvatarUpload
              currentAvatar={currentUser?.avatar}
              onAvatarChange={setAvatar}
              name={currentUser?.name}
            />
          </div>

          {/* Form Section */}
          <div className="md:w-2/3">
            <form onSubmit={handleSubmit} className="space-y-6">
              <FormInput
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <FormInput
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />

              <div className="pt-6 border-t border-purple-100">
                <h2 className="text-lg font-semibold text-purple-700 mb-4">
                  Change Password
                </h2>

                <FormInput
                  label="Current Password"
                  name="currentPassword"
                  type="password"
                  value={formData.currentPassword}
                  onChange={handleChange}
                />
                <FormInput
                  label="New Password"
                  name="newPassword"
                  type="password"
                  value={formData.newPassword}
                  onChange={handleChange}
                  error={errors.newPassword}
                />
                <FormInput
                  label="Confirm New Password"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  error={errors.confirmPassword}
                />
              </div>

              <div className="pt-6 flex justify-end">
                <Button
                  type="submit"
                  variant="primary"
                  disabled={loading}
                  className="bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 text-white px-6 py-2 rounded-lg shadow-md transition-all"
                >
                  {loading ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
