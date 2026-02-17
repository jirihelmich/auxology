import { useState, useEffect, type FormEvent } from 'react';
import toast from 'react-hot-toast';
import { usePerson } from '../hooks/usePerson';
import { PageHeader } from '../components/layout/PageHeader';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Spinner } from '../components/ui/Spinner';
import type { Person } from '../types/database';

export function DoctorProfilePage() {
  const { getCurrentDoctor, update } = usePerson();
  const [doctor, setDoctor] = useState<Person | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCurrentDoctor().then((d) => {
      setDoctor(d);
      setLoading(false);
    });
  }, [getCurrentDoctor]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!doctor) return;
    try {
      await update(doctor);
      toast.success('Úpravy profilu byly uloženy.');
    } catch {
      toast.error('Nečekaná chyba programu.');
    }
  };

  if (loading) return <Spinner />;
  if (!doctor) return <div className="p-6">Profil nenalezen.</div>;

  const updateField = (field: keyof Person, value: string) => {
    setDoctor((d) => d ? { ...d, [field]: value } : d);
  };

  return (
    <div>
      <PageHeader
        title="Profil lékaře"
        breadcrumbs={[
          { label: 'Monitoring růstu nedonošených dětí', to: '/patients/dashboard' },
          { label: 'Profil lékaře' },
        ]}
      />

      <div className="p-6">
        <form onSubmit={handleSubmit}>
          <Card title="Profil lékaře" subtitle="Zadejte, prosím, svoje údaje.">
            <div className="space-y-4">
              <Input label="Tituly před jménem" placeholder="RNDr." value={doctor.titlePrefix || ''} onChange={(e) => updateField('titlePrefix', e.target.value)} />
              <Input label="Jméno" placeholder="Jana" value={doctor.firstName || ''} onChange={(e) => updateField('firstName', e.target.value)} />
              <Input label="Příjmení" placeholder="Nováková" value={doctor.lastName || ''} onChange={(e) => updateField('lastName', e.target.value)} />
              <Input label="Tituly za jménem" placeholder="Ph.D." value={doctor.titlePostfix || ''} onChange={(e) => updateField('titlePostfix', e.target.value)} />
              <Input label="Pracoviště" placeholder="VFN" value={doctor.workplace || ''} onChange={(e) => updateField('workplace', e.target.value)} />

              <hr className="border-dashed" />

              <div className="flex justify-end gap-2">
                <Button type="submit" variant="primary">Upravit profil</Button>
              </div>
            </div>
          </Card>
        </form>
      </div>
    </div>
  );
}
