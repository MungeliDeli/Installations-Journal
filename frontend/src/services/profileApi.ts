import { api } from './api';

export interface UpdateProfileData {
  name?: string;
  email?: string;
  phone?: string;
  supervisor?: string;
  cluster?: string;
  targetInstallations?: number;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export const profileApi = {
  // Get user profile
  getProfile: async () => {
    const response = await api.get('/user/profile');
    return response.data;
  },

  // Update user profile
  updateProfile: async (data: UpdateProfileData) => {
    const response = await api.put('/user/profile', data);
    return response.data;
  },

  // Upload profile image
  uploadProfileImage: async (file: File) => {
    const formData = new FormData();
    formData.append('profileImage', file);
    
    const response = await api.post('/user/upload-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Change password
  changePassword: async (data: ChangePasswordData) => {
    const response = await api.put('/user/change-password', data);
    return response.data;
  },
};