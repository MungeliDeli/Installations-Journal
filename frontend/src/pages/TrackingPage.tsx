import { useState, useEffect } from "react";
import PageHeader from "../components/layout/PageHeader";
import InstallationsTable from "../components/installations/InstallationsTable";
import InstallationDetailsModal from "../components/installations/InstallationDetailsModal";
import { useAuth } from "../contexts/AuthContext";
import { useInstallationStats } from "../hooks/useInstallationStats";
import { api } from "../services/api";
import type { Installation } from "../types/installation";

interface TrackingPageProps {
  onMenuToggle?: () => void;
}

interface UserTargets {
  dailyTarget: number;
  weeklyTarget: number;
  monthlyTarget: number;
}

type TabType = "daily" | "weekly" | "monthly";

export default function TrackingPage({ onMenuToggle = () => {} }: TrackingPageProps) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>("daily");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [targets, setTargets] = useState<UserTargets>({
    dailyTarget: 4,
    weeklyTarget: 20,
    monthlyTarget: 80,
  });
  const [selectedInstallation, setSelectedInstallation] = useState<Installation | null>(null);

  // Use the custom hook for fetching stats
  const {
    data: stats,
    isLoading,
    error,
  } = useInstallationStats(currentDate, activeTab);

  const fetchUserTargets = async () => {
    try {
      const response = await api.get("/users/profile");
      const userData = response.data.user;
      setTargets({
        dailyTarget: userData.dailyTarget || 4,
        weeklyTarget: userData.weeklyTarget || 20,
        monthlyTarget: userData.monthlyTarget || 80,
      });
    } catch (error) {
      console.error("Error fetching user targets:", error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchUserTargets();
    }
  }, [user]);

  const getDateTitle = () => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };

    switch (activeTab) {
      case "daily":
        return currentDate.toLocaleDateString("en-US", options);
      case "weekly": {
        const startOfWeek = getStartOfWeek(currentDate);
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 5);
        return `${startOfWeek.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        })} - ${endOfWeek.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}`;
      }
      case "monthly":
        return currentDate.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
        });
      default:
        return "";
    }
  };

  const getStartOfWeek = (date: Date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Monday as start
    return new Date(d.setDate(diff));
  };

  const getCurrentTarget = () => {
    switch (activeTab) {
      case "daily":
        return targets.dailyTarget;
      case "weekly":
        return targets.weeklyTarget;
      case "monthly":
        return targets.monthlyTarget;
      default:
        return 0;
    }
  };

  const getProgressPercentage = () => {
    const target = getCurrentTarget();
    const count = stats?.count || 0;
    return Math.min((count / target) * 100, 100);
  };

  const navigateDate = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate);

    switch (activeTab) {
      case "daily":
        newDate.setDate(
          currentDate.getDate() + (direction === "next" ? 1 : -1)
        );
        break;
      case "weekly":
        newDate.setDate(
          currentDate.getDate() + (direction === "next" ? 7 : -7)
        );
        break;
      case "monthly":
        newDate.setMonth(
          currentDate.getMonth() + (direction === "next" ? 1 : -1)
        );
        break;
    }

    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const handleInstallationClick = (installation: Installation) => {
    setSelectedInstallation(installation);
  };

  const handleCloseDetailsModal = () => {
    setSelectedInstallation(null);
  };

  return (
    <>
      <PageHeader
        title={
          <>
            <span className="text-(--color-accent-red)">INSTALLATION</span>{" "}
            <span className="text-(--color-text-primary)">TRACKING</span>
          </>
        }
        subtitle="PERFORMANCE ANALYTICS"
        onMenuToggle={onMenuToggle}
      />

      {/* Tab Navigation */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2 mb-4">
          {(["daily", "weekly", "monthly"] as TabType[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded text-sm font-semibold tracking-wide uppercase transition-all ${
                activeTab === tab
                  ? "bg-(--color-accent-red) text-white border border-(--color-accent-red) shadow-[0_0_20px_rgba(220,38,38,0.3)]"
                  : "bg-(--color-surface) text-(--color-text-secondary) border border-(--color-border) hover:bg-(--color-sidebar-hover)"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Date Navigation */}
        <div className="flex items-center justify-between bg-(--color-surface) border border-(--color-border) rounded-lg p-4">
          <button
            onClick={() => navigateDate("prev")}
            className="p-2 text-(--color-text-secondary) hover:text-(--color-text-primary) hover:bg-(--color-sidebar-hover) rounded"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          <div className="text-center">
            <h2 className="text-(--color-text-primary) font-semibold text-lg">
              {getDateTitle()}
            </h2>
            <button
              onClick={goToToday}
              className="text-(--color-text-muted) text-sm hover:text-(--color-accent-red) transition-colors"
            >
              Go to Today
            </button>
          </div>

          <button
            onClick={() => navigateDate("next")}
            className="p-2 text-(--color-text-secondary) hover:text-(--color-text-primary) hover:bg-(--color-sidebar-hover) rounded"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="9 6 15 12 9 18" />
            </svg>
          </button>
        </div>
      </div>

      {/* Historical Navigation */}
      <div className="mb-6 bg-(--color-surface) border border-(--color-border) rounded-lg p-4">
        <h3 className="text-(--color-text-primary) font-semibold text-sm uppercase tracking-wide mb-3">
          Quick Navigation
        </h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setCurrentDate(new Date())}
            className="px-3 py-1 text-xs bg-(--color-accent-red) text-white rounded hover:bg-red-600 transition-colors"
          >
            Today
          </button>
          <button
            onClick={() => {
              const yesterday = new Date();
              yesterday.setDate(yesterday.getDate() - 1);
              setCurrentDate(yesterday);
            }}
            className="px-3 py-1 text-xs bg-(--color-sidebar-hover) text-(--color-text-primary) rounded hover:bg-(--color-border) transition-colors"
          >
            Yesterday
          </button>
          <button
            onClick={() => {
              const lastWeek = new Date();
              lastWeek.setDate(lastWeek.getDate() - 7);
              setCurrentDate(lastWeek);
            }}
            className="px-3 py-1 text-xs bg-(--color-sidebar-hover) text-(--color-text-primary) rounded hover:bg-(--color-border) transition-colors"
          >
            Last Week
          </button>
          <button
            onClick={() => {
              const lastMonth = new Date();
              lastMonth.setMonth(lastMonth.getMonth() - 1);
              setCurrentDate(lastMonth);
            }}
            className="px-3 py-1 text-xs bg-(--color-sidebar-hover) text-(--color-text-primary) rounded hover:bg-(--color-border) transition-colors"
          >
            Last Month
          </button>
        </div>
      </div>

      {/* Stats Panel */}
      <div className="mb-6 bg-(--color-surface) border border-(--color-border) rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-(--color-text-primary) font-semibold text-lg uppercase tracking-wide">
            {activeTab} Performance
          </h3>
          <div className="text-right">
            <div className="text-2xl font-bold text-(--color-text-primary)">
              {stats?.count || 0} / {getCurrentTarget()}
            </div>
            <div className="text-(--color-text-muted) text-sm">
              Installations Completed
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-sm text-(--color-text-muted) mb-2">
            <span>Progress</span>
            <span>{Math.round(getProgressPercentage())}%</span>
          </div>
          <div className="w-full bg-(--color-border) rounded-full h-3">
            <div
              className="bg-(--color-accent-red) h-3 rounded-full transition-all duration-300 shadow-[0_0_10px_rgba(220,38,38,0.5)]"
              style={{ width: `${getProgressPercentage()}%` }}
            />
          </div>
        </div>

        {getProgressPercentage() >= 100 && (
          <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-3 text-center">
            <span className="text-green-400 font-semibold">
              🎉 Target Achieved!
            </span>
          </div>
        )}
      </div>

      {/* Installations Table */}
      {isLoading ? (
        <div className="bg-(--color-surface) border border-(--color-accent-red) rounded-lg p-8 text-center shadow-[0_0_20px_rgba(220,38,38,0.3)]">
          <div className="flex items-center justify-center gap-3">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="animate-spin text-(--color-accent-red)"
            >
              <path d="M21 12a9 9 0 11-6.219-8.56" />
            </svg>
            <span className="text-(--color-text-secondary) text-sm tracking-[1px] uppercase">
              Loading installations...
            </span>
          </div>
        </div>
      ) : error ? (
        <div className="bg-(--color-surface) border border-(--color-accent-red) rounded-lg p-8 text-center shadow-[0_0_20px_rgba(220,38,38,0.3)]">
          <div className="flex items-center justify-center gap-3 mb-4">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-(--color-accent-red)"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
            <span className="text-(--color-text-primary) font-semibold text-sm tracking-[1px] uppercase">
              Error Loading Data
            </span>
          </div>
          <p className="text-(--color-text-secondary) text-sm">{error}</p>
        </div>
      ) : stats?.installations && stats.installations.length > 0 ? (
        <InstallationsTable
          installations={stats.installations}
          searchQuery=""
          onInstallationClick={handleInstallationClick}
        />
      ) : (
        <div className="bg-(--color-surface) border border-(--color-border) rounded-lg p-8 text-center">
          <div className="text-(--color-text-muted) text-lg mb-2">
            No installations found for this {activeTab.slice(0, -2)}
          </div>
          <p className="text-(--color-text-secondary) text-sm">
            Start adding installations to track your progress!
          </p>
        </div>
      )}

      {/* Installation Details Modal */}
      <InstallationDetailsModal
        installation={selectedInstallation}
        isOpen={!!selectedInstallation}
        onClose={handleCloseDetailsModal}
        onDelete={() => {}} // No delete functionality in tracking page
      />
    </>
  );
}
