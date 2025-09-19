import { Link } from "react-router";

interface CrumbItem {
  label: string;
  to?: string;
}

interface BreadcrumbProps {
  pageTitle: string;
  parents?: CrumbItem[];
}

const PageBreadcrumb: React.FC<BreadcrumbProps> = ({ pageTitle, parents = [] }) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
      <h2
        className="text-xl font-semibold text-gray-800 dark:text-white/90"
        x-text="pageName"
      >
        {pageTitle}
      </h2>
      <nav>
        <ol className="flex items-center gap-1.5">
          {/* Home */}
          <li className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
            <Link to="/">Home</Link>
          </li>
          {/* Parents */}
          {parents.map((item, idx) => (
            <li key={`${item.label}-${idx}`} className="inline-flex items-center gap-1.5 text-sm">
              <svg
                className="stroke-current text-gray-400 dark:text-gray-500"
                width="17"
                height="16"
                viewBox="0 0 17 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6.0765 12.667L10.2432 8.50033L6.0765 4.33366"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {item.to ? (
                <Link to={item.to} className="text-gray-500 dark:text-gray-400">
                  {item.label}
                </Link>
              ) : (
                <span className="text-gray-800 dark:text-white/90">{item.label}</span>
              )}
            </li>
          ))}
          {/* Current */}
          <li className="inline-flex items-center gap-1.5 text-sm">
            <svg
              className="stroke-current text-gray-400 dark:text-gray-500"
              width="17"
              height="16"
              viewBox="0 0 17 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6.0765 12.667L10.2432 8.50033L6.0765 4.33366"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="text-gray-800 dark:text-white/90">{pageTitle}</span>
          </li>
        </ol>
      </nav>
    </div>
  );
};

export default PageBreadcrumb;
