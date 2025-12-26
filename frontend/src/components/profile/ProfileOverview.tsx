import { useAuth } from "../../contexts/AuthContext";

export default function ProfileOverview() {
  const { user } = useAuth();

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Personal Information */}
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
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
          PERSONAL INFORMATION
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-(--color-text-secondary) uppercase tracking-wide">
              Email Address
            </label>
            <p className="text-(--color-text-primary) font-mono text-sm bg-(--color-bg) p-3 rounded border border-(--color-border)">
              {user?.email}
            </p>
          </div>
          
          <div className="space-y-1">
            <label className="text-xs font-semibold text-(--color-text-secondary) uppercase tracking-wide">
              Phone (CUG)
            </label>
            <p className="text-(--color-text-primary) font-mono text-sm bg-(--color-bg) p-3 rounded border border-(--color-border)">
              {user?.phone}
            </p>
          </div>
        </div>
      </div>

      {/* Work Information */}
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
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
            <line x1="8" y1="21" x2="16" y2="21" />
            <line x1="12" y1="17" x2="12" y2="21" />
          </svg>
          WORK INFORMATION
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-(--color-text-secondary) uppercase tracking-wide">
              Start Date
            </label>
            <p className="text-(--color-text-primary) font-mono text-sm bg-(--color-bg) p-3 rounded border border-(--color-border)">
              {user?.startDate ? formatDate(user.startDate) : 'Not set'}
            </p>
          </div>
          
          <div className="space-y-1">
            <label className="text-xs font-semibold text-(--color-text-secondary) uppercase tracking-wide">
              Supervisor
            </label>
            <p className="text-(--color-text-primary) font-mono text-sm bg-(--color-bg) p-3 rounded border border-(--color-border)">
              {user?.supervisor || 'Not assigned'}
            </p>
          </div>
          
          <div className="space-y-1">
            <label className="text-xs font-semibold text-(--color-text-secondary) uppercase tracking-wide">
              Cluster
            </label>
            <p className="text-(--color-text-primary) font-mono text-sm bg-(--color-bg) p-3 rounded border border-(--color-border)">
              {user?.cluster || 'Not assigned'}
            </p>
          </div>
          

        </div>
      </div>

      {/* Performance Targets */}
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
            <path d="M3 3v18h18" />
            <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3" />
          </svg>
          PERFORMANCE TARGETS
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-(--color-text-secondary) uppercase tracking-wide">
              Daily Target
            </label>
            <p className="text-(--color-text-primary) font-mono text-sm bg-(--color-bg) p-3 rounded border border-(--color-border)">
              {user?.dailyTarget || 4} installations/day
            </p>
          </div>
          
          <div className="space-y-1">
            <label className="text-xs font-semibold text-(--color-text-secondary) uppercase tracking-wide">
              Weekly Target
            </label>
            <p className="text-(--color-text-primary) font-mono text-sm bg-(--color-bg) p-3 rounded border border-(--color-border)">
              {user?.weeklyTarget || 20} installations/week
            </p>
          </div>
          
          <div className="space-y-1">
            <label className="text-xs font-semibold text-(--color-text-secondary) uppercase tracking-wide">
              Monthly Target
            </label>
            <p className="text-(--color-text-primary) font-mono text-sm bg-(--color-bg) p-3 rounded border border-(--color-border)">
              {user?.monthlyTarget || 80} installations/month
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}