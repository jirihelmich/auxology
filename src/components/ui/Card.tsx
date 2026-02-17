import type { ReactNode } from 'react';

interface CardProps {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
  headerActions?: ReactNode;
}

export function Card({ title, subtitle, children, className = '', headerActions }: CardProps) {
  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
      {title && (
        <div className="px-5 py-3 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h5 className="font-semibold text-gray-800">
              {title}
              {subtitle && <span className="text-xs font-normal text-gray-500 ml-2">{subtitle}</span>}
            </h5>
          </div>
          {headerActions}
        </div>
      )}
      <div className="p-5">{children}</div>
    </div>
  );
}
