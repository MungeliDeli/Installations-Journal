import { useState } from "react";
import LoginForm from "./LoginForm";
import SignUpForm from "./SignUpForm";

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");

  return (
    <div className="min-h-screen flex items-center justify-center bg-(--color-background) p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Floating Circuit Nodes - More dots with higher opacity */}
        <div className="absolute top-20 left-10 w-2 h-2 bg-(--color-accent-red) rounded-full opacity-80 animate-pulse"></div>
        <div
          className="absolute top-32 right-20 w-1 h-1 bg-(--color-accent-red) rounded-full opacity-70 animate-ping"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute bottom-40 left-20 w-1.5 h-1.5 bg-(--color-accent-red) rounded-full opacity-75 animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute bottom-20 right-10 w-2 h-2 bg-(--color-accent-red) rounded-full opacity-60 animate-ping"
          style={{ animationDelay: "3s" }}
        ></div>

        {/* Additional Circuit Nodes */}
        <div
          className="absolute top-40 left-1/3 w-1.5 h-1.5 bg-(--color-accent-red) rounded-full opacity-65 animate-pulse"
          style={{ animationDelay: "0.5s" }}
        ></div>
        <div
          className="absolute top-60 right-1/3 w-1 h-1 bg-(--color-accent-red) rounded-full opacity-70 animate-ping"
          style={{ animationDelay: "1.5s" }}
        ></div>
        <div
          className="absolute bottom-60 left-1/4 w-2 h-2 bg-(--color-accent-red) rounded-full opacity-55 animate-pulse"
          style={{ animationDelay: "2.5s" }}
        ></div>
        <div
          className="absolute bottom-32 right-1/4 w-1.5 h-1.5 bg-(--color-accent-red) rounded-full opacity-65 animate-ping"
          style={{ animationDelay: "3.5s" }}
        ></div>
        <div
          className="absolute top-1/2 left-12 w-1 h-1 bg-(--color-accent-red) rounded-full opacity-60 animate-pulse"
          style={{ animationDelay: "4s" }}
        ></div>
        <div
          className="absolute top-3/4 right-12 w-1.5 h-1.5 bg-(--color-accent-red) rounded-full opacity-70 animate-ping"
          style={{ animationDelay: "4.5s" }}
        ></div>
        <div
          className="absolute top-1/4 right-16 w-1 h-1 bg-(--color-accent-red) rounded-full opacity-65 animate-pulse"
          style={{ animationDelay: "5s" }}
        ></div>
        <div
          className="absolute bottom-1/4 left-16 w-2 h-2 bg-(--color-accent-red) rounded-full opacity-55 animate-ping"
          style={{ animationDelay: "5.5s" }}
        ></div>

        {/* More scattered dots */}
        <div
          className="absolute top-16 left-1/2 w-1 h-1 bg-(--color-accent-red) rounded-full opacity-60 animate-pulse"
          style={{ animationDelay: "6s" }}
        ></div>
        <div
          className="absolute bottom-16 right-1/2 w-1.5 h-1.5 bg-(--color-accent-red) rounded-full opacity-70 animate-ping"
          style={{ animationDelay: "6.5s" }}
        ></div>
        <div
          className="absolute top-2/3 left-8 w-1 h-1 bg-(--color-accent-red) rounded-full opacity-65 animate-pulse"
          style={{ animationDelay: "7s" }}
        ></div>
        <div
          className="absolute bottom-2/3 right-8 w-1.5 h-1.5 bg-(--color-accent-red) rounded-full opacity-60 animate-ping"
          style={{ animationDelay: "7.5s" }}
        ></div>

        {/* Floating Geometric Shapes - Higher opacity */}
        <div
          className="absolute top-1/4 left-8 w-8 h-8 border border-(--color-accent-red) opacity-35 rotate-45 animate-spin"
          style={{ animationDuration: "20s" }}
        ></div>
        <div
          className="absolute bottom-1/4 right-8 w-6 h-6 border border-(--color-accent-red) opacity-30 animate-spin"
          style={{ animationDuration: "15s", animationDirection: "reverse" }}
        ></div>

        {/* Circuit Lines - Higher opacity */}
        <svg
          className="absolute top-0 left-0 w-full h-full opacity-25"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="circuit"
              x="0"
              y="0"
              width="100"
              height="100"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 10 10 L 90 10 L 90 90 L 10 90 Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
                className="text-(--color-accent-red)"
              />
              <circle
                cx="10"
                cy="10"
                r="1"
                fill="currentColor"
                className="text-(--color-accent-red)"
              />
              <circle
                cx="90"
                cy="10"
                r="1"
                fill="currentColor"
                className="text-(--color-accent-red)"
              />
              <circle
                cx="90"
                cy="90"
                r="1"
                fill="currentColor"
                className="text-(--color-accent-red)"
              />
              <circle
                cx="10"
                cy="90"
                r="1"
                fill="currentColor"
                className="text-(--color-accent-red)"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#circuit)" />
        </svg>

        {/* Floating Data Streams - Higher opacity */}
        <div
          className="absolute top-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-(--color-accent-red) to-transparent opacity-35 animate-pulse"
          style={{ animationDelay: "0.5s" }}
        ></div>
        <div
          className="absolute bottom-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-(--color-accent-red) to-transparent opacity-30 animate-pulse"
          style={{ animationDelay: "2.5s" }}
        ></div>

        {/* Hexagonal Grid Elements - Higher opacity */}
        <div className="absolute top-16 right-1/4 opacity-25">
          <svg
            width="40"
            height="40"
            viewBox="0 0 40 40"
            className="text-(--color-accent-red) animate-spin"
            style={{ animationDuration: "30s" }}
          >
            <polygon
              points="20,2 35,12 35,28 20,38 5,28 5,12"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
            />
            <polygon
              points="20,8 29,14 29,26 20,32 11,26 11,14"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
            />
          </svg>
        </div>

        {/* Moving Particles - Higher opacity */}
        <div
          className="absolute top-1/2 left-4 w-1 h-1 bg-(--color-accent-red) rounded-full opacity-60 animate-bounce"
          style={{ animationDelay: "1s", animationDuration: "3s" }}
        ></div>
        <div
          className="absolute top-3/4 right-6 w-1 h-1 bg-(--color-accent-red) rounded-full opacity-55 animate-bounce"
          style={{ animationDelay: "2s", animationDuration: "4s" }}
        ></div>

        {/* Scanning Lines - Higher opacity */}
        <div className="absolute left-0 top-0 w-full h-full">
          <div className="absolute w-full h-px bg-gradient-to-r from-transparent via-(--color-accent-red) to-transparent opacity-35 animate-scan-vertical"></div>
        </div>
      </div>

      {/* Main Form Container */}
      <div className="bg-(--color-surface) border border-(--color-accent-red) rounded-lg p-10 w-full max-w-[480px]  relative z-10 backdrop-blur-sm">
        <div className="text-center mb-8">
          <div className="flex justify-center items-center mb-4">
            <img
              src="/STRATUM_LOGO.png"
              alt="STRATUM Logo"
              className="h-16 w-16 object-contain"
            />
          </div>
          <h1 className="text-[28px] font-bold tracking-[2px] mb-2 uppercase">
            <span className="text-(--color-accent-red)">STRATUM</span>{" "}
            <span className="text-(--color-text-primary)">ACCESS</span>
          </h1>
          <p className="text-xs text-(--color-text-secondary) tracking-[1px] uppercase">
            INSTALLATION TRACKER SYSTEM
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

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes scan-vertical {
          0% {
            top: -2px;
          }
          100% {
            top: 100%;
          }
        }
        .animate-scan-vertical {
          animation: scan-vertical 8s linear infinite;
        }
      `}</style>
    </div>
  );
}
