import PageHeader from "../components/layout/PageHeader";
import StatsCards from "../components/dashboard/StatsCards";
import InteractiveChart from "../components/dashboard/InteractiveChart";
import PerformanceMetrics from "../components/dashboard/PerformanceMetrics";
import QuickStats from "../components/dashboard/QuickStats";
import ResponsiveButton from "../components/ui/ResponsiveButton";
import { useState } from "react";
import NewInstallationModal from "../components/installations/NewInstallationModal";

interface DashboardPageProps {
  onMenuToggle?: () => void;
}

export default function DashboardPage({
  onMenuToggle = () => {},
}: DashboardPageProps) {
  const [isNewInstallationModalOpen, setIsNewInstallationModalOpen] =
    useState(false);
  const headerActions = (
    <ResponsiveButton
      variant="filled"
      color="green"
      size="md"
      onClick={() => setIsNewInstallationModalOpen(true)}
      ariaLabel="Create new installation entry"
      icon={
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      }
    >
      NEW INSTALLATION 
    </ResponsiveButton>
  );

  return (
    <>
      <div className="space-y-6">
        <PageHeader
          title={
            <>
              <span className="text-(--color-accent-red)">CONTROL</span>{" "}
              <span className="text-(--color-text-primary)">PANEL</span>
            </>
          }
          subtitle="REAL-TIME SYSTEM OVERVIEW"
          onMenuToggle={onMenuToggle}
          actions={headerActions}
        />

        {/* Main Stats Cards */}
        <StatsCards />

        {/* Interactive Chart */}
        <InteractiveChart />

        {/* Performance Metrics and Quick Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <PerformanceMetrics />
          </div>
          <div>
            <QuickStats />
          </div>
        </div>
      </div>
      <NewInstallationModal
        isOpen={isNewInstallationModalOpen}
        onClose={() => setIsNewInstallationModalOpen(false)}
      />
    </>
  );
}
