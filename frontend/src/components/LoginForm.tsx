import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLogin } from "../hooks/useAuth";
import { useAuth } from "../contexts/AuthContext";
import { validateLoginForm } from "../utils/validation";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();
  const { login } = useAuth();
  const loginMutation = useLogin();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setFieldErrors({});

    // Frontend validation
    const validation = validateLoginForm(email, password);
    if (!validation.isValid) {
      setFieldErrors(validation.errors);
      return;
    }

    try {
      const result = await loginMutation.mutateAsync({ email, password });
      if (result.error) {
        setError(result.error);
      } else if (result.token && result.user) {
        login(result.user, result.token);
        navigate("/dashboard");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <label className="text-[11px] text-(--color-text-secondary) tracking-[1px] uppercase font-semibold">
          EMAIL ADDRESS
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            // Clear error when user types
            if (fieldErrors.email) {
              setFieldErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors.email;
                return newErrors;
              });
            }
          }}
          placeholder="user_id@sys.com"
          className={`bg-(--color-background) border rounded px-4 py-3 text-(--color-text-primary) text-sm outline-none transition-colors placeholder:text-(--color-text-muted) ${
            fieldErrors.email
              ? "border-(--color-accent-red)"
              : "border-(--color-border) focus:border-(--color-accent-red) "
          }`}
          required
        />
        {fieldErrors.email && (
          <span className="text-(--color-accent-red) text-xs mt-1">
            {fieldErrors.email}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-[11px] text-(--color-text-secondary) tracking-[1px] uppercase font-semibold">
          SECURITY KEY (PASSWORD)
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              // Clear error when user types
              if (fieldErrors.password) {
                setFieldErrors((prev) => {
                  const newErrors = { ...prev };
                  delete newErrors.password;
                  return newErrors;
                });
              }
            }}
            placeholder=""
            className={`bg-(--color-background) border rounded px-4 py-3 pr-20 text-(--color-text-primary) text-sm outline-none transition-colors placeholder:text-(--color-text-muted) ${
              fieldErrors.password
                ? "border-(--color-accent-red)"
                : "border-(--color-border) focus:border-(--color-accent-red) focus:"
            }`}
            required
          />

          <button
            type="button"
            onClick={() => setShowPassword((s) => !s)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-(--color-text-muted) hover:text-(--color-text-primary)"
          >
            {showPassword ? (
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-5 0-9.27-3-11-7a11.05 11.05 0 0 1 4.1-5.25" />
                <path d="M1 1l22 22" />
              </svg>
            ) : (
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
        </div>
        {fieldErrors.password && (
          <span className="text-(--color-accent-red) text-xs mt-1">
            {fieldErrors.password}
          </span>
        )}
      </div>

      <button
        type="submit"
        disabled={loginMutation.isPending}
        className="w-full px-6 py-3.5 border-none rounded text-sm font-bold tracking-[1.5px] uppercase cursor-pointer flex items-center justify-center transition-all mt-2 bg-(--color-accent-red) text-(--color-text-primary) disabled:opacity-60 disabled:cursor-not-allowed"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mr-2"
        >
          <rect x="5" y="11" width="14" height="10" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
        {loginMutation.isPending ? "LOGGING IN..." : "SYSTEM LOGIN"}
      </button>

      {error && (
        <div className="text-(--color-accent-red) text-xs text-center mt-2 tracking-[0.5px] font-medium">
          {error}
        </div>
      )}
    </form>
  );
}
