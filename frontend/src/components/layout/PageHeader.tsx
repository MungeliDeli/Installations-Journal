import { type ReactNode } from "react";
import ThemeToggle from "../dashboard/ThemeToggle";

interface PageHeaderProps {
  title: ReactNode;
  subtitle: string;
  onMenuToggle: () => void;
  actions?: ReactNode;
}

export default function PageHeader({ title, subtitle, onMenuToggle, actions }: PageHeaderProps) {
  return (
    <div className="mb-6">
      {/* Mobile/Desktop Top Bar */}
      <div className="flex items-center justify-between mb-4 lg:mb-6">
        {/* Left: Hamburger Menu (Mobile) */}
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 text-(--color-text-primary) hover:bg-(--color-surface) rounded transition-colors"
          aria-label="Toggle menu"
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

        {/* Desktop: Title on left */}
        <div className="hidden lg:block">
          <h1 className="text-[28px] font-bold tracking-[2px] uppercase">
            {title}
          </h1>
        </div>

        {/* Right: Theme Toggle + Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />
          {actions}
        </div>
      </div>

      {/* Mobile: Title and Subtitle Below Top Bar */}
      <div className="lg:hidden mb-4">
        <h1 className="text-[24px] sm:text-[28px] font-bold tracking-[2px] mb-2 uppercase">
          {title}
        </h1>
        <p className="text-xs text-(--color-text-secondary) tracking-[1px] uppercase">
          {subtitle}
        </p>
      </div>

      {/* Desktop: Subtitle Below Title */}
      <div className="hidden lg:block">
        <p className="text-xs text-(--color-text-secondary) tracking-[1px] uppercase">
          {subtitle}
        </p>
      </div>
    </div>
  );
}