import type { SelectHTMLAttributes } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
}

export function Select({ label, options, className = '', ...props }: SelectProps) {
  const select = (
    <select
      className={`w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-white ${className}`}
      {...props}
    >
      <option value="">---</option>
      {options.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  );

  if (!label) return select;

  return (
    <div className="flex items-center gap-4">
      <label className="w-40 shrink-0 text-right text-sm font-medium text-gray-700">{label}</label>
      <div className="flex-1">{select}</div>
    </div>
  );
}
