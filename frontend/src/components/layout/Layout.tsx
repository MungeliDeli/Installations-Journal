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
    <div className="min-h-screen bg-(--color-background) flex relative">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        user={user}
      />
      <div className="flex-1 flex flex-col overflow-x-hidden">
        <div className="flex-1 p-4 lg:p-6">
          {childrenWithProps}
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