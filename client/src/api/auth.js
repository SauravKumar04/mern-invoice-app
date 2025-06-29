import api from './axios';

export const register = async (data) => {
  const response = await api.post('/api/auth/register', data);
  return response.data;
};

export const verifyOtp = async (data) => {
  const response = await api.post('/api/auth/verify', data);
  return response.data;
};

export const login = async (data) => {
  const response = await api.post('/api/auth/login', data);
  return response.data;
};

export const forgotPassword = async (email) => {
  const response = await api.post('/api/auth/forgot-password', { email });
  return response.data;
};

export const resetPassword = async (data) => {
  const response = await api.post('/api/auth/reset-password', data);
  return response.data;
};

export const resendOtp = async (data) => {
  const response = await api.post('/api/auth/resend-otp', data);
  return response.data;
};

export const updateProfile = async (data) => {
  const response = await api.put('/api/auth/update-profile', data);
  return response.data; // ✅ ensure this includes `.user` field
};


export const uploadProfileImage = async (file) => {
  const formData = new FormData();
  formData.append("profileImage", file);

  const response = await api.post("/api/auth/upload-profile-image", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data; // ✅ This should include `imageUrl`
};





export const logout = async () => {
  await api.post('/api/auth/logout');
};