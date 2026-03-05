import { useT } from '../i18n/LanguageContext';
import { PageHeader } from '../components/layout/PageHeader';
import { PatientForm } from '../components/forms/PatientForm';

export function PatientNewPage() {
  const { t } = useT();

  return (
    <div>
      <PageHeader
        title={t.newPatientTitle}
        breadcrumbs={[
          { label: t.breadcrumbHome, to: '/patients/dashboard' },
          { label: t.patients, to: '/patients/dashboard' },
          { label: t.newPatientTitle },
        ]}
      />
      <div className="p-6">
        <PatientForm />
      </div>
    </div>
  );
}
