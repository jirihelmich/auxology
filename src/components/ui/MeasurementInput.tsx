import { hasDecimal } from '../../utils/formatting';

interface MeasurementInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function MeasurementInput({ label, value, onChange, placeholder = '520' }: MeasurementInputProps) {
  const unit = hasDecimal(value) ? 'cm' : 'mm';

  return (
    <div className="flex items-center gap-4">
      <label className="w-40 shrink-0 text-right text-sm font-medium text-gray-700">{label}</label>
      <div className="flex flex-1">
        <input
          type="text"
          className="w-full rounded-l border border-gray-300 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        <span className="inline-flex items-center px-3 text-sm text-gray-500 bg-gray-100 border border-l-0 border-gray-300 rounded-r min-w-[3rem] justify-center">
          {unit}
        </span>
      </div>
    </div>
  );
}
