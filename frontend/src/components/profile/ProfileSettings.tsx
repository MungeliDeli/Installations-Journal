import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { profileApi } from "../../services/profileApi";
import { getImageUrl } from "../../utils/config";
import { validateImageFile, validateProfileForm } from "../../utils/validation";

interface ProfileSettingsProps {
  onProfileUpdate: () => void;
  onImageUpdate: () => void;
  onPasswordChange: () => void;
  onError: (message: string) => void;
}

export default function ProfileSettings({
  onProfileUpdate,
  onImageUpdate,
  onPasswordChange,
  onError,
}: ProfileSettingsProps) {
  const { user, updateUser } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Profile form state
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    supervisor: user?.supervisor || '',
    cluster: user?.cluster || '',
    dailyTarget: user?.dailyTarget || 4,
    weeklyTarget: user?.weeklyTarget || 20,
    monthlyTarget: user?.monthlyTarget || 80,
  });

  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState({
    profile: false,
    image: false,
    password: false,
  });

  // Update form when user data changes
  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        supervisor: user.supervisor || '',
        cluster: user.cluster || '',
        dailyTarget: user.dailyTarget || 4,
        weeklyTarget: user.weeklyTarget || 20,
        monthlyTarget: user.monthlyTarget || 80,
      });
    }
  }, [user]);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(prev => ({ ...prev, profile: true }));
    setErrors({});

    // Validate form
    const validation = validateProfileForm(profileForm);
    if (!validation.isValid) {
      setErrors(validation.errors);
      setLoading(prev => ({ ...prev, profile: false }));
      return;
    }

    try {
      const data = await profileApi.updateProfile(profileForm);
      updateUser(data.user);
      onProfileUpdate();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update profile';
      setErrors({ profile: errorMessage });
      onError(errorMessage);
    } finally {
      setLoading(prev => ({ ...prev, profile: false }));
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate image file
    const validationError = validateImageFile(file);
    if (validationError) {
      onError(validationError);
      return;
    }

    setSelectedImage(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleImageUpload = async () => {
    if (!selectedImage) return;

    setLoading(prev => ({ ...prev, image: true }));
    setErrors({});

    try {
      const data = await profileApi.uploadProfileImage(selectedImage);
      updateUser({ ...user, profileImage: data.profileImage });
      setSelectedImage(null);
      setImagePreview(null);
      onImageUpdate();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to upload image';
      setErrors({ image: errorMessage });
      onError(errorMessage);
    } finally {
      setLoading(prev => ({ ...prev, image: false }));
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(prev => ({ ...prev, password: true }));
    setErrors({});

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      const errorMessage = 'New passwords do not match';
      setErrors({ password: errorMessage });
      onError(errorMessage);
      setLoading(prev => ({ ...prev, password: false }));
      return;
    }

    try {
      await profileApi.changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });

      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      onPasswordChange();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to change password';
      setErrors({ password: errorMessage });
      onError(errorMessage);
    } finally {
      setLoading(prev => ({ ...prev, password: false }));
    }
  };

  return (
    <div className="space-y-6">
      {/* Profile Image Section */}
      <div className="bg-(--color-surface) border border-(--color-border) rounded-lg p-6">
        <h3 className="text-lg font-semibold text-(--color-text-primary) mb-4 flex items-center gap-2">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-(--color-accent-red)"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="9" cy="9" r="2" />
            <path d="M21 15l-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
          </svg>
          PROFILE IMAGE
        </h3>

        <div className="flex flex-col sm:flex-row items-start gap-6">
          {/* Current Profile Image */}
          <div className="flex flex-col items-center gap-3">
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-(--color-accent-red) flex items-center justify-center text-white text-4xl font-bold border-4 border-(--color-border) overflow-hidden">
                {getImageUrl(user?.profileImage) ? (
                  <img
                    src={getImageUrl(user?.profileImage)!}
                    alt={user?.name}
                    className="w-full h-full rounded-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.nextElementSibling!.textContent = user?.name?.charAt(0).toUpperCase() || 'U';
                    }}
                  />
                ) : null}
                <span className={getImageUrl(user?.profileImage) ? 'hidden' : 'block'}>
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
              {loading.image && (
                <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>
            <p className="text-xs text-(--color-text-secondary) text-center">Current Photo</p>
          </div>

          {/* Image Preview and Upload */}
          <div className="flex-1 space-y-4">
            {/* Image Preview */}
            {imagePreview && (
              <div className="flex flex-col items-center gap-3">
                <div className="w-32 h-32 rounded-full border-4 border-(--color-border) overflow-hidden">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-xs text-(--color-text-secondary)">Preview</p>
              </div>
            )}

            {/* File Input and Upload Button */}
            <div className="space-y-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />
              
              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={loading.image}
                  className="px-4 py-2 bg-(--color-surface) border border-(--color-border) text-(--color-text-primary) rounded hover:bg-(--color-sidebar-hover) transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Select Photo
                </button>
                
                {selectedImage && (
                  <button
                    onClick={handleImageUpload}
                    disabled={loading.image}
                    className="px-4 py-2 bg-(--color-accent-red) text-white rounded hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {loading.image ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Uploading...
                      </>
                    ) : (
                      'Update Photo'
                    )}
                  </button>
                )}
              </div>

              <p className="text-xs text-(--color-text-secondary)">
                JPG, PNG or GIF. Max size 10MB. Images will be automatically resized and compressed.
              </p>
              
              {selectedImage && (
                <p className="text-xs text-(--color-text-primary)">
                  Selected: {selectedImage.name}
                </p>
              )}
              
              {errors.image && (
                <p className="text-red-500 text-sm">{errors.image}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Profile Details Section */}
      <div className="bg-(--color-surface) border border-(--color-border) rounded-lg p-6">
        <h3 className="text-lg font-semibold text-(--color-text-primary) mb-4 flex items-center gap-2">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-(--color-accent-red)"
          >
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
          PROFILE DETAILS
        </h3>

        <form onSubmit={handleProfileSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-(--color-text-secondary) uppercase tracking-wide mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={profileForm.name}
                onChange={(e) => setProfileForm(prev => ({ ...prev, name: e.target.value }))}
                className="w-full p-3 bg-(--color-bg) border border-(--color-border) rounded text-(--color-text-primary) focus:outline-none focus:border-(--color-accent-red)"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-(--color-text-secondary) uppercase tracking-wide mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={profileForm.email}
                onChange={(e) => setProfileForm(prev => ({ ...prev, email: e.target.value }))}
                className="w-full p-3 bg-(--color-bg) border border-(--color-border) rounded text-(--color-text-primary) focus:outline-none focus:border-(--color-accent-red)"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-(--color-text-secondary) uppercase tracking-wide mb-2">
                Phone (CUG)
              </label>
              <input
                type="tel"
                value={profileForm.phone}
                onChange={(e) => setProfileForm(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full p-3 bg-(--color-bg) border border-(--color-border) rounded text-(--color-text-primary) focus:outline-none focus:border-(--color-accent-red)"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-(--color-text-secondary) uppercase tracking-wide mb-2">
                Supervisor
              </label>
              <input
                type="text"
                value={profileForm.supervisor}
                onChange={(e) => setProfileForm(prev => ({ ...prev, supervisor: e.target.value }))}
                className="w-full p-3 bg-(--color-bg) border border-(--color-border) rounded text-(--color-text-primary) focus:outline-none focus:border-(--color-accent-red)"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-(--color-text-secondary) uppercase tracking-wide mb-2">
                Cluster
              </label>
              <input
                type="text"
                value={profileForm.cluster}
                onChange={(e) => setProfileForm(prev => ({ ...prev, cluster: e.target.value }))}
                className="w-full p-3 bg-(--color-bg) border border-(--color-border) rounded text-(--color-text-primary) focus:outline-none focus:border-(--color-accent-red)"
              />
            </div>
          </div>

          {/* Tracking Targets Section */}
          <div className="mt-6 pt-6 border-t border-(--color-border)">
            <h4 className="text-md font-semibold text-(--color-text-primary) mb-4 flex items-center gap-2">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-(--color-accent-red)"
              >
                <path d="M3 3v18h18" />
                <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3" />
              </svg>
              TRACKING TARGETS
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-(--color-text-secondary) uppercase tracking-wide mb-2">
                  Daily Target
                </label>
                <input
                  type="number"
                  min="1"
                  value={profileForm.dailyTarget || ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    setProfileForm(prev => ({ 
                      ...prev, 
                      dailyTarget: value === '' ? 1 : Math.max(1, parseInt(value) || 1)
                    }));
                  }}
                  className={`w-full p-3 bg-(--color-bg) border rounded text-(--color-text-primary) focus:outline-none ${
                    errors.dailyTarget 
                      ? 'border-red-500 focus:border-red-500' 
                      : 'border-(--color-border) focus:border-(--color-accent-red)'
                  }`}
                />
                {errors.dailyTarget && (
                  <p className="text-red-500 text-xs mt-1">{errors.dailyTarget}</p>
                )}
                <p className="text-xs text-(--color-text-muted) mt-1">Installations per day</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-(--color-text-secondary) uppercase tracking-wide mb-2">
                  Weekly Target
                </label>
                <input
                  type="number"
                  min="1"
                  value={profileForm.weeklyTarget || ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    setProfileForm(prev => ({ 
                      ...prev, 
                      weeklyTarget: value === '' ? 1 : Math.max(1, parseInt(value) || 1)
                    }));
                  }}
                  className={`w-full p-3 bg-(--color-bg) border rounded text-(--color-text-primary) focus:outline-none ${
                    errors.weeklyTarget 
                      ? 'border-red-500 focus:border-red-500' 
                      : 'border-(--color-border) focus:border-(--color-accent-red)'
                  }`}
                />
                {errors.weeklyTarget && (
                  <p className="text-red-500 text-xs mt-1">{errors.weeklyTarget}</p>
                )}
                <p className="text-xs text-(--color-text-muted) mt-1">Monday to Saturday</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-(--color-text-secondary) uppercase tracking-wide mb-2">
                  Monthly Target
                </label>
                <input
                  type="number"
                  min="1"
                  value={profileForm.monthlyTarget || ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    setProfileForm(prev => ({ 
                      ...prev, 
                      monthlyTarget: value === '' ? 1 : Math.max(1, parseInt(value) || 1)
                    }));
                  }}
                  className={`w-full p-3 bg-(--color-bg) border rounded text-(--color-text-primary) focus:outline-none ${
                    errors.monthlyTarget 
                      ? 'border-red-500 focus:border-red-500' 
                      : 'border-(--color-border) focus:border-(--color-accent-red)'
                  }`}
                />
                {errors.monthlyTarget && (
                  <p className="text-red-500 text-xs mt-1">{errors.monthlyTarget}</p>
                )}
                <p className="text-xs text-(--color-text-muted) mt-1">Installations per month</p>
              </div>
            </div>
          </div>

          {errors.profile && (
            <p className="text-red-500 text-sm">{errors.profile}</p>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading.profile}
              className="px-6 py-3 bg-(--color-accent-red) text-white rounded hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading.profile ? 'Updating...' : 'Update Profile'}
            </button>
          </div>
        </form>
      </div>

      {/* Change Password Section */}
      <div className="bg-(--color-surface) border border-(--color-border) rounded-lg p-6">
        <h3 className="text-lg font-semibold text-(--color-text-primary) mb-4 flex items-center gap-2">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-(--color-accent-red)"
          >
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <circle cx="12" cy="16" r="1" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          CHANGE PASSWORD
        </h3>

        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-(--color-text-secondary) uppercase tracking-wide mb-2">
              Current Password
            </label>
            <input
              type="password"
              value={passwordForm.currentPassword}
              onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
              className="w-full p-3 bg-(--color-bg) border border-(--color-border) rounded text-(--color-text-primary) focus:outline-none focus:border-(--color-accent-red)"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-(--color-text-secondary) uppercase tracking-wide mb-2">
                New Password
              </label>
              <input
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                className="w-full p-3 bg-(--color-bg) border border-(--color-border) rounded text-(--color-text-primary) focus:outline-none focus:border-(--color-accent-red)"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-(--color-text-secondary) uppercase tracking-wide mb-2">
                Confirm New Password
              </label>
              <input
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                className="w-full p-3 bg-(--color-bg) border border-(--color-border) rounded text-(--color-text-primary) focus:outline-none focus:border-(--color-accent-red)"
                required
              />
            </div>
          </div>

          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password}</p>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading.password}
              className="px-6 py-3 bg-(--color-accent-red) text-white rounded hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading.password ? 'Changing...' : 'Change Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}