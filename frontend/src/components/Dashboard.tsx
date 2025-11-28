import { useState } from "react";
import Sidebar from "./dashboard/Sidebar";
import DashboardHeader from "./dashboard/DashboardHeader";
import StatsCards from "./dashboard/StatsCards";
import DailyTargetModule from "./dashboard/DailyTargetModule";
import WeeklyPerformanceChart from "./dashboard/WeeklyPerformanceChart";
import { useAuth } from "../contexts/AuthContext";

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-(--color-background) flex relative">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        user={user}
      />
      <div className="flex-1 flex flex-col overflow-x-hidden">
        <div className="flex-1 p-4 lg:p-6">
          <div className="mb-6">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden mb-4 p-2 text-(--color-text-primary) hover:bg-(--color-surface) rounded transition-colors"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
            <DashboardHeader />
          </div>
          <StatsCards />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <DailyTargetModule />
            <WeeklyPerformanceChart />
          </div>
        </div>
      </div>
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}

