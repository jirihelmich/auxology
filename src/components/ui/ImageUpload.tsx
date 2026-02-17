import { useCallback, type ChangeEvent } from 'react';

interface ImageUploadProps {
  label: string;
  value: string | null | undefined;
  onChange: (base64: string | null) => void;
}

export function ImageUpload({ label, value, onChange }: ImageUploadProps) {
  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      onChange(reader.result as string);
    };
    reader.readAsDataURL(file);
  }, [onChange]);

  return (
    <div className="flex items-start gap-4">
      <label className="w-40 shrink-0 text-right text-sm font-medium text-gray-700 pt-2">{label}</label>
      <div className="flex-1">
        <input type="file" accept="image/*" onChange={handleChange} className="text-sm" />
        {value && (
          <img src={value} alt="Náhled" className="mt-2 max-w-[300px] max-h-[200px] rounded" />
        )}
      </div>
    </div>
  );
}
