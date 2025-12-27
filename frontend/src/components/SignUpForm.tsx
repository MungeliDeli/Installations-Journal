import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSignup } from "../hooks/useAuth";
import { useAuth } from "../contexts/AuthContext";
import { validateSignupForm } from "../utils/validation";

export default function SignUpForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();
  const signupMutation = useSignup();
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const clearFieldError = (field: string) => {
    setFieldErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setFieldErrors({});

    // Frontend validation
    const validation = validateSignupForm(name, email, phone, password);
    if (!validation.isValid) {
      setFieldErrors(validation.errors);
      return;
    }

    try {
      const result = await signupMutation.mutateAsync({
        name,
        email,
        phone,
        password,
      });
      if (result.error) {
        setError(result.error);
      } else if (result.token && result.user) {
        login(result.user, result.token);
        navigate("/dashboard");
      }
    } catch (err: any) {
      const backend = err.response?.data;

      // Field-level errors from backend
      if (backend?.errors) {
        const grouped: Record<string, string> = {};

        backend.errors.forEach((e: any) => {
          // Take the first error message for each field
          if (!grouped[e.field]) {
            grouped[e.field] = e.message;
          }
        });

        setFieldErrors(grouped);
      }

      // Global error banner
      setError(backend?.message || "Registration failed");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <label className="text-[11px] text-(--color-text-secondary) tracking-[1px] uppercase font-semibold">
          NAME
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            clearFieldError("name");
          }}
          placeholder=""
          className={`bg-(--color-background) border rounded px-4 py-3 text-(--color-text-primary) text-sm outline-none transition-colors placeholder:text-(--color-text-muted) ${
            fieldErrors.name
              ? "border-(--color-accent-red)"
              : "border-(--color-border) focus:border-(--color-accent-red) focus:shadow-[0_0_8px_rgba(220,38,38,0.2)]"
          }`}
          required
        />
        {fieldErrors.name && (
          <span className="text-(--color-accent-red) text-xs mt-1">
            {fieldErrors.name}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-[11px] text-(--color-text-secondary) tracking-[1px] uppercase font-semibold">
          NEW USER EMAIL
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            clearFieldError("email");
          }}
          placeholder="new_user@sys.com"
          className={`bg-(--color-background) border rounded px-4 py-3 text-(--color-text-primary) text-sm outline-none transition-colors placeholder:text-(--color-text-muted) ${
            fieldErrors.email
              ? "border-(--color-accent-red)"
              : "border-(--color-border) focus:border-(--color-accent-red) focus:shadow-[0_0_8px_rgba(220,38,38,0.2)]"
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
          PHONE
        </label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => {
            setPhone(e.target.value);
            clearFieldError("phone");
          }}
          placeholder=""
          className={`bg-(--color-background) border rounded px-4 py-3 text-(--color-text-primary) text-sm outline-none transition-colors placeholder:text-(--color-text-muted) ${
            fieldErrors.phone
              ? "border-(--color-accent-red)"
              : "border-(--color-border) focus:border-(--color-accent-red) focus:shadow-[0_0_8px_rgba(220,38,38,0.2)]"
          }`}
          required
        />
        {fieldErrors.phone && (
          <span className="text-(--color-accent-red) text-xs mt-1">
            {fieldErrors.phone}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-[11px] text-(--color-text-secondary) tracking-[1px] uppercase font-semibold">
          CREATE SECURITY KEY
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              clearFieldError("password");
            }}
            placeholder=""
            className={`bg-(--color-background) border rounded px-4 py-3 pr-20 text-(--color-text-primary) text-sm outline-none transition-colors placeholder:text-(--color-text-muted) ${
              fieldErrors.password
                ? "border-(--color-accent-red)"
                : "border-(--color-border) focus:border-(--color-accent-red) focus:shadow-[0_0_8px_rgba(220,38,38,0.2)]"
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
        disabled={signupMutation.isPending}
        className="w-full px-6 py-3.5 border-none rounded text-sm font-bold tracking-[1.5px] uppercase cursor-pointer flex items-center justify-center transition-all mt-2 bg-(--color-success) text-(--color-text-primary) shadow-[0_0_15px_rgba(34,197,94,0.4)] hover:bg-[#16a34a] hover:shadow-[0_0_20px_rgba(34,197,94,0.6)] disabled:opacity-60 disabled:cursor-not-allowed"
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
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <line x1="19" y1="8" x2="19" y2="14" />
          <line x1="22" y1="11" x2="16" y2="11" />
        </svg>
        {signupMutation.isPending ? "CREATING USER..." : "INITIATE USER"}
      </button>

      {error && (
        <div className="text-(--color-accent-red) text-xs text-center mt-2 tracking-[0.5px] font-medium">
          {error}
        </div>
      )}
    </form>
  );
}
