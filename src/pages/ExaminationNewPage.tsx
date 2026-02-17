import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { usePatients } from '../hooks/usePatients';
import { PageHeader } from '../components/layout/PageHeader';
import { ExaminationForm } from '../components/forms/ExaminationForm';
import { Spinner } from '../components/ui/Spinner';
import type { PatientWithExamination } from '../types/database';

export function ExaminationNewPage() {
  const { patientId } = useParams<{ patientId: string }>();
  const { getById } = usePatients();
  const [patient, setPatient] = useState<PatientWithExamination | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!patientId) return;
    getById(parseInt(patientId)).then((p) => {
      setPatient(p);
      setLoading(false);
    });
  }, [patientId, getById]);

  if (loading) return <Spinner />;

  return (
    <div>
      <PageHeader
        title="Nové vyšetření"
        breadcrumbs={[
          { label: 'Monitoring růstu nedonošených dětí', to: '/patients/dashboard' },
          { label: 'Pacienti', to: '/patients/dashboard' },
          ...(patient ? [{
            label: `${patient.Person.firstName} ${patient.Person.lastName}`,
            to: `/patients/detail/${patientId}`,
          }] : []),
          { label: 'Nové vyšetření' },
        ]}
      />
      <div className="p-6">
        <ExaminationForm patientId={parseInt(patientId!)} patient={patient} />
      </div>
    </div>
  );
}
