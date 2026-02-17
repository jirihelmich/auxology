import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';

interface Breadcrumb {
  label: string;
  to?: string;
}

interface PageHeaderProps {
  title: string;
  breadcrumbs?: Breadcrumb[];
  actions?: ReactNode;
}

export function PageHeader({ title, breadcrumbs = [], actions }: PageHeaderProps) {
  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      <div>
        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
        {breadcrumbs.length > 0 && (
          <ol className="flex items-center gap-2 text-sm text-gray-500 mt-1">
            {breadcrumbs.map((crumb, i) => (
              <li key={i} className="flex items-center gap-2">
                {i > 0 && <span>/</span>}
                {crumb.to ? (
                  <Link to={crumb.to} className="hover:text-primary">{crumb.label}</Link>
                ) : (
                  <span className="font-medium text-gray-700">{crumb.label}</span>
                )}
              </li>
            ))}
          </ol>
        )}
      </div>
      {actions && <div className="flex items-center gap-2 hidden-print">{actions}</div>}
    </div>
  );
}
