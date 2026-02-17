import { Input } from '../ui/Input';
import { TextArea } from '../ui/TextArea';
import { MeasurementInput } from '../ui/MeasurementInput';
import { birthDateFromNumber } from '../../utils/age';

interface PersonSubFormProps {
  data: {
    birthNumber: string;
    firstname: string;
    lastname: string;
    weight: string;
    length: string;
    headCircumference: string;
    description: string;
    phone: string;
    email: string;
  };
  onChange: (field: string, value: string) => void;
  genderLabel: string;
  firstnamePlaceholder?: string;
  lastnamePlaceholder?: string;
}

export function PersonSubForm({ data, onChange, genderLabel, firstnamePlaceholder = 'Jana', lastnamePlaceholder = 'Nováková' }: PersonSubFormProps) {
  return (
    <div className="space-y-4">
      <Input label="Rodné číslo" placeholder="260212/2457" value={data.birthNumber} onChange={(e) => onChange('birthNumber', e.target.value)} />

      <div className="flex items-center gap-4">
        <label className="w-40 shrink-0 text-right text-sm font-medium text-gray-700">Datum narození</label>
        <p className="text-sm text-gray-600">{birthDateFromNumber(data.birthNumber || '')}</p>
      </div>

      <hr className="border-dashed" />

      <MeasurementInput label="Výška" value={data.length} onChange={(v) => onChange('length', v)} />

      <Input label="Hmotnost" type="number" placeholder="520" suffix="g" value={data.weight} onChange={(e) => onChange('weight', e.target.value)} />

      <MeasurementInput label="Obvod hlavy" value={data.headCircumference} onChange={(v) => onChange('headCircumference', v)} placeholder="375" />

      <hr className="border-dashed" />

      <div className="flex items-center gap-4">
        <label className="w-40 shrink-0 text-right text-sm font-medium text-gray-700">Pohlaví</label>
        <p className="text-sm text-gray-600">{genderLabel}</p>
      </div>

      <Input label="Jméno" placeholder={firstnamePlaceholder} value={data.firstname} onChange={(e) => onChange('firstname', e.target.value)} />
      <Input label="Příjmení" placeholder={lastnamePlaceholder} value={data.lastname} onChange={(e) => onChange('lastname', e.target.value)} />

      <hr className="border-dashed" />

      <TextArea label="Poznámky" value={data.description} onChange={(e) => onChange('description', e.target.value)} />

      <hr className="border-dashed" />

      <Input label="Telefon" placeholder="777 777 770" value={data.phone} onChange={(e) => onChange('phone', e.target.value)} />
      <Input label="E-mail" type="email" placeholder="jana@novak.cz" value={data.email} onChange={(e) => onChange('email', e.target.value)} />
    </div>
  );
}
