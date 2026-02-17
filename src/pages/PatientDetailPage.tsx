import { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Plus, Pencil, Trash2, Printer, ZoomIn } from 'lucide-react';
import { usePatients } from '../hooks/usePatients';
import { useExaminations } from '../hooks/useExaminations';
import {
  buildChartData, getPercentileValue, getZScoreValue, getWfLPercentile, getZScoreWfl,
} from '../hooks/useChartData';
import { genderColor, shadeColor } from '../utils/color';
import { formatBirthNumber } from '../utils/birth-number';
import { birthDateFromNumber, age, gestationalAge, correctedAge, correctedWeek, expectedBirth, getAgeDiff } from '../utils/age';
import { formatDate, formatDateTime, mmToCm } from '../utils/formatting';
import { statisticalData } from '../lib/statistical-data';
import { PageHeader } from '../components/layout/PageHeader';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Spinner } from '../components/ui/Spinner';
import { GrowthChartGrid } from '../components/charts/GrowthChartGrid';
import { ChartZoomModal } from '../components/charts/ChartZoomModal';
import { SparklineCell } from '../components/charts/SparklineCell';
import type { PatientWithExamination, PatientDetail, Examination, Person, Address } from '../types/database';
import type { Gender, WeightCategory, MeasureType } from '../types/statistical';

const STATISTICAL_DATA_START = 37;

