import { useState, useMemo } from 'react';
import { Printer } from 'lucide-react';
import { buildChartData } from '../hooks/useChartData';
import { useT } from '../i18n/LanguageContext';
import { GrowthChart } from '../components/charts/GrowthChart';
import { PageHeader } from '../components/layout/PageHeader';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import type { Gender, WeightCategory } from '../types/statistical';

interface TabConfig {
  labelKey: 'refChartBoysUnder' | 'refChartGirlsUnder' | 'refChartBoysAbove' | 'refChartGirlsAbove';
  gender: Gender;
  weightCategory: WeightCategory;
}

const tabConfigs: TabConfig[] = [
  { labelKey: 'refChartBoysUnder', gender: 'male', weightCategory: 'under' },
  { labelKey: 'refChartGirlsUnder', gender: 'female', weightCategory: 'under' },
  { labelKey: 'refChartBoysAbove', gender: 'male', weightCategory: 'above' },
  { labelKey: 'refChartGirlsAbove', gender: 'female', weightCategory: 'above' },
];

export function ReferenceChartsPage() {
  const [activeTab, setActiveTab] = useState(0);
  const { t } = useT();
  const config = tabConfigs[activeTab];

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
        title={t.charts}
        breadcrumbs={[
          { label: t.breadcrumbHome, to: '/patients/dashboard' },
          { label: t.charts },
        ]}
        actions={
          <Button onClick={() => window.print()}><Printer size={14} /> {t.print}</Button>
        }
      />

      <div className="p-6">
        <div className="flex gap-1 mb-6 border-b border-gray-200">
          {tabConfigs.map((tab, i) => (
            <button
              key={i}
              onClick={() => setActiveTab(i)}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${
                i === activeTab
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {t[tab.labelKey]}
            </button>
          ))}
        </div>

        <div className="space-y-6">
          <Card title={t.refChartLength}>
            <GrowthChart data={charts.length} title="" height={700} showLegend genderColor={genderColor} />
          </Card>
          <Card title={t.refChartWeight}>
            <GrowthChart data={charts.weight} title="" height={700} showLegend genderColor={genderColor} />
          </Card>
          <Card title={t.refChartWeightForLength}>
            <GrowthChart data={charts.weightForLength} title="" height={700} showLegend genderColor={genderColor} />
          </Card>
          <Card title={t.refChartHeadCirc}>
            <GrowthChart data={charts.headCircumference} title="" height={700} showLegend genderColor={genderColor} />
          </Card>
        </div>
      </div>
    </div>
  );
}
