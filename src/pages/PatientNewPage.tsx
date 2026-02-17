import { PageHeader } from '../components/layout/PageHeader';
import { PatientForm } from '../components/forms/PatientForm';

export function PatientNewPage() {
  return (
    <div>
      <PageHeader
        title="Nový pacient"
        breadcrumbs={[
          { label: 'Monitoring růstu nedonošených dětí', to: '/patients/dashboard' },
          { label: 'Pacienti', to: '/patients/dashboard' },
          { label: 'Nový pacient' },
        ]}
      />
      <div className="p-6">
        <PatientForm />
      </div>
    </div>
  );
}
