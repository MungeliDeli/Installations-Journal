import { useState, type ReactNode, cloneElement, isValidElement } from "react";
import Sidebar from "../dashboard/Sidebar";
import { useAuth } from "../../contexts/AuthContext";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();

  const handleMenuToggle = () => setSidebarOpen(true);

  // Clone children and pass the onMenuToggle prop if it's a valid React element
  const childrenWithProps = isValidElement(children)
    ? cloneElement(children, { onMenuToggle: handleMenuToggle } as any)
    : children;

  return (
    <div className="min-h-screen bg-(--color-background) flex relative overflow-hidden">
      {/* Animated Background Elements - Subtle for main app */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Floating Circuit Nodes - Slightly higher opacity */}
        <div className="absolute top-20 left-10 w-2 h-2 bg-(--color-accent-red) rounded-full opacity-25 animate-pulse"></div>
        <div
          className="absolute top-32 right-20 w-1 h-1 bg-(--color-accent-red) rounded-full opacity-20 animate-ping"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute bottom-40 left-20 w-1.5 h-1.5 bg-(--color-accent-red) rounded-full opacity-28 animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute bottom-20 right-10 w-2 h-2 bg-(--color-accent-red) rounded-full opacity-18 animate-ping"
          style={{ animationDelay: "3s" }}
        ></div>

        {/* Additional Circuit Nodes */}
        <div
          className="absolute top-40 left-1/3 w-1.5 h-1.5 bg-(--color-accent-red) rounded-full opacity-22 animate-pulse"
          style={{ animationDelay: "0.5s" }}
        ></div>
        <div
          className="absolute top-60 right-1/3 w-1 h-1 bg-(--color-accent-red) rounded-full opacity-24 animate-ping"
          style={{ animationDelay: "1.5s" }}
        ></div>
        <div
          className="absolute bottom-60 left-1/4 w-2 h-2 bg-(--color-accent-red) rounded-full opacity-20 animate-pulse"
          style={{ animationDelay: "2.5s" }}
        ></div>
        <div
          className="absolute bottom-32 right-1/4 w-1.5 h-1.5 bg-(--color-accent-red) rounded-full opacity-23 animate-ping"
          style={{ animationDelay: "3.5s" }}
        ></div>
        <div
          className="absolute top-1/2 left-12 w-1 h-1 bg-(--color-accent-red) rounded-full opacity-21 animate-pulse"
          style={{ animationDelay: "4s" }}
        ></div>
        <div
          className="absolute top-3/4 right-12 w-1.5 h-1.5 bg-(--color-accent-red) rounded-full opacity-26 animate-ping"
          style={{ animationDelay: "4.5s" }}
        ></div>
        <div
          className="absolute top-1/4 right-16 w-1 h-1 bg-(--color-accent-red) rounded-full opacity-22 animate-pulse"
          style={{ animationDelay: "5s" }}
        ></div>
        <div
          className="absolute bottom-1/4 left-16 w-2 h-2 bg-(--color-accent-red) rounded-full opacity-19 animate-ping"
          style={{ animationDelay: "5.5s" }}
        ></div>

        {/* More scattered dots */}
        <div
          className="absolute top-16 left-1/2 w-1 h-1 bg-(--color-accent-red) rounded-full opacity-21 animate-pulse"
          style={{ animationDelay: "6s" }}
        ></div>
        <div
          className="absolute bottom-16 right-1/2 w-1.5 h-1.5 bg-(--color-accent-red) rounded-full opacity-24 animate-ping"
          style={{ animationDelay: "6.5s" }}
        ></div>
        <div
          className="absolute top-2/3 left-8 w-1 h-1 bg-(--color-accent-red) rounded-full opacity-22 animate-pulse"
          style={{ animationDelay: "7s" }}
        ></div>
        <div
          className="absolute bottom-2/3 right-8 w-1.5 h-1.5 bg-(--color-accent-red) rounded-full opacity-20 animate-ping"
          style={{ animationDelay: "7.5s" }}
        ></div>

        {/* Floating Geometric Shapes - Slightly higher opacity */}
        <div
          className="absolute top-1/4 left-8 w-8 h-8 border border-(--color-accent-red) opacity-15 rotate-45 animate-spin"
          style={{ animationDuration: "20s" }}
        ></div>
        <div
          className="absolute bottom-1/4 right-8 w-6 h-6 border border-(--color-accent-red) opacity-12 animate-spin"
          style={{ animationDuration: "15s", animationDirection: "reverse" }}
        ></div>

        {/* Circuit Lines - Slightly higher opacity */}
        <svg
          className="absolute top-0 left-0 w-full h-full opacity-12"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="circuit-main"
              x="0"
              y="0"
              width="100"
              height="100"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 10 10 L 90 10 L 90 90 L 10 90 Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
                className="text-(--color-accent-red)"
              />
              <circle
                cx="10"
                cy="10"
                r="1"
                fill="currentColor"
                className="text-(--color-accent-red)"
              />
              <circle
                cx="90"
                cy="10"
                r="1"
                fill="currentColor"
                className="text-(--color-accent-red)"
              />
              <circle
                cx="90"
                cy="90"
                r="1"
                fill="currentColor"
                className="text-(--color-accent-red)"
              />
              <circle
                cx="10"
                cy="90"
                r="1"
                fill="currentColor"
                className="text-(--color-accent-red)"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#circuit-main)" />
        </svg>

        {/* Floating Data Streams - Slightly higher opacity */}
        <div
          className="absolute top-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-(--color-accent-red) to-transparent opacity-16 animate-pulse"
          style={{ animationDelay: "0.5s" }}
        ></div>
        <div
          className="absolute bottom-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-(--color-accent-red) to-transparent opacity-14 animate-pulse"
          style={{ animationDelay: "2.5s" }}
        ></div>

        {/* Hexagonal Grid Elements - Slightly higher opacity */}
        <div className="absolute top-16 right-1/4 opacity-12">
          <svg
            width="40"
            height="40"
            viewBox="0 0 40 40"
            className="text-(--color-accent-red) animate-spin"
            style={{ animationDuration: "30s" }}
          >
            <polygon
              points="20,2 35,12 35,28 20,38 5,28 5,12"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
            />
            <polygon
              points="20,8 29,14 29,26 20,32 11,26 11,14"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
            />
          </svg>
        </div>

        {/* Moving Particles - Slightly higher opacity */}
        <div
          className="absolute top-1/2 left-4 w-1 h-1 bg-(--color-accent-red) rounded-full opacity-20 animate-bounce"
          style={{ animationDelay: "1s", animationDuration: "3s" }}
        ></div>
        <div
          className="absolute top-3/4 right-6 w-1 h-1 bg-(--color-accent-red) rounded-full opacity-18 animate-bounce"
          style={{ animationDelay: "2s", animationDuration: "4s" }}
        ></div>

        {/* Scanning Lines - Slightly higher opacity */}
        <div className="absolute left-0 top-0 w-full h-full">
          <div className="absolute w-full h-px bg-gradient-to-r from-transparent via-(--color-accent-red) to-transparent opacity-16 animate-scan-vertical"></div>
        </div>
      </div>

      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        user={user}
      />
      <div className="flex-1 flex flex-col overflow-x-hidden lg:ml-64 relative z-10">
        <div className="flex-1 p-4 lg:p-6">{childrenWithProps}</div>
      </div>
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Custom CSS for animations */}
      <style>{`
        @keyframes scan-vertical {
          0% {
            top: -2px;
          }
          100% {
            top: 100%;
          }
        }
        .animate-scan-vertical {
          animation: scan-vertical 8s linear infinite;
        }
      `}</style>
    </div>
  );
}
