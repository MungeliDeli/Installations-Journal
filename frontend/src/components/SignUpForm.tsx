import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSignup } from "../hooks/useAuth";
import { useAuth } from "../contexts/AuthContext";

export default function SignUpForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();
  const signupMutation = useSignup();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

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
      setError(err.response?.data?.error || "Registration failed");
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
          onChange={(e) => setName(e.target.value)}
          placeholder=""
          className="bg-(--color-background) border border-(--color-border) rounded px-4 py-3 text-(--color-text-primary) text-sm outline-none transition-colors focus:border-(--color-accent-red) focus:shadow-[0_0_8px_rgba(220,38,38,0.2)] placeholder:text-(--color-text-muted)"
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-[11px] text-(--color-text-secondary) tracking-[1px] uppercase font-semibold">
          NEW USER EMAIL
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="new_user@sys.com"
          className="bg-(--color-background) border border-(--color-border) rounded px-4 py-3 text-(--color-text-primary) text-sm outline-none transition-colors focus:border-(--color-accent-red) focus:shadow-[0_0_8px_rgba(220,38,38,0.2)] placeholder:text-(--color-text-muted)"
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-[11px] text-(--color-text-secondary) tracking-[1px] uppercase font-semibold">
          PHONE
        </label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder=""
          className="bg-(--color-background) border border-(--color-border) rounded px-4 py-3 text-(--color-text-primary) text-sm outline-none transition-colors focus:border-(--color-accent-red) focus:shadow-[0_0_8px_rgba(220,38,38,0.2)] placeholder:text-(--color-text-muted)"
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-[11px] text-(--color-text-secondary) tracking-[1px] uppercase font-semibold">
          CREATE SECURITY KEY
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
        INITIATE USER
      </button>

      {error && (
        <div className="text-(--color-accent-red) text-xs text-center mt-2 tracking-[0.5px] font-medium">
          {error}
        </div>
      )}
    </form>
  );
}
