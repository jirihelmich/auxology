import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';
import { useExaminations, type ExaminationFormData } from '../../hooks/useExaminations';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { TextArea } from '../ui/TextArea';
import { MeasurementInput } from '../ui/MeasurementInput';
import { ImageUpload } from '../ui/ImageUpload';
import { Button } from '../ui/Button';
import type { PatientWithExamination, Examination } from '../../types/database';

interface ExaminationFormProps {
  patientId: number;
  patient: PatientWithExamination | null;
  initialExamination?: Examination | null;
}

export function ExaminationForm({ patientId, patient, initialExamination }: ExaminationFormProps) {
  const { createOrUpdate } = useExaminations();
  const navigate = useNavigate();

  const [examination, setExamination] = useState<ExaminationFormData>({
    id: initialExamination?.id,
    dateTime: initialExamination
      ? dayjs(initialExamination.dateTime).format('D. M. YYYY H:mm')
      : dayjs().format('D. M. YYYY H:mm'),
    weight: initialExamination?.weight ? String(initialExamination.weight) : '',
    length: initialExamination?.length
      ? String(initialExamination.length / 10) + (initialExamination.length % 10 === 0 ? '.0' : '')
      : '',
    headCircumference: initialExamination?.headCircumference
      ? String(initialExamination.headCircumference / 10) + (initialExamination.headCircumference % 10 === 0 ? '.0' : '')
      : '',
    description: initialExamination?.description || '',
    image: initialExamination?.image || null,
  });

  const update = (field: string, value: unknown) => setExamination((e) => ({ ...e, [field]: value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const parsed = dayjs(examination.dateTime, 'D. M. YYYY H:m');
    if (parsed.toDate().getFullYear() < 1950) {
      toast.error('Rok vyšetření je před rokem 1950.');
      return;
    }

    try {
      await createOrUpdate(patientId, examination);
      navigate(`/patients/detail/${patientId}`);
    } catch (err) {
      console.error(err);
      toast.error('Nečekaná chyba.');
    }
  };

  const isEdit = !!initialExamination;
  const lastExam = patient?.Examination?.id ? patient.Examination : null;

  return (
    <form onSubmit={handleSubmit}>
      <Card
        title={isEdit ? 'Editovat vyšetření' : 'Nové vyšetření'}
        subtitle="Zadejte, prosím, naměřené údaje."
      >
        <div className="space-y-4">
          <Input label="Datum vyšetření" placeholder="17. 3. 2016 12:54" value={examination.dateTime} onChange={(e) => update('dateTime', e.target.value)} />
          <TextArea label="Poznámky" value={examination.description || ''} onChange={(e) => update('description', e.target.value)} />

          <hr className="border-dashed" />

          {!isEdit && (lastExam ? (
            <div className="bg-navy/10 rounded-lg p-4 mb-4">
              <h6 className="font-semibold text-gray-700 mb-2">Hodnoty naměřené při posledním vyšetření</h6>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div><span className="text-gray-500">Tělesná délka:</span> {lastExam.length / 10} cm ({lastExam.length} mm)</div>
                <div><span className="text-gray-500">Tělesná hmotnost:</span> {lastExam.weight} g</div>
                <div><span className="text-gray-500">Obvod hlavy:</span> {lastExam.headCircumference / 10} cm ({lastExam.headCircumference} mm)</div>
              </div>
            </div>
          ) : patient?.Patient && (
            <div className="bg-navy/10 rounded-lg p-4 mb-4">
              <h6 className="font-semibold text-gray-700 mb-2">Porodní údaje</h6>
              <div className="grid grid-cols-3 gap-4 text-sm">
                {patient.Patient.birthLength != null && <div><span className="text-gray-500">Porodní délka:</span> {patient.Patient.birthLength / 10} cm ({patient.Patient.birthLength} mm)</div>}
                <div><span className="text-gray-500">Porodní hmotnost:</span> {patient.Patient.birthWeight} g</div>
                {patient.Patient.birthHeadCircumference != null && <div><span className="text-gray-500">Porodní obvod hlavy:</span> {patient.Patient.birthHeadCircumference / 10} cm ({patient.Patient.birthHeadCircumference} mm)</div>}
              </div>
            </div>
          ))}

          <MeasurementInput label="Délka" value={String(examination.length)} onChange={(v) => update('length', v)} />
          <Input label="Hmotnost" type="number" placeholder="2345" suffix="g" value={String(examination.weight)} onChange={(e) => update('weight', e.target.value)} />
          <MeasurementInput label="Obvod hlavy" value={String(examination.headCircumference)} onChange={(v) => update('headCircumference', v)} placeholder="375" />
          <ImageUpload label="Aktuální fotografie" value={examination.image as string | null} onChange={(v) => update('image', v)} />

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="white" onClick={() => navigate(`/patients/detail/${patientId}`)}>Storno</Button>
            <Button type="submit" variant="primary">{isEdit ? 'Editovat měření' : 'Přidat měření'}</Button>
          </div>
        </div>
      </Card>
    </form>
  );
}
