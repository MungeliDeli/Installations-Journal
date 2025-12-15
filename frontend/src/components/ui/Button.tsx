import { type ReactNode, type ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "filled" | "outlined";
  color?: "red" | "green";
  size?: "sm" | "md" | "lg";
  children: ReactNode;
  icon?: ReactNode;
}

export default function Button({
  variant = "filled",
  color = "red",
  size = "md",
  children,
  icon,
  className = "",
  ...props
}: ButtonProps) {
  const baseClasses = "rounded flex items-center gap-2 font-semibold tracking-[1px] uppercase transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const sizeClasses = {
    sm: "px-3 py-2 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-sm",
  };

  const variantClasses = {
    filled: {
      red: "bg-(--color-accent-red) text-white hover:bg-red-700 shadow-[0_0_15px_rgba(220,38,38,0.4)] hover:shadow-[0_0_20px_rgba(220,38,38,0.6)]",
      green: "bg-(--color-success) text-(--color-text-primary) hover:bg-green-600 shadow-[0_0_15px_rgba(34,197,94,0.4)] hover:shadow-[0_0_20px_rgba(34,197,94,0.6)]",
    },
    outlined: {
      red: "bg-transparent border border-(--color-accent-red) text-(--color-accent-red) hover:bg-(--color-accent-red) hover:text-white",
      green: "bg-transparent border border-(--color-success) text-(--color-success) hover:bg-(--color-success) hover:text-(--color-text-primary)",
    },
  };

  const classes = `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant][color]} ${className}`;

  return (
    <button className={classes} {...props}>
      {icon}
      {children}
    </button>
  );
}