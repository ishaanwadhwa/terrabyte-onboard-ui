import { useTheme } from "../../context/ThemeContext";

export const ThemeToggleButton: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative flex items-center h-9 w-16 sm:w-32 rounded-full border transition-colors overflow-hidden border-gray-300 bg-gray-100 text-gray-700 hover:bg-gray-200 dark:border-brand-600 dark:bg-brand-600 dark:text-white"
      aria-label="Toggle theme"
    >
      {/* Centered label on desktop */}
      <span className="absolute inset-0 hidden sm:flex items-center justify-center text-[11px] font-semibold tracking-wide">
        {theme === "dark" ? "DARK MODE" : "LIGHT MODE"}
      </span>

      {/* Knob with icon */}
      <span
        className={`absolute top-1/2 -translate-y-1/2 h-6 w-6 rounded-full border flex items-center justify-center transition-all duration-200 ${
          theme === "dark"
            ? "right-1 border-white/30 bg-black/40 text-white"
            : "left-1 border-gray-300 bg-white text-gray-700"
        }`}
      >
        {theme === "dark" ? (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2" />
            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        )}
      </span>

      {/* No separate center icon on mobile; knob carries the icon */}
    </button>
  );
};
