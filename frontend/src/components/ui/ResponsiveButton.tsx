import { type ReactNode } from "react";

interface ResponsiveButtonProps {
  variant?: "filled" | "outlined";
  color?: "red" | "green" | "blue";
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
  disabled?: boolean;
  icon: ReactNode;
  children: ReactNode;
  className?: string;
  ariaLabel?: string;
}

export default function ResponsiveButton({
  variant = "filled",
  color = "red",
  size = "md",
  onClick,
  disabled = false,
  icon,
  children,
  className = "",
  ariaLabel,
}: ResponsiveButtonProps) {
  const baseClasses = "inline-flex items-center justify-center font-semibold tracking-[1px] uppercase transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-(--color-background) disabled:opacity-50 disabled:cursor-not-allowed";
  
  const sizeClasses = {
    sm: "h-8 px-3 text-xs rounded",
    md: "h-10 px-4 text-xs rounded-md",
    lg: "h-12 px-6 text-sm rounded-lg",
  };

  const colorClasses = {
    red: {
      filled: "bg-(--color-accent-red) text-white hover:bg-red-700 focus:ring-(--color-accent-red) shadow-[0_0_10px_rgba(220,38,38,0.3)]",
      outlined: "border-2 border-(--color-accent-red) text-(--color-accent-red) hover:bg-(--color-accent-red) hover:text-white focus:ring-(--color-accent-red)",
    },
    green: {
      filled: "bg-green-600 text-white hover:bg-green-700 focus:ring-green-600 shadow-[0_0_10px_rgba(34,197,94,0.3)]",
      outlined: "border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white focus:ring-green-600",
    },
    blue: {
      filled: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.3)]",
      outlined: "border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white focus:ring-blue-600",
    },
  };

  const classes = `${baseClasses} ${sizeClasses[size]} ${colorClasses[color][variant]} ${className}`;

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={classes}
      aria-label={ariaLabel}
    >
      {/* Mobile: Icon Only */}
      <span className="lg:hidden">
        {icon}
      </span>
      
      {/* Desktop: Icon + Text */}
      <span className="hidden lg:flex lg:items-center lg:gap-2">
        {icon}
        {children}
      </span>
    </button>
  );
}