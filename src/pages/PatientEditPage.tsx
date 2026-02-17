import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { usePatients } from '../hooks/usePatients';
import { PageHeader } from '../components/layout/PageHeader';
import { PatientForm } from '../components/forms/PatientForm';
import { Spinner } from '../components/ui/Spinner';
import { formatBirthNumber } from '../utils/birth-number';
import { mmToCm, formatDate } from '../utils/formatting';
import type { PatientFormData, ParentFormData } from '../hooks/usePatients';
import type { PatientDetail } from '../types/database';

export function PatientEditPage() {
  const { id } = useParams<{ id: string }>();
  const { getDetail } = usePatients();
  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState<PatientDetail | null>(null);

  useEffect(() => {
    if (!id) return;
    getDetail(parseInt(id)).then((d) => {
      setDetail(d);
      setLoading(false);
    });
  }, [id, getDetail]);

  if (loading) return <Spinner />;
  if (!detail) return <div className="p-6">Pacient nenalezen.</div>;

  const patient: PatientFormData = {
    id: detail.Patient.id,
    personId: detail.Person.id,
    motherId: detail.Mother.id,
    fatherId: detail.Father.id,
    birthNumber: formatBirthNumber(detail.Person.birthNumber || ''),
    gender: detail.Person.gender || '',
    birthWeight: detail.Patient.birthWeight,
    birthWeek: detail.Patient.birthWeek,
    expectedBirthDate: formatDate(detail.Patient.expectedBirthDate),
    firstname: detail.Person.firstName || '',
    lastname: detail.Person.lastName || '',
    description: detail.Person.description || '',
    birthLength: mmToCm(detail.Patient.birthLength) || '',
    birthHeadCircumference: mmToCm(detail.Patient.birthHeadCircumference) || '',
    address: detail.MotherAddress || { street: '', city: '', country: '', zipcode: '' },
  };

  const motherData: ParentFormData = {
    id: detail.Mother.id,
    birthNumber: detail.Mother.birthNumber || '',
    gender: 'female',
    firstname: detail.Mother.firstName || '',
    lastname: detail.Mother.lastName || '',
    weight: detail.Mother.weight || undefined,
    length: mmToCm(detail.Mother.length) || undefined,
    headCircumference: mmToCm(detail.Mother.headCircumference) || undefined,
    description: detail.Mother.description || '',
    phone: detail.Mother.phone || '',
    email: detail.Mother.email || '',
    address: detail.MotherAddress || { street: '', city: '', country: '', zipcode: '' },
  };

  const fatherData: ParentFormData = {
    id: detail.Father.id,
    birthNumber: detail.Father.birthNumber || '',
    gender: 'male',
    firstname: detail.Father.firstName || '',
    lastname: detail.Father.lastName || '',
    weight: detail.Father.weight || undefined,
    length: mmToCm(detail.Father.length) || undefined,
    headCircumference: mmToCm(detail.Father.headCircumference) || undefined,
    description: detail.Father.description || '',
    phone: detail.Father.phone || '',
    email: detail.Father.email || '',
    address: detail.FatherAddress || { street: '', city: '', country: '', zipcode: '' },
  };

  return (
    <div>
      <PageHeader
        title={`Editace pacienta ${detail.Person.firstName} ${detail.Person.lastName}`}
        breadcrumbs={[
          { label: 'Monitoring růstu nedonošených dětí', to: '/patients/dashboard' },
          { label: 'Pacienti', to: '/patients/dashboard' },
          { label: `${detail.Person.firstName} ${detail.Person.lastName}` },
        ]}
      />
      <div className="p-6">
        <PatientForm initialPatient={patient} initialMother={motherData} initialFather={fatherData} isEdit />
      </div>
    </div>
  );
}
