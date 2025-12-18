import { type InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  required?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, required, className = "", ...props }, ref) => {
    return (
      <div className="space-y-1">
        <label className="block text-(--color-text-secondary) text-xs tracking-[1px] uppercase font-semibold">
          {label}
          {required && <span className="text-(--color-accent-red) ml-1">*</span>}
        </label>
        <input
          ref={ref}
          className={`w-full px-3 py-2 bg-(--color-background) border rounded text-(--color-text-primary) placeholder-text-(--color-text-muted) focus:outline-none focus:ring-2 focus:ring-(--color-accent-red) focus:border-transparent transition-all text-sm ${
            error
              ? "border-(--color-accent-red) ring-1 ring-(--color-accent-red)"
              : "border-(--color-border) hover:border-(--color-text-secondary)"
          } ${className}`}
          {...props}
        />
        {error && (
          <p className="text-(--color-accent-red) text-xs tracking-[0.5px]">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;