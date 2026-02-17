import type { TextareaHTMLAttributes } from 'react';

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export function TextArea({ label, className = '', ...props }: TextAreaProps) {
  const textarea = (
    <textarea
      className={`w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary ${className}`}
      rows={3}
      {...props}
    />
  );

  if (!label) return textarea;

  return (
    <div className="flex items-start gap-4">
      <label className="w-40 shrink-0 text-right text-sm font-medium text-gray-700 pt-2">{label}</label>
      <div className="flex-1">{textarea}</div>
    </div>
  );
}
