import PageHeader from "../components/layout/PageHeader";
import StatsCards from "../components/dashboard/StatsCards";
import DailyTargetModule from "../components/dashboard/DailyTargetModule";
import WeeklyPerformanceChart from "../components/dashboard/WeeklyPerformanceChart";
import Button from "../components/ui/Button";
import ResponsiveButton from "../components/ui/ResponsiveButton";

interface DashboardPageProps {
  onMenuToggle: () => void;
}

export default function DashboardPage({ onMenuToggle }: DashboardPageProps) {
  const headerActions = (
    <ResponsiveButton
      variant="filled"
      color="green"
      size="md"
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
      NEW INSTALLATION ENTRY
    </ResponsiveButton>
  );

  return (
    <>
      <PageHeader
        title={
          <>
            <span className="text-(--color-accent-red)">CONTROL</span>{" "}
            <span className="text-(--color-text-primary)">PANEL</span>
          </>
        }
        subtitle="SYSTEM OVERVIEW"
        onMenuToggle={onMenuToggle}
        actions={headerActions}
      />
      
      <StatsCards />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <DailyTargetModule />
        <WeeklyPerformanceChart />
      </div>
    </>
  );
}