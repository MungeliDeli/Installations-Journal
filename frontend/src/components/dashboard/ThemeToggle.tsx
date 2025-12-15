import { useTheme } from "../../contexts/useTheme";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative w-12 h-6 sm:w-14 sm:h-7 bg-(--color-surface) border border-(--color-border) rounded-full p-1 transition-colors focus:outline-none focus:ring-2 focus:ring-(--color-accent-red) focus:ring-offset-2 focus:ring-offset-(--color-background)"
      aria-label="Toggle theme"
    >
      <div
        className={`absolute top-0.5 left-0.5 w-4 h-4 sm:top-1 sm:left-1 sm:w-5 sm:h-5 bg-(--color-accent-red) rounded-full transition-transform duration-300 ease-in-out shadow-[0_0_8px_rgba(220,38,38,0.4)] ${
          theme === "dark" ? "translate-x-0" : "translate-x-5 sm:translate-x-7"
        }`}
      >
        <div className="w-full h-full flex items-center justify-center">
          {theme === "dark" ? (
            <svg
              width="10"
              height="10"
              className="sm:w-3 sm:h-3"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          ) : (
            <svg
              width="10"
              height="10"
              className="sm:w-3 sm:h-3"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
          )}
        </div>
      </div>
    </button>
  );
}

