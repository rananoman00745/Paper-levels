import React, { useState } from 'react';
import { ExamSubmission, CEFRLevel } from '../../types/exam';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  Cell,
} from 'recharts';
import {
  TrendingUp,
  Award,
  Layers,
  CheckCircle2,
  Calendar,
  AlertCircle,
} from 'lucide-react';

interface PerformanceAnalyticsChartProps {
  submissions: ExamSubmission[];
  onSelectSubmission?: (submission: ExamSubmission) => void;
}

export const PerformanceAnalyticsChart: React.FC<PerformanceAnalyticsChartProps> = ({
  submissions,
}) => {
  const [activeTab, setActiveTab] = useState<'timeline' | 'levels'>('timeline');

  if (submissions.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-6 text-center space-y-2">
        <div className="w-10 h-10 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
          <TrendingUp className="w-5 h-5" />
        </div>
        <h4 className="text-sm font-bold text-slate-800">
          Leistungsanalyse & GER-Fortschritt (A1–C1)
        </h4>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          Sobald Sie Ihre ersten Prüfungen abschließen, wird hier Ihre interaktive Leistungskurve mit Bestehensquote (ab 60%) und Niveau-Übersicht visualisiert.
        </p>
      </div>
    );
  }

  // Sorted submissions chronologically (oldest to newest for timeline)
  const timelineData = [...submissions]
    .sort((a, b) => new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime())
    .map((sub, index) => ({
      index: index + 1,
      name: `Test ${index + 1} (${sub.paperLevel})`,
      percentage: sub.percentage,
      score: sub.score,
      total: sub.totalPoints,
      level: sub.paperLevel,
      title: sub.paperTitle,
      date: new Date(sub.submittedAt).toLocaleDateString('de-DE'),
      passed: sub.percentage >= 60,
    }));

  // Group performance by CEFR levels A1, A2, B1, B2, C1
  const levels: CEFRLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1'];
  const levelData = levels.map((lvl) => {
    const subsForLevel = submissions.filter((s) => s.paperLevel === lvl);
    const count = subsForLevel.length;
    const maxScore = count > 0 ? Math.max(...subsForLevel.map((s) => s.percentage)) : 0;
    const avgScore = count > 0 ? Math.round(subsForLevel.reduce((a, b) => a + b.percentage, 0) / count) : 0;
    const passed = maxScore >= 60;

    return {
      level: lvl,
      attempts: count,
      maxScore,
      avgScore,
      passed,
    };
  });

  const totalPassed = submissions.filter((s) => s.percentage >= 60).length;
  const overallAvg = Math.round(submissions.reduce((a, b) => a + b.percentage, 0) / submissions.length);
  
  // Find highest passed level
  const passedLevels = levels.filter((lvl) => {
    const subs = submissions.filter((s) => s.paperLevel === lvl);
    return subs.some((s) => s.percentage >= 60);
  });
  const highestPassed = passedLevels.length > 0 ? passedLevels[passedLevels.length - 1] : null;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-6">
      
      {/* Header and Key Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 mb-1">
            <span className="flex items-center gap-1.5 text-slate-900">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              GER-Leistungsdiagramm & Auswertung
            </span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-700">60% Bestehens-Standard</span>
          </div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900">
            Historische Leistung & Niveau-Fortschritt (A1 bis C1)
          </h3>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl self-start sm:self-auto text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('timeline')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'timeline'
                ? 'bg-white text-slate-900 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Ergebnis-Verlauf</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('levels')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'levels'
                ? 'bg-white text-slate-900 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>A1–C1 Niveaustufen</span>
          </button>
        </div>
      </div>

      {/* Highlights Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
          <span className="text-slate-500 block mb-0.5">Prüfungsabgaben</span>
          <span className="text-lg font-bold text-slate-900 font-mono tabular-nums">
            {submissions.length}
          </span>
        </div>

        <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-200">
          <span className="text-emerald-800 font-medium block mb-0.5">Zertifiziert (≥ 60%)</span>
          <span className="text-lg font-bold text-emerald-800 font-mono tabular-nums">
            {totalPassed} / {submissions.length}
          </span>
        </div>

        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
          <span className="text-slate-500 block mb-0.5">Gesamt-Durchschnitt</span>
          <span className="text-lg font-bold text-slate-900 font-mono tabular-nums">
            {overallAvg}%
          </span>
        </div>

        <div className="p-3 bg-amber-50/80 rounded-xl border border-amber-200">
          <span className="text-amber-900 font-medium block mb-0.5">Höchstes Diplom</span>
          <span className="text-lg font-extrabold text-amber-900 flex items-center gap-1">
            <Award className="w-4 h-4 text-amber-700" />
            {highestPassed ? `GER ${highestPassed}` : 'In Arbeit'}
          </span>
        </div>
      </div>

      {/* Main Chart Area */}
      {activeTab === 'timeline' ? (
        <div className="space-y-3">
          <div className="h-64 sm:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timelineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#059669" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#059669" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  axisLine={{ stroke: '#cbd5e1' }}
                />
                <YAxis
                  domain={[0, 100]}
                  ticks={[0, 20, 40, 60, 80, 100]}
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  axisLine={{ stroke: '#cbd5e1' }}
                  unit="%"
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const item = payload[0].payload;
                      return (
                        <div className="bg-slate-900 text-white p-3 rounded-xl shadow-lg text-xs space-y-1">
                          <div className="font-bold">{item.title}</div>
                          <div className="text-slate-300">
                            Niveau: <span className="font-semibold text-white">GER {item.level}</span> · {item.date}
                          </div>
                          <div className="text-slate-300">
                            Punkte: <span className="font-semibold text-white">{item.score}/{item.total}</span>
                          </div>
                          <div className={`font-bold flex items-center gap-1 ${item.passed ? 'text-emerald-400' : 'text-red-400'}`}>
                            {item.passed ? '✓ Bestanden' : '✗ Nicht bestanden'}: {item.percentage}%
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                {/* 60% Passing Benchmark Line */}
                <ReferenceLine
                  y={60}
                  stroke="#10b981"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  label={{
                    value: 'Bestehensgrenze (60%)',
                    fill: '#059669',
                    fontSize: 11,
                    position: 'insideTopLeft',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="percentage"
                  stroke="#059669"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#scoreGradient)"
                  dot={(props: any) => {
                    const isPass = props.payload.percentage >= 60;
                    return (
                      <circle
                        key={props.key}
                        cx={props.cx}
                        cy={props.cy}
                        r={5}
                        fill={isPass ? '#10b981' : '#ef4444'}
                        stroke="#ffffff"
                        strokeWidth={2}
                      />
                    );
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-500 px-2">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              Grüner Punkt: ≥ 60% (Zertifikat erworben)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
              Roter Punkt: &lt; 60%
            </span>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="h-64 sm:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={levelData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis
                  dataKey="level"
                  tick={{ fontSize: 12, fontWeight: 700, fill: '#334155' }}
                  axisLine={{ stroke: '#cbd5e1' }}
                />
                <YAxis
                  domain={[0, 100]}
                  ticks={[0, 20, 40, 60, 80, 100]}
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  axisLine={{ stroke: '#cbd5e1' }}
                  unit="%"
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const item = payload[0].payload;
                      return (
                        <div className="bg-slate-900 text-white p-3 rounded-xl shadow-lg text-xs space-y-1">
                          <div className="font-bold text-amber-400">GER Niveau {item.level}</div>
                          <div>Versuche: {item.attempts}</div>
                          <div>Bestnote: {item.maxScore}%</div>
                          <div>Durchschnitt: {item.avgScore}%</div>
                          <div className={item.passed ? 'text-emerald-400 font-semibold' : 'text-slate-400'}>
                            {item.passed ? '✓ Zertifiziert (≥60%)' : item.attempts > 0 ? 'Noch nicht bestanden' : 'Ausstehend'}
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <ReferenceLine
                  y={60}
                  stroke="#10b981"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  label={{
                    value: 'Min. 60%',
                    fill: '#059669',
                    fontSize: 11,
                    position: 'insideTopLeft',
                  }}
                />
                <Bar dataKey="maxScore" radius={[6, 6, 0, 0]}>
                  {levelData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.attempts === 0 ? '#e2e8f0' : entry.passed ? '#059669' : '#f59e0b'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Level Status Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
            {levelData.map((item) => (
              <div
                key={item.level}
                className={`p-2 rounded-xl border ${
                  item.passed
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                    : item.attempts > 0
                    ? 'bg-amber-50 border-amber-300 text-amber-900'
                    : 'bg-slate-50 border-slate-200 text-slate-400'
                }`}
              >
                <div className="font-bold text-sm">GER {item.level}</div>
                <div className="text-[11px] font-medium mt-0.5">
                  {item.passed ? 'Bestanden' : item.attempts > 0 ? `${item.maxScore}%` : 'Ausstehend'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
