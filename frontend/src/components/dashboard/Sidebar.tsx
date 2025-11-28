import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  user: { id: string; name: string; email: string } | null;
}

export default function Sidebar({ isOpen, onClose, user }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const menuItems = [
    { path: "/dashboard", label: "DASHBOARD", icon: "dashboard" },
    { path: "/journal", label: "JOURNAL (F01)", icon: "journal" },
    { path: "/settings", label: "SETTINGS (UAC)", icon: "settings" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <div
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-(--color-sidebar-bg) border-r border-(--color-border) transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-full overflow-hidden">
          <div className="p-4">
            <button
              onClick={onClose}
              className="lg:hidden mb-4 p-2 text-(--color-text-primary) hover:bg-(--color-surface) rounded"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
            <div className="bg-(--color-accent-red) px-4 py-3 rounded flex items-center gap-2 shadow-[0_0_15px_rgba(220,38,38,0.4)]">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-white"
              >
                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
              </svg>
              <span className="text-white font-semibold text-sm uppercase tracking-wide">
                SYS/INTL
              </span>
            </div>
          </div>

          <nav className="flex-1 overflow-y-auto px-4 pb-4">
            {menuItems.map((item) => (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  onClose();
                }}
                className={`w-full mb-2 px-4 py-3 rounded flex items-center gap-3 transition-colors ${
                  isActive(item.path)
                    ? "bg-(--color-sidebar-active) text-(--color-text-primary) shadow-[0_0_10px_rgba(220,38,38,0.3)]"
                    : "text-(--color-text-secondary) hover:bg-(--color-sidebar-hover) hover:text-(--color-text-primary)"
                }`}
              >
                {item.icon === "dashboard" && (
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <rect x="3" y="3" width="7" height="7" />
                    <rect x="14" y="3" width="7" height="7" />
                    <rect x="14" y="14" width="7" height="7" />
                    <rect x="3" y="14" width="7" height="7" />
                  </svg>
                )}
                {item.icon === "journal" && (
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                  </svg>
                )}
                {item.icon === "settings" && (
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle cx="12" cy="12" r="3" />
                    <path d="M12 1v6m0 6v6M5.64 5.64l4.24 4.24m4.24 4.24l4.24 4.24M1 12h6m6 0h6M5.64 18.36l4.24-4.24m4.24-4.24l4.24-4.24" />
                  </svg>
                )}
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="p-4 border-t border-(--color-border)">
            {user && (
              <div className="mb-4 p-3 bg-(--color-surface) rounded">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-(--color-accent-red) flex items-center justify-center text-white font-semibold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-(--color-text-primary) text-sm font-medium truncate">
                      {user.name}
                    </p>
                    <p className="text-(--color-text-muted) text-xs truncate">
                      {user.email}
                    </p>
                  </div>
                </div>
              </div>
            )}
            <button
              onClick={handleLogout}
              className="w-full px-4 py-3 rounded flex items-center gap-3 text-(--color-text-secondary) hover:bg-(--color-sidebar-hover) hover:text-(--color-text-primary) transition-colors"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              <span className="text-sm font-medium">LOGOUT</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

