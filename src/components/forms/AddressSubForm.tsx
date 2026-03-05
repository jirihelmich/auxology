import { Input } from '../ui/Input';
import { useT } from '../../i18n/LanguageContext';

interface AddressSubFormProps {
  data: { street: string; city: string; country: string; zipcode: string };
  onChange: (field: string, value: string) => void;
}

export function AddressSubForm({ data, onChange }: AddressSubFormProps) {
  const { t } = useT();

  return (
    <div className="space-y-4">
      <Input label={t.addressStreet} placeholder="Pražská 38" value={data.street} onChange={(e) => onChange('street', e.target.value)} />
      <Input label={t.addressCity} placeholder="Brandýs nad Labem" value={data.city} onChange={(e) => onChange('city', e.target.value)} />
      <Input label={t.addressCountry} placeholder="Česká republika" value={data.country} onChange={(e) => onChange('country', e.target.value)} />
      <Input label={t.addressZip} placeholder="13526" value={data.zipcode} onChange={(e) => onChange('zipcode', e.target.value)} />
    </div>
  );
}
