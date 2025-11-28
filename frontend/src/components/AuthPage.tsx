import { useState } from "react";
import LoginForm from "./LoginForm";
import SignUpForm from "./SignUpForm";

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");

  return (
    <div className="min-h-screen flex items-center justify-center bg-(--color-background) p-4">
      <div className="bg-(--color-surface) border border-(--color-accent-red) rounded-lg p-10 w-full max-w-[480px] shadow-[0_0_20px_rgba(220,38,38,0.3)]">
        <div className="text-center mb-8">
          <div className="text-(--color-accent-red) mx-auto mb-4 flex justify-center items-center w-10 h-10">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="5" y="11" width="14" height="10" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <h1 className="text-[28px] font-bold tracking-[2px] mb-2 uppercase">
            <span className="text-(--color-accent-red)">ACCESS</span>{" "}
            <span className="text-(--color-text-primary)">REQUIRED</span>
          </h1>
          <p className="text-xs text-(--color-text-secondary) tracking-[1px] uppercase">
            INDUSTRIAL TRACKER V.1.0
          </p>
        </div>

        <div className="flex gap-0 mb-8 border-b border-(--color-border)">
          <button
            onClick={() => setActiveTab("login")}
            className={`flex-1 py-3 bg-transparent border-none text-(--color-text-secondary) text-sm font-semibold tracking-[1px] uppercase cursor-pointer transition-colors border-b-2 ${
              activeTab === "login"
                ? "text-(--color-accent-red) border-(--color-accent-red)"
                : "border-transparent hover:text-(--color-text-primary)"
            }`}
          >
            LOGIN
          </button>
          <button
            onClick={() => setActiveTab("signup")}
            className={`flex-1 py-3 bg-transparent border-none text-(--color-text-secondary) text-sm font-semibold tracking-[1px] uppercase cursor-pointer transition-colors border-b-2 ${
              activeTab === "signup"
                ? "text-(--color-accent-red) border-(--color-accent-red)"
                : "border-transparent hover:text-(--color-text-primary)"
            }`}
          >
            SIGN UP
          </button>
        </div>

        <div className="w-full">
          {activeTab === "login" ? <LoginForm /> : <SignUpForm />}
        </div>
      </div>
    </div>
  );
}

