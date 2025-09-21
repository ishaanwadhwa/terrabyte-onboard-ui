// External links for legal/contact
import { BrandIcon } from "../icons";

const AppFooter: React.FC = () => {
  return (
    <footer className="border-t border-gray-200 dark:border-white/5 py-3 text-theme-xs text-gray-500 dark:text-gray-400">
      <div className="mx-auto max-w-(--breakpoint-2xl) px-2 sm:px-0 flex flex-col sm:flex-row items-center justify-end gap-3">
        <div className="flex items-center gap-2">
          <span className="hidden sm:inline">© {new Date().getFullYear()} Terra-Byte.ai</span>
        </div>
        <nav className="flex items-center gap-4">
          <a
            href="https://terra-byte.ai/privacy"
            className="hover:text-gray-700 dark:hover:text-white/90"
            target="_blank"
            rel="noopener noreferrer"
          >
            Privacy Policy
          </a>
          <a
            href="https://terra-byte.ai/contact"
            className="hover:text-gray-700 dark:hover:text-white/90"
            target="_blank"
            rel="noopener noreferrer"
          >
            Contact Us
          </a>
        </nav>
      </div>
    </footer>
  );
};

export default AppFooter;


