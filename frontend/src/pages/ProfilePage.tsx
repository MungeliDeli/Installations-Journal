import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import PageHeader from "../components/layout/PageHeader";
import ProfileOverview from "../components/profile/ProfileOverview";
import ProfileSettings from "../components/profile/ProfileSettings";
import ToastContainer from "../components/ui/ToastContainer";
import { useToast } from "../hooks/useToast";
import { getImageUrl } from "../utils/config";

interface ProfilePageProps {
  onMenuToggle?: () => void;
}

export default function ProfilePage({ onMenuToggle = () => {} }: ProfilePageProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "settings">("overview");
  const { user } = useAuth();
  const { toasts, removeToast, success, error } = useToast();

  const handleProfileUpdate = () => {
    success("Profile updated successfully!");
    setActiveTab("overview");
  };

  const handleImageUpdate = () => {
    success("Profile image updated successfully!");
  };

  const handlePasswordChange = () => {
    success("Password changed successfully!");
  };

  const handleError = (message: string) => {
    error(message);
  };

  const tabs = [
    { id: "overview", label: "OVERVIEW" },
    { id: "settings", label: "SETTINGS" },
  ];

  return (
    <div className="min-h-screen bg-(--color-bg)">
      <PageHeader
        title="PROFILE"
        subtitle="Manage your account and preferences"
        onMenuToggle={onMenuToggle}
      />
      
      <div className="p-4 lg:p-6">
        {/* Profile Header */}
        <div className="mb-6 p-6 bg-(--color-surface) border border-(--color-border) rounded-lg">
          <div className="flex flex-col sm:flex-row items-center gap-4">
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
            </div>
            <div className="text-center sm:text-left">
              <h2 className="text-xl font-bold text-(--color-text-primary) mb-1">
                {user?.name}
              </h2>
              <p className="text-(--color-text-secondary) text-sm">
                {user?.email}
              </p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="border-b border-(--color-border)">
            <nav className="flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as "overview" | "settings")}
                  className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? "border-(--color-accent-red) text-(--color-accent-red)"
                      : "border-transparent text-(--color-text-secondary) hover:text-(--color-text-primary) hover:border-(--color-border)"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === "overview" && <ProfileOverview />}
          {activeTab === "settings" && (
            <ProfileSettings
              onProfileUpdate={handleProfileUpdate}
              onImageUpdate={handleImageUpdate}
              onPasswordChange={handlePasswordChange}
              onError={handleError}
            />
          )}
        </div>
      </div>

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
}