export function PatientDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getById, deleteById } = usePatients();
  const { getAllByPatient, deleteById: deleteExam } = useExaminations();

  const [patient, setPatient] = useState<PatientWithExamination | null>(null);
  const [parents, setParents] = useState<{ Person: Person; Address: Address }[]>([]);
  const [examinations, setExaminations] = useState<Examination[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{ type: 'patient' | 'examination'; examId?: number } | null>(null);
  const [zoomedChart, setZoomedChart] = useState<'weight' | 'length' | 'headCircumference' | 'weightForLength' | null>(null);

  const loadData = useCallback(async () => {
    if (!id) return;
    const patientId = parseInt(id);
    const p = await getById(patientId);
    if (!p) { setLoading(false); return; }

    setPatient(p);
    setParents([
      { Person: p.Mother, Address: p.MotherAddress },
      { Person: p.Father, Address: p.FatherAddress },
    ]);

    const exams = await getAllByPatient(patientId);
    setExaminations(exams);
    setLoading(false);
  }, [id, getById, getAllByPatient]);

  useEffect(() => { loadData(); }, [loadData]);

  const gender = (patient?.Person.gender || 'male') as Gender;
  const weightCategory: WeightCategory = patient && patient.Patient.birthWeight <= 1500 ? 'under' : 'above';
  const color = genderColor(patient);
  const genderName = gender === 'female' ? 'dívky' : 'chlapci';
  const weightCategoryName = weightCategory === 'under' ? 'pod' : 'nad';

  // Build chart data maps
  const chartDataMaps = useMemo(() => {
    if (!patient) return null;

    const weights: Record<number, number> = {};
    const lengths: Record<number, number> = {};
    const headCircumferences: Record<number, number> = {};
    const weightsForLengths: Record<number, number> = {};
    const inlineWeight: number[] = [];
    const inlineLength: number[] = [];
    const inlineCircumference: number[] = [];

    examinations.forEach((e) => {
      if (e.length) {
        const week = correctedWeek(patient, e.dateTime);
        if (isNaN(week)) return;

        inlineWeight.unshift(e.weight);
        inlineLength.unshift(e.length);
        inlineCircumference.unshift(e.headCircumference);

        weights[week] = e.weight;
        lengths[week] = e.length;
        headCircumferences[week] = e.headCircumference;
        weightsForLengths[Math.floor(e.length / 10)] = e.weight;
      }
    });

    if (patient.Patient.birthWeight) {
      inlineWeight.unshift(patient.Patient.birthWeight);
      weights[patient.Patient.birthWeek - 40] = patient.Patient.birthWeight;
    }
    if (patient.Patient.birthLength) {
      inlineLength.unshift(patient.Patient.birthLength);
      lengths[patient.Patient.birthWeek - 40] = patient.Patient.birthLength;
    }
    if (patient.Patient.birthHeadCircumference) {
      inlineCircumference.unshift(patient.Patient.birthHeadCircumference);
      headCircumferences[patient.Patient.birthWeek - 40] = patient.Patient.birthHeadCircumference;
    }

    return { weights, lengths, headCircumferences, weightsForLengths, inlineWeight, inlineLength, inlineCircumference };
  }, [patient, examinations]);

  const chartData = useMemo(() => {
    if (!chartDataMaps || !patient) return null;
    return {
      weight: buildChartData(gender, weightCategory, 'weight', chartDataMaps.weights),
      length: buildChartData(gender, weightCategory, 'length', chartDataMaps.lengths),
      headCircumference: buildChartData(gender, weightCategory, 'headCircumference', chartDataMaps.headCircumferences),
      weightForLength: buildChartData(gender, weightCategory, 'weightForLength', chartDataMaps.weightsForLengths),
    };
  }, [chartDataMaps, patient, gender, weightCategory]);

  const computePercentile = useCallback((patientValue: number, type: MeasureType, examinationDate: Date) => {
    if (type === 'weightForLength') return 'N/A';
    const value = type === 'weight' ? patientValue : patientValue / 10;
    const diff = getAgeDiff(patient!, examinationDate);
    const offset = (diff.weeks + patient!.Patient.birthWeek) - STATISTICAL_DATA_START;
    return getPercentileValue(gender, weightCategory, value, type, offset);
  }, [patient, gender, weightCategory]);

  const computeZScore = useCallback((patientValue: number, type: MeasureType, examinationDate: Date) => {
    if (type === 'weightForLength') return 'N/A';
    const value = type === 'weight' ? patientValue : patientValue / 10;
    const diff = getAgeDiff(patient!, examinationDate);
    const offset = (diff.weeks + patient!.Patient.birthWeek) - STATISTICAL_DATA_START;
    return getZScoreValue(gender, weightCategory, value, type, offset);
  }, [patient, gender, weightCategory]);

  const computeWfLPercentile = useCallback((weight: number, length: number) => {
    const offset = Math.round(length / 10) - statisticalData[gender][weightCategory].startWeight;
    return getWfLPercentile(gender, weightCategory, weight, offset);
  }, [gender, weightCategory]);

  const computeZScoreWfl = useCallback((weight: number, length: number) => {
    const offset = Math.round(length / 10) - statisticalData[gender][weightCategory].startWeight;
    return getZScoreWfl(gender, weightCategory, weight, offset);
  }, [gender, weightCategory]);

  const handleDelete = async () => {
    if (!deleteModal || !patient) return;
    if (deleteModal.type === 'patient') {
      await deleteById(patient.Patient.id);
      navigate('/patients/dashboard');
    } else if (deleteModal.examId !== undefined) {
      await deleteExam(deleteModal.examId);
      setExaminations((prev) => prev.filter((e) => e.id !== deleteModal.examId));
    }
    setDeleteModal(null);
  };

  if (loading) return <Spinner />;
  if (!patient) return <div className="p-6">Pacient nenalezen.</div>;

  const zoomChartConfig: Record<string, { title: string; xLabel: string; yLabel: string }> = {
    weight: { title: 'Tělesná hmotnost', xLabel: 'Korigovaný věk', yLabel: 'Hmotnost [g]' },
    length: { title: 'Tělesná délka', xLabel: 'Korigovaný věk', yLabel: 'Tělesná délka [cm]' },
    headCircumference: { title: 'Obvod hlavy', xLabel: 'Korigovaný věk', yLabel: 'Obvod hlavy [cm]' },
    weightForLength: { title: 'Hmotnost k délce', xLabel: 'Tělesná délka [cm]', yLabel: 'Hmotnost [g]' },
  };

  return (
    <div>
      <PageHeader
        title={`Detail pacienta ${patient.Person.firstName} ${patient.Person.lastName} (ID ${patient.Patient.id})`}
        breadcrumbs={[
          { label: 'Monitoring růstu nedonošených dětí', to: '/patients/dashboard' },
          { label: 'Pacienti', to: '/patients/dashboard' },
          { label: `${patient.Person.firstName} ${patient.Person.lastName}` },
        ]}
        actions={
          <Button onClick={() => window.print()}><Printer size={14} /> Tisk</Button>
        }
      />

      <div className="p-6 space-y-6">
        {/* Patient info + Examinations */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <Card
              title={`${patient.Person.firstName} ${patient.Person.lastName}`}
              subtitle={`(${formatBirthNumber(patient.Person.birthNumber || '')})`}
            >
              {typeof examinations[0]?.image === 'string' && (
                <img src={examinations[0].image} alt="" className="w-full max-h-48 object-contain rounded mb-4" />
              )}

              <h6 className="font-semibold text-gray-700 mb-2">Věk</h6>
              <table className="w-full text-sm mb-4">
                <tbody>
                  <tr className="border-b border-gray-100">
                    <th className="py-1.5 text-left text-gray-500 font-normal">Datum narození dle r.č.</th>
                    <td className="py-1.5">{birthDateFromNumber(patient.Person.birthNumber || '')}</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <th className="py-1.5 text-left text-gray-500 font-normal">Kalkulovaný termín porodu</th>
                    <td className="py-1.5">{expectedBirth(patient)}</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <th className="py-1.5 text-left text-gray-500 font-normal">Plánovaný termín porodu</th>
                    <td className="py-1.5">{formatDate(patient.Patient.expectedBirthDate)}</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <th className="py-1.5 text-left text-gray-500 font-normal">Gestační věk při narození</th>
                    <td className="py-1.5">{patient.Patient.birthWeek}. týden</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <th className="py-1.5 text-left text-gray-500 font-normal">Gestační věk (dnes)</th>
                    <td className="py-1.5">{gestationalAge(patient)}</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <th className="py-1.5 text-left text-gray-500 font-normal">Korigovaný věk</th>
                    <td className="py-1.5">{correctedAge(patient)}</td>
                  </tr>
                  <tr>
                    <th className="py-1.5 text-left text-gray-500 font-normal">Kalendářní věk</th>
                    <td className="py-1.5">{age(patient)}</td>
                  </tr>
                </tbody>
              </table>

              {patient.Person.description && (
                <div className="mb-4">
                  <h6 className="font-semibold text-gray-700 mb-1">Poznámky</h6>
                  <p className="text-sm text-gray-600">{patient.Person.description}</p>
                </div>
              )}

              {examinations.length > 0 && chartDataMaps && (
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <SparklineCell data={chartDataMaps.inlineLength} color={color} fillColor={shadeColor(color, 0.3)} />
                    <p className="text-xs font-semibold">{mmToCm(examinations[0].length)} cm <span className="font-normal text-gray-500">délka</span></p>
                  </div>
                  <div className="text-center">
                    <SparklineCell data={chartDataMaps.inlineWeight} color={color} fillColor={shadeColor(color, 0.3)} />
                    <p className="text-xs font-semibold">{examinations[0].weight} g <span className="font-normal text-gray-500">hmotnost</span></p>
                  </div>
                  <div className="text-center">
                    <SparklineCell data={chartDataMaps.inlineCircumference} color={color} fillColor={shadeColor(color, 0.3)} />
                    <p className="text-xs font-semibold">{mmToCm(examinations[0].headCircumference)} cm <span className="font-normal text-gray-500">hlava</span></p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2 hidden-print">
                <Link to={`/examinations/new/${patient.Patient.id}`}>
                  <Button variant="primary" size="sm" className="w-full"><Plus size={12} /> Nové vyšetření</Button>
                </Link>
                <Link to={`/patients/edit/${patient.Patient.id}`}>
                  <Button size="sm" className="w-full"><Pencil size={12} /> Upravit</Button>
                </Link>
                <div />
                <Button
                  variant="danger"
                  size="sm"
                  className="w-full"
                  onClick={() => setDeleteModal({ type: 'patient' })}
                >
                  <Trash2 size={12} /> Smazat
                </Button>
              </div>
            </Card>
          </div>

          <div className="md:col-span-2 hidden-print">
            <Card title="Karta pacienta" subtitle={`${examinations.length} vyšetření`}>
              {examinations.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {examinations.map((e, idx) => (
                      (idx < 4 || showAll) && (
                        <div key={e.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-start gap-3">
                            {typeof e.image === 'string' && <img src={e.image} alt="" className="w-12 h-12 rounded-full object-cover" />}
                            <div className="flex-1">
                              <p className="font-semibold text-sm">
                                Vyšetření {formatDateTime(e.dateTime)}
                                <span className="font-normal text-gray-400 ml-1">({correctedAge(patient, e.dateTime)})</span>
                              </p>
                              <p className="text-xs text-gray-500 mt-1">{e.description || 'Žádné poznámky.'}</p>
                              <table className="w-full text-xs mt-2">
                                <tbody>
                                  <tr><th className="text-left py-0.5">Tělesná délka</th><td>{mmToCm(e.length)} cm</td></tr>
                                  <tr><th className="text-left py-0.5">Tělesná hmotnost</th><td>{e.weight} g</td></tr>
                                  <tr><th className="text-left py-0.5">Obvod hlavy</th><td>{mmToCm(e.headCircumference)} cm</td></tr>
                                </tbody>
                              </table>
                              <div className="flex gap-2 mt-2 justify-end">
                                <Link to={`/examinations/edit/${patient.Patient.id}/${e.id}`}>
                                  <Button size="sm" variant="white"><Pencil size={10} /> Změnit</Button>
                                </Link>
                                <Button size="sm" variant="danger" onClick={() => setDeleteModal({ type: 'examination', examId: e.id })}>
                                  <Trash2 size={10} /> Smazat
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    ))}
                  </div>
                  {examinations.length > 4 && (
                    <div className="text-center mt-4">
                      <Button variant="primary" size="sm" onClick={() => setShowAll(!showAll)}>
                        {showAll ? 'Zobrazit méně' : 'Zobrazit více'}
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-sm text-gray-400">Žádná vyšetření.</p>
              )}
            </Card>
          </div>
        </div>

        {/* Charts */}
        {chartData && (
          <Card
            title="Grafy"
            subtitle={`${genderName} s tělesnou hmotností při porodu ${weightCategoryName} 1500 g (porodní hmotnost pacienta: ${patient.Patient.birthWeight} g)`}
          >
            <GrowthChartGrid
              weightData={chartData.weight}
              lengthData={chartData.length}
              headCircumferenceData={chartData.headCircumference}
              weightForLengthData={chartData.weightForLength}
              genderColor={color}
              genderName={genderName}
              weightCategoryName={weightCategoryName}
              birthWeight={patient.Patient.birthWeight}
              patientName={`${patient.Person.firstName} ${patient.Person.lastName}`}
              onZoom={setZoomedChart}
            />
          </Card>
        )}

        {/* Tabulated data */}
        {examinations.length > 0 && (
          <Card title="Tabelovaná data" subtitle="Shrnutí všech vyšetření">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b-2 border-gray-300">
                    <th rowSpan={2} className="py-2 px-1">#</th>
                    <th rowSpan={2} className="py-2 px-1">Datum</th>
                    <th rowSpan={2} className="py-2 px-1">Korigovaný věk</th>
                    <th colSpan={3} className="py-1 px-1 border-r border-gray-300">Hmotnost</th>
                    <th colSpan={3} className="py-1 px-1 border-r border-gray-300">Délka</th>
                    <th colSpan={3} className="py-1 px-1 border-r border-gray-300">Obvod hlavy</th>
                    <th colSpan={2} className="py-1 px-1">Hmotnost k délce</th>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <th className="py-1 px-1">[g]</th>
                    <th className="py-1 px-1">P</th>
                    <th className="py-1 px-1 border-r border-gray-300">SDS</th>
                    <th className="py-1 px-1">[cm]</th>
                    <th className="py-1 px-1">P</th>
                    <th className="py-1 px-1 border-r border-gray-300">SDS</th>
                    <th className="py-1 px-1">[cm]</th>
                    <th className="py-1 px-1">P</th>
                    <th className="py-1 px-1 border-r border-gray-300">SDS</th>
                    <th className="py-1 px-1">P</th>
                    <th className="py-1 px-1">SDS</th>
                  </tr>
                </thead>
                <tbody>
                  {examinations.map((e, idx) => (
                    <tr key={e.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-1.5 px-1">{examinations.length - idx}</td>
                      <td className="py-1.5 px-1">{formatDateTime(e.dateTime)}</td>
                      <td className="py-1.5 px-1">{correctedAge(patient, e.dateTime)}</td>
                      <td className="py-1.5 px-1 whitespace-nowrap">{e.weight}</td>
                      <td className="py-1.5 px-1">{computePercentile(e.weight, 'weight', e.dateTime)}</td>
                      <td className="py-1.5 px-1 border-r border-gray-300 whitespace-nowrap">{computeZScore(e.weight, 'weight', e.dateTime)}</td>
                      <td className="py-1.5 px-1">{mmToCm(e.length)}</td>
                      <td className="py-1.5 px-1">{computePercentile(e.length, 'length', e.dateTime)}</td>
                      <td className="py-1.5 px-1 border-r border-gray-300 whitespace-nowrap">{computeZScore(e.length, 'length', e.dateTime)}</td>
                      <td className="py-1.5 px-1">{mmToCm(e.headCircumference)}</td>
                      <td className="py-1.5 px-1">{computePercentile(e.headCircumference, 'headCircumference', e.dateTime)}</td>
                      <td className="py-1.5 px-1 border-r border-gray-300 whitespace-nowrap">{computeZScore(e.headCircumference, 'headCircumference', e.dateTime)}</td>
                      <td className="py-1.5 px-1">{computeWfLPercentile(e.weight, e.length)}</td>
                      <td className="py-1.5 px-1 whitespace-nowrap">{computeZScoreWfl(e.weight, e.length)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* Parent info */}
        <Card title="Informace o rodičích" className="hidden-print">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {parents.sort((a, b) => (a.Person.gender === 'female' ? -1 : 1)).map((p, idx) => (
              <div key={idx}>
                <h6 className="font-semibold text-gray-700 mb-3">
                  {p.Person.gender === 'female' ? 'Matka' : 'Otec'}
                </h6>
                <table className="w-full text-sm">
                  <tbody>
                    <tr className="border-b border-gray-100"><th className="py-1 text-left text-gray-500 font-normal">Rodné číslo</th><td className="py-1">{formatBirthNumber(p.Person.birthNumber || '')}</td></tr>
                    <tr className="border-b border-gray-100"><th className="py-1 text-left text-gray-500 font-normal">Datum narození</th><td className="py-1">{birthDateFromNumber(p.Person.birthNumber || '')}</td></tr>
                    <tr className="border-b border-gray-100"><th className="py-1 text-left text-gray-500 font-normal">Příjmení</th><td className="py-1">{p.Person.lastName}</td></tr>
                    <tr className="border-b border-gray-100"><th className="py-1 text-left text-gray-500 font-normal">Jméno</th><td className="py-1">{p.Person.firstName}</td></tr>
                    <tr><td colSpan={2} className="py-1" /></tr>
                    <tr className="border-b border-gray-100"><th className="py-1 text-left text-gray-500 font-normal">Hmotnost [kg]</th><td className="py-1">{p.Person.weight ? p.Person.weight / 1000 : ''}</td></tr>
                    <tr className="border-b border-gray-100"><th className="py-1 text-left text-gray-500 font-normal">Výška [cm]</th><td className="py-1">{mmToCm(p.Person.length)}</td></tr>
                    <tr className="border-b border-gray-100"><th className="py-1 text-left text-gray-500 font-normal">Obvod hlavy [cm]</th><td className="py-1">{mmToCm(p.Person.headCircumference)}</td></tr>
                    <tr><td colSpan={2} className="py-1" /></tr>
                    <tr className="border-b border-gray-100"><th className="py-1 text-left text-gray-500 font-normal">Poznámky</th><td className="py-1">{p.Person.description}</td></tr>
                    <tr className="border-b border-gray-100"><th className="py-1 text-left text-gray-500 font-normal">Telefon</th><td className="py-1">{p.Person.phone}</td></tr>
                    <tr className="border-b border-gray-100"><th className="py-1 text-left text-gray-500 font-normal">E-mail</th><td className="py-1">{p.Person.email}</td></tr>
                    <tr><td colSpan={2} className="py-1" /></tr>
                    <tr className="border-b border-gray-100"><th className="py-1 text-left text-gray-500 font-normal">Ulice</th><td className="py-1">{p.Address.street}</td></tr>
                    <tr className="border-b border-gray-100"><th className="py-1 text-left text-gray-500 font-normal">Město</th><td className="py-1">{p.Address.city}</td></tr>
                    <tr className="border-b border-gray-100"><th className="py-1 text-left text-gray-500 font-normal">PSČ</th><td className="py-1">{p.Address.zipcode}</td></tr>
                    <tr><th className="py-1 text-left text-gray-500 font-normal">Země</th><td className="py-1">{p.Address.country}</td></tr>
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Chart zoom modal */}
      {zoomedChart && chartData && (
        <ChartZoomModal
          data={chartData[zoomedChart]}
          title={zoomChartConfig[zoomedChart].title}
          xLabel={zoomChartConfig[zoomedChart].xLabel}
          yLabel={zoomChartConfig[zoomedChart].yLabel}
          genderColor={color}
          patientName={patient ? `${patient.Person.firstName} ${patient.Person.lastName}` : undefined}
          onClose={() => setZoomedChart(null)}
        />
      )}

      {/* Delete confirmation modal */}
      <Modal
        open={!!deleteModal}
        onClose={() => setDeleteModal(null)}
        onConfirm={handleDelete}
        title="Potvrzení"
        confirmLabel="Smazat"
      >
        {deleteModal?.type === 'patient'
          ? 'Opravdu chcete smazat tohoto pacienta a všechna jeho vyšetření?'
          : 'Opravdu chcete smazat toto vyšetření?'
        }
      </Modal>
    </div>
  );
}
