import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { usePatients } from '../hooks/usePatients';
import { useExaminations } from '../hooks/useExaminations';
import { useT } from '../i18n/LanguageContext';
import { PageHeader } from '../components/layout/PageHeader';
import { ExaminationForm } from '../components/forms/ExaminationForm';
import { Spinner } from '../components/ui/Spinner';
import type { PatientWithExamination, Examination } from '../types/database';

export function ExaminationEditPage() {
  const { patientId, examinationId } = useParams<{ patientId: string; examinationId: string }>();
  const { getById: getPatient } = usePatients();
  const { getById: getExamination } = useExaminations();
  const { t } = useT();
  const [patient, setPatient] = useState<PatientWithExamination | null>(null);
  const [examination, setExamination] = useState<Examination | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!patientId || !examinationId) return;
    Promise.all([
      getPatient(parseInt(patientId)),
      getExamination(parseInt(examinationId)),
    ]).then(([p, e]) => {
      setPatient(p);
      setExamination(e);
      setLoading(false);
    });
  }, [patientId, examinationId, getPatient, getExamination]);

  if (loading) return <Spinner />;

  return (
    <div>
      <PageHeader
        title={t.editExaminationTitle}
        breadcrumbs={[
          { label: t.breadcrumbHome, to: '/patients/dashboard' },
          { label: t.patients, to: '/patients/dashboard' },
          ...(patient ? [{
            label: `${patient.Person.firstName} ${patient.Person.lastName}`,
            to: `/patients/detail/${patientId}`,
          }] : []),
          { label: t.editExaminationTitle },
        ]}
      />
      <div className="p-6">
        <ExaminationForm
          patientId={parseInt(patientId!)}
          patient={patient}
          initialExamination={examination}
        />
      </div>
    </div>
  );
}
