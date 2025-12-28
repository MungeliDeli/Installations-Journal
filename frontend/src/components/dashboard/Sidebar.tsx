import { useNavigate, useLocation } from "react-router-dom";
import { useAuth, type User } from "../../contexts/AuthContext";
import { getImageUrl } from "../../utils/config";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
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
    { path: "/installations", label: "INSTALLATIONS", icon: "installations" },
    { path: "/tracking", label: "TRACKING", icon: "tracking" },
    { path: "/profile", label: "PROFILE", icon: "profile" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-(--color-sidebar-bg) border-r border-(--color-border) transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-full overflow-hidden">
          <div className="p-4 pt-6">
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
            <div className="flex items-center gap-4 px-2 py-3">
              <img
                src="/STRATUM_LOGO.png"
                alt="STRATUM Logo"
                className="h-12 w-12 object-contain"
              />
              <span className="text-(--color-text-primary) text-[24px] font-extrabold tracking-[0.25em] uppercase">
                STRATUM
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
                className={`w-full mb-3 px-4 py-3 rounded flex items-center gap-3 text-left transition-all duration-200 ${
                  isActive(item.path)
                    ? "bg-(--color-sidebar-active) border border-(--color-border) text-white"
                    : "border border-transparent text-(--color-text-secondary) hover:bg-(--color-sidebar-hover) hover:text-(--color-text-primary)"
                }`}
              >
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full border ${
                    isActive(item.path)
                      ? "border-[rgba(255,255,255,0.35)] bg-[rgba(0,0,0,0.3)]"
                      : "border-[rgba(148,163,184,0.4)] bg-[rgba(15,23,42,0.8)]"
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
                  {item.icon === "installations" && (
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
                  {item.icon === "tracking" && (
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M3 3v18h18" />
                      <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3" />
                    </svg>
                  )}
                  {item.icon === "profile" && (
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
                </div>
                <span
                  className={`text-sm font-semibold tracking-wide uppercase ${
                    isActive(item.path)
                      ? "text-white"
                      : "text-(--color-text-secondary)"
                  }`}
                >
                  {item.label}
                </span>
              </button>
            ))}
          </nav>

          <div className="p-4 border-t border-(--color-border)">
            {user && (
              <div className="mb-4 p-3 bg-(--color-surface) rounded">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 rounded-full bg-(--color-accent-red) flex items-center justify-center text-white font-semibold text-lg overflow-hidden">
                    {getImageUrl(user.profileImage) ? (
                      <img
                        src={getImageUrl(user.profileImage)!}
                        alt={user.name}
                        className="w-full h-full rounded-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = "none";
                          target.nextElementSibling!.textContent = user.name
                            .charAt(0)
                            .toUpperCase();
                        }}
                      />
                    ) : null}
                    <span
                      className={
                        getImageUrl(user.profileImage) ? "hidden" : "block"
                      }
                    >
                      {user.name.charAt(0).toUpperCase()}
                    </span>
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
