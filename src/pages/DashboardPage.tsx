import { useState, useEffect, useCallback, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Plus, List, Download, Search, Info, User, Activity, Baby } from 'lucide-react';
import { usePatients } from '../hooks/usePatients';
import { useExaminations } from '../hooks/useExaminations';
import { genderColor } from '../utils/color';
import { formatBirthNumber } from '../utils/birth-number';
import { birthDateFromNumber } from '../utils/age';
import { formatDateTime } from '../utils/formatting';
import { PageHeader } from '../components/layout/PageHeader';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import type { PatientWithPerson, Examination } from '../types/database';

export function DashboardPage() {
  const { search, recent, exportDB } = usePatients();
  const { getAllByPatient } = useExaminations();
  const [patients, setPatients] = useState<PatientWithPerson[]>([]);
  const [searchToken, setSearchToken] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<PatientWithPerson | null>(null);
  const [selectedExaminations, setSelectedExaminations] = useState<Examination[]>([]);

  const loadRecent = useCallback(async () => {
    const result = await recent(10);
    setPatients(result);
  }, [recent]);

  useEffect(() => {
    loadRecent();
  }, [loadRecent]);

  const handleSearch = async (e: FormEvent) => {
    e.preventDefault();
    if (!searchToken || searchToken.trim().length === 0) {
      loadRecent();
    } else {
      const result = await search(searchToken, 10);
      setPatients(result);
    }
  };

  const handleInfo = async (p: PatientWithPerson) => {
    setSelectedPatient(p);
    const exams = await getAllByPatient(p.Patient.id);
    setSelectedExaminations(exams);
  };

  return (
    <div>
      <PageHeader
        title="Pacienti"
        breadcrumbs={[
          { label: 'Monitoring růstu nedonošených dětí', to: '/patients/dashboard' },
          { label: 'Pacienti' },
        ]}
        actions={
          <>
            <Link to="/patients/new"><Button><Plus size={14} /> Nový pacient</Button></Link>
            <Link to="/patients/list"><Button><List size={14} /> Seznam pacientů</Button></Link>
            <Button onClick={() => exportDB()}><Download size={14} /> Export</Button>
          </>
        }
      />

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card title="Pacienti">
              <p className="text-sm text-gray-500 mb-4">
                Můžete vyhledat pacienta podle příjmení nebo rodného čísla.
              </p>
              <form onSubmit={handleSearch} className="flex gap-2 mb-4">
                <input
                  type="text"
                  className="flex-1 rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  placeholder="Vyhledat pacienta"
                  value={searchToken}
                  onChange={(e) => setSearchToken(e.target.value)}
                />
                <Button variant="primary" type="submit">
                  <Search size={14} /> Hledat
                </Button>
              </form>

              <div className="text-xs text-gray-500 mb-2">{patients.length} výsledků</div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 text-left">
                      <th className="py-2 px-2">ID</th>
                      <th className="py-2 px-2">Jméno</th>
                      <th className="py-2 px-2">Pohlaví</th>
                      <th className="py-2 px-2">Rodné číslo</th>
                      <th className="py-2 px-2">Datum narození</th>
                      <th className="py-2 px-2">GT narození</th>
                      <th className="py-2 px-2">Porodní hmotnost</th>
                      <th className="py-2 px-2"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {patients.map((p) => (
                      <tr key={p.Patient.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-2 px-2">{p.Patient.id}</td>
                        <td className="py-2 px-2">
                          <Link
                            to={`/patients/detail/${p.Patient.id}`}
                            className="hover:underline"
                            style={{ color: genderColor(p) }}
                          >
                            {p.Person.firstName} {p.Person.lastName}
                          </Link>
                        </td>
                        <td className="py-2 px-2" style={{ color: genderColor(p) }}>
                          {p.Person.gender === 'male' ? <User size={14} /> : <User size={14} />}
                        </td>
                        <td className="py-2 px-2">
                          <Link to={`/patients/detail/${p.Patient.id}`} className="hover:underline">
                            {formatBirthNumber(p.Person.birthNumber || '')}
                          </Link>
                        </td>
                        <td className="py-2 px-2">{birthDateFromNumber(p.Person.birthNumber || '')}</td>
                        <td className="py-2 px-2">{p.Patient.birthWeek}. GT</td>
                        <td className="py-2 px-2">{p.Patient.birthWeight} g</td>
                        <td className="py-2 px-2">
                          <button
                            onClick={() => handleInfo(p)}
                            className="p-1 text-gray-400 hover:text-primary rounded"
                          >
                            <Info size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {patients.length === 0 && (
                      <tr>
                        <td colSpan={8} className="py-4 text-center text-gray-400">Žádní pacienti.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>

          <div>
            <Card>
              {selectedPatient ? (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {selectedPatient.Person.firstName} {selectedPatient.Person.lastName}
                  </h3>

                  {typeof selectedExaminations[0]?.image === 'string' && (
                    <img
                      src={selectedExaminations[0].image}
                      alt=""
                      className="w-16 h-16 rounded-full mx-auto mb-3 object-cover"
                    />
                  )}

                  <p className="text-sm text-gray-500 mb-4">
                    {selectedPatient.Person.description || 'Žádné poznámky.'}
                  </p>

                  <div className="space-y-2 mb-4">
                    <Link
                      to={`/examinations/new/${selectedPatient.Patient.id}`}
                      className="block w-full text-center bg-primary text-white py-2 rounded text-sm hover:bg-primary-dark transition-colors"
                    >
                      <Plus size={14} className="inline mr-1" /> Nové vyšetření
                    </Link>
                    <Link
                      to={`/patients/detail/${selectedPatient.Patient.id}`}
                      className="block w-full text-center border border-gray-300 text-gray-700 py-2 rounded text-sm hover:bg-gray-50 transition-colors"
                    >
                      <User size={14} className="inline mr-1" /> Detail pacienta
                    </Link>
                  </div>

                  {selectedExaminations.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm"><strong>Poslední návštěva:</strong> {formatDateTime(selectedExaminations[0].dateTime)}</p>
                      <p className="text-sm text-gray-500 mt-1">{selectedExaminations[0].description || 'Žádné poznámky.'}</p>
                    </div>
                  )}

                  <hr className="my-4" />
                  <h6 className="font-semibold text-gray-700 mb-3">Časová osa</h6>
                  <div className="space-y-3">
                    {selectedExaminations.map((e) => (
                      <div key={e.id} className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center shrink-0">
                          <Activity size={14} className="text-gray-500" />
                        </div>
                        <div>
                          <p className="text-sm">Vyšetření</p>
                          <p className="text-xs text-gray-400">{formatDateTime(e.dateTime)}</p>
                        </div>
                      </div>
                    ))}
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center shrink-0">
                        <Baby size={14} className="text-gray-500" />
                      </div>
                      <div>
                        <p className="text-sm">
                          Narozen{selectedPatient.Person.gender === 'female' ? 'a' : ''}
                        </p>
                        <p className="text-xs text-gray-400">
                          {birthDateFromNumber(selectedPatient.Person.birthNumber || '')}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-gray-400">
                  <Info size={16} /> Pro náhled nejprve zvolte pacienta.
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
