import { useState, useMemo } from 'react';
import { Printer } from 'lucide-react';
import { buildChartData } from '../hooks/useChartData';
import { GrowthChart } from '../components/charts/GrowthChart';
import { PageHeader } from '../components/layout/PageHeader';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import type { Gender, WeightCategory } from '../types/statistical';

interface TabConfig {
  label: string;
  gender: Gender;
  weightCategory: WeightCategory;
}

const tabs: TabConfig[] = [
  { label: 'Chlapci pod 1500 g', gender: 'male', weightCategory: 'under' },
  { label: 'Dívky pod 1500 g', gender: 'female', weightCategory: 'under' },
  { label: 'Chlapci nad 1500 g', gender: 'male', weightCategory: 'above' },
  { label: 'Dívky nad 1500 g', gender: 'female', weightCategory: 'above' },
];

export function ReferenceChartsPage() {
  const [activeTab, setActiveTab] = useState(0);
  const config = tabs[activeTab];

  const charts = useMemo(() => ({
    length: buildChartData(config.gender, config.weightCategory, 'length'),
    weight: buildChartData(config.gender, config.weightCategory, 'weight'),
    weightForLength: buildChartData(config.gender, config.weightCategory, 'weightForLength'),
    headCircumference: buildChartData(config.gender, config.weightCategory, 'headCircumference'),
  }), [config.gender, config.weightCategory]);

  const genderColor = config.gender === 'female' ? '#ed5565' : '#1c84c6';

  return (
    <div>
      <PageHeader
        title="Grafy"
        breadcrumbs={[
          { label: 'Monitoring růstu nedonošených dětí', to: '/patients/dashboard' },
          { label: 'Grafy' },
        ]}
        actions={
          <Button onClick={() => window.print()}><Printer size={14} /> Tisk</Button>
        }
      />

      <div className="p-6">
        <div className="flex gap-1 mb-6 border-b border-gray-200">
          {tabs.map((tab, i) => (
            <button
              key={i}
              onClick={() => setActiveTab(i)}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${
                i === activeTab
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="space-y-6">
          <Card title="Graf tělesné délky">
            <GrowthChart data={charts.length} title="" height={700} showLegend genderColor={genderColor} />
          </Card>
          <Card title="Graf tělesné hmotnosti">
            <GrowthChart data={charts.weight} title="" height={700} showLegend genderColor={genderColor} />
          </Card>
          <Card title="Graf tělesné hmotnosti k délce">
            <GrowthChart data={charts.weightForLength} title="" height={700} showLegend genderColor={genderColor} />
          </Card>
          <Card title="Graf obvodu hlavy">
            <GrowthChart data={charts.headCircumference} title="" height={700} showLegend genderColor={genderColor} />
          </Card>
        </div>
      </div>
    </div>
  );
}
