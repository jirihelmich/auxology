import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { usePatients } from '../hooks/usePatients';
import { PageHeader } from '../components/layout/PageHeader';
import { formatBirthNumber } from '../utils/birth-number';
import { birthDateFromNumber } from '../utils/age';
import type { PatientWithPerson } from '../types/database';

export function PatientListPage() {
  const { all } = usePatients();
  const [patients, setPatients] = useState<PatientWithPerson[]>([]);

  useEffect(() => {
    all().then(setPatients);
  }, [all]);

  return (
    <div>
      <PageHeader
        title="Seznam pacientů"
        breadcrumbs={[
          { label: 'Monitoring růstu nedonošených dětí', to: '/patients/dashboard' },
          { label: 'Pacienti', to: '/patients/dashboard' },
          { label: 'Seznam' },
        ]}
        actions={<span className="text-sm text-gray-500">Celkem evidováno pacientů: {patients.length}.</span>}
      />

      <div className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {patients.map((p) => (
            <Link
              key={p.Patient.id}
              to={`/patients/detail/${p.Patient.id}`}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 text-center hover:shadow-md transition-shadow"
            >
              <h3 className="font-semibold text-gray-800 mb-1">
                {p.Person.firstName} {p.Person.lastName}
              </h3>
              <p className="text-sm text-gray-500">ID: {p.Patient.id}</p>
              <p className="text-sm text-gray-500">
                {birthDateFromNumber(p.Person.birthNumber || '')} ({formatBirthNumber(p.Person.birthNumber || '')})
              </p>
              <p className="text-sm text-gray-500">{p.Patient.birthWeek}. týden</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
