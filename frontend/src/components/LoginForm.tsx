import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLogin } from "../hooks/useAuth";
import { useAuth } from "../contexts/AuthContext";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();
  const loginMutation = useLogin();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const result = await loginMutation.mutateAsync({ email, password });
      if (result.error) {
        setError(result.error);
      } else if (result.token && result.user) {
        login(result.user, result.token);
        navigate("/dashboard");
      }
    } catch (err: any) {
      setError(err.response?.data?.error || "[ERR: PWD RESET OFFLINE]");
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
          onChange={(e) => setEmail(e.target.value)}
          placeholder="user_id@sys.com"
          className="bg-(--color-background) border border-(--color-border) rounded px-4 py-3 text-(--color-text-primary) text-sm outline-none transition-colors focus:border-(--color-accent-red) focus:shadow-[0_0_8px_rgba(220,38,38,0.2)] placeholder:text-(--color-text-muted)"
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-[11px] text-(--color-text-secondary) tracking-[1px] uppercase font-semibold">
          SECURITY KEY (PASSWORD)
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder=""
          className="bg-(--color-background) border border-(--color-border) rounded px-4 py-3 text-(--color-text-primary) text-sm outline-none transition-colors focus:border-(--color-accent-red) focus:shadow-[0_0_8px_rgba(220,38,38,0.2)] placeholder:text-(--color-text-muted)"
          required
        />
      </div>

      <button
        type="submit"
        disabled={loginMutation.isPending}
        className="w-full px-6 py-3.5 border-none rounded text-sm font-bold tracking-[1.5px] uppercase cursor-pointer flex items-center justify-center transition-all mt-2 bg-(--color-accent-red) text-(--color-text-primary) shadow-[0_0_15px_rgba(220,38,38,0.4)] hover:bg-(--color-primary-hover) hover:shadow-[0_0_20px_rgba(220,38,38,0.6)] disabled:opacity-60 disabled:cursor-not-allowed"
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
        SYSTEM LOGIN
      </button>

      {error && (
        <div className="text-(--color-accent-red) text-xs text-center mt-2 tracking-[0.5px] font-medium">
          {error}
        </div>
      )}
    </form>
  );
}
