import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { usePatients, type PatientFormData, type ParentFormData } from '../../hooks/usePatients';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { TextArea } from '../ui/TextArea';
import { MeasurementInput } from '../ui/MeasurementInput';
import { Button } from '../ui/Button';
import { PersonSubForm } from './PersonSubForm';
import { AddressSubForm } from './AddressSubForm';
import { birthDateFromNumber } from '../../utils/age';

interface PatientFormProps {
  initialPatient?: PatientFormData;
  initialMother?: ParentFormData;
  initialFather?: ParentFormData;
  isEdit?: boolean;
}

const emptyAddress = { street: '', city: '', country: '', zipcode: '' };

export function PatientForm({ initialPatient, initialMother, initialFather, isEdit = false }: PatientFormProps) {
  const { createOrUpdate } = usePatients();
  const navigate = useNavigate();

  const [patient, setPatient] = useState<PatientFormData>(initialPatient || {
    birthNumber: '', gender: '', birthWeight: 0, birthWeek: 0, expectedBirthDate: '',
    firstname: '', lastname: '', description: '', birthLength: '', birthHeadCircumference: '',
    address: { ...emptyAddress },
  });

  const [mother, setMother] = useState({
    birthNumber: initialMother?.birthNumber || '',
    firstname: initialMother?.firstname || '',
    lastname: initialMother?.lastname || '',
    weight: String(initialMother?.weight || ''),
    length: String(initialMother?.length || ''),
    headCircumference: String(initialMother?.headCircumference || ''),
    description: initialMother?.description || '',
    phone: initialMother?.phone || '',
    email: initialMother?.email || '',
  });
  const [motherAddress, setMotherAddress] = useState(initialMother?.address || { ...emptyAddress });

  const [father, setFather] = useState({
    birthNumber: initialFather?.birthNumber || '',
    firstname: initialFather?.firstname || '',
    lastname: initialFather?.lastname || '',
    weight: String(initialFather?.weight || ''),
    length: String(initialFather?.length || ''),
    headCircumference: String(initialFather?.headCircumference || ''),
    description: initialFather?.description || '',
    phone: initialFather?.phone || '',
    email: initialFather?.email || '',
  });
  const [fatherAddress, setFatherAddress] = useState(initialFather?.address || { ...emptyAddress });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    let hasError = false;
    if (!patient.birthNumber) { toast.error('Není zadáno rodné číslo.'); hasError = true; }
    if (!patient.birthWeight) { toast.error('Není zadána porodní hmotnost. Maximální povolená porodní hmotnost je 2500 g.'); hasError = true; }
    if (!patient.gender) { toast.error('Není vybráno pohlaví.'); hasError = true; }
    if (!patient.birthWeek) { toast.error('Není zadán gestační týden narození. Maximální povolený gestační týden narození je 37.'); hasError = true; }
    if (hasError) return;

    try {
      const motherData: ParentFormData = {
        id: initialMother?.id,
        birthNumber: mother.birthNumber,
        gender: 'female',
        firstname: mother.firstname,
        lastname: mother.lastname,
        weight: mother.weight ? parseInt(mother.weight) : undefined,
        length: mother.length || undefined,
        headCircumference: mother.headCircumference || undefined,
        description: mother.description,
        phone: mother.phone,
        email: mother.email,
        address: { id: (initialMother?.address as Record<string, unknown>)?.id as number | undefined, ...motherAddress },
      };

      const fatherData: ParentFormData = {
        id: initialFather?.id,
        birthNumber: father.birthNumber,
        gender: 'male',
        firstname: father.firstname,
        lastname: father.lastname,
        weight: father.weight ? parseInt(father.weight) : undefined,
        length: father.length || undefined,
        headCircumference: father.headCircumference || undefined,
        description: father.description,
        phone: father.phone,
        email: father.email,
        address: { id: (initialFather?.address as Record<string, unknown>)?.id as number | undefined, ...fatherAddress },
      };

      const result = await createOrUpdate(patient, motherData, fatherData);
      navigate(`/patients/detail/${result[0].id}`);
    } catch (err) {
      toast.error('Nečekaná chyba aplikace.');
      console.error(err);
    }
  };

  const updatePatient = (field: string, value: unknown) => setPatient((p) => ({ ...p, [field]: value }));

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card title={isEdit ? 'Upravit pacienta' : 'Nový pacient'} subtitle="Zadejte, prosím, údaje potřebné pro evidenci nového pacienta.">
        <div className="space-y-4">
          <Input label="* Rodné číslo" placeholder="260212/2457" required value={patient.birthNumber} onChange={(e) => updatePatient('birthNumber', e.target.value)} />

          <div className="flex items-center gap-4">
            <label className="w-40 shrink-0 text-right text-sm font-medium text-gray-700">Datum narození dle r.č.</label>
            <p className="text-sm text-gray-600">{birthDateFromNumber(patient.birthNumber || '')}</p>
          </div>

          <Input label="Plánované datum porodu" placeholder="17. 3. 2016" value={patient.expectedBirthDate} onChange={(e) => updatePatient('expectedBirthDate', e.target.value)} />

          <hr className="border-dashed" />

          <Select
            label="* Pohlaví"
            options={[{ value: 'female', label: 'Dívka' }, { value: 'male', label: 'Chlapec' }]}
            required
            value={patient.gender}
            onChange={(e) => updatePatient('gender', e.target.value)}
          />

          <Input label="* Porodní hmotnost" type="number" placeholder="2345" min={0} max={2500} required suffix="g" value={String(patient.birthWeight || '')} onChange={(e) => updatePatient('birthWeight', parseInt(e.target.value) || 0)} />

          <Input label="* Gestační týden (narození)" type="number" placeholder="28" max={37} min={0} required value={String(patient.birthWeek || '')} onChange={(e) => updatePatient('birthWeek', parseInt(e.target.value) || 0)} />

          <hr className="border-dashed" />

          <Input label="Jméno" placeholder="Jan" value={patient.firstname || ''} onChange={(e) => updatePatient('firstname', e.target.value)} />
          <Input label="Příjmení" placeholder="Novák" value={patient.lastname || ''} onChange={(e) => updatePatient('lastname', e.target.value)} />

          <hr className="border-dashed" />

          <TextArea label="Poznámky" placeholder="Poznámky" value={patient.description || ''} onChange={(e) => updatePatient('description', e.target.value)} />

          <hr className="border-dashed" />

          <MeasurementInput label="Porodní délka" value={String(patient.birthLength || '')} onChange={(v) => updatePatient('birthLength', v)} />
          <MeasurementInput label="Obvod hlavy při porodu" value={String(patient.birthHeadCircumference || '')} onChange={(v) => updatePatient('birthHeadCircumference', v)} placeholder="375" />
        </div>
      </Card>

      <Card title="Matka" subtitle="Zadejte, prosím, údaje o matce pacienta.">
        <PersonSubForm
          data={mother}
          onChange={(f, v) => setMother((m) => ({ ...m, [f]: v }))}
          genderLabel="Žena"
        />
        <hr className="border-dashed my-4" />
        <AddressSubForm
          data={motherAddress as { street: string; city: string; country: string; zipcode: string }}
          onChange={(f, v) => setMotherAddress((a) => ({ ...a, [f]: v }))}
        />
      </Card>

      <Card title="Otec" subtitle="Zadejte, prosím, údaje o otci pacienta.">
        <PersonSubForm
          data={father}
          onChange={(f, v) => setFather((fa) => ({ ...fa, [f]: v }))}
          genderLabel="Muž"
          firstnamePlaceholder="Jan"
          lastnamePlaceholder="Novák"
        />
        <hr className="border-dashed my-4" />
        <AddressSubForm
          data={fatherAddress as { street: string; city: string; country: string; zipcode: string }}
          onChange={(f, v) => setFatherAddress((a) => ({ ...a, [f]: v }))}
        />
      </Card>

      <Card title={isEdit ? 'Upravit detaily pacienta' : 'Vytvořit pacienta'}>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="white" onClick={() => navigate('/patients/dashboard')}>Storno</Button>
          <Button type="submit" variant="primary">{isEdit ? 'Upravit detaily pacienta' : 'Přidat pacienta'}</Button>
        </div>
      </Card>
    </form>
  );
}
