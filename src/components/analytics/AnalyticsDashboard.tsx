import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { useLanguage } from '../../hooks/useLanguage';

// =============================================================================
// TYPES & INTERFACES
// =============================================================================

interface MetricCard {
  id: string;
  label: string;
  value: number | string;
  change: number;
  changeType: 'increase' | 'decrease' | 'neutral';
  icon: string;
  unit?: string;
}

interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
}

interface TrendDataPoint {
  date: string;
  value: number;
}

interface PatientDemographic {
  ageGroup: string;
  count: number;
  percentage: number;
}

interface TreatmentOutcome {
  category: string;
  improved: number;
  maintained: number;
  declined: number;
}

interface SessionMetrics {
  totalSessions: number;
  completedSessions: number;
  averageDuration: number;
  sessionsByDay: ChartDataPoint[];
}

interface AnalyticsDashboardProps {
  dateRange?: 'week' | 'month' | 'quarter' | 'year';
  onExport?: (format: 'pdf' | 'csv') => void;
}

// =============================================================================
// DESIGN TOKENS
// =============================================================================

const brand = {
  cyan: '#00D4FF',
  cyanDark: '#00A8CC',
  purple: '#8B5CF6',
  purpleDark: '#7C3AED',
  coral: '#FF6B6B',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  dark: '#0A0A0F',
  card: 'rgba(255,255,255,0.03)',
  cardHover: 'rgba(255,255,255,0.06)',
  border: 'rgba(255,255,255,0.08)',
  text: {
    primary: '#FFFFFF',
    secondary: 'rgba(255,255,255,0.7)',
    muted: 'rgba(255,255,255,0.5)',
  },
};

const chartColors = [
  brand.cyan,
  brand.purple,
  brand.coral,
  brand.success,
  brand.warning,
  '#FF9FF3',
  '#54A0FF',
  '#5F27CD',
];

const styles = {
  container: {
    minHeight: '100vh',
    background: `linear-gradient(135deg, ${brand.dark} 0%, #1a1a2e 50%, #16213e 100%)`,
    padding: '2rem',
    fontFamily: 'Cairo, sans-serif',
  } as React.CSSProperties,
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
    flexWrap: 'wrap' as const,
    gap: '1rem',
  } as React.CSSProperties,
  title: {
    fontSize: '2rem',
    fontWeight: 700,
    color: brand.text.primary,
    margin: 0,
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  } as React.CSSProperties,
  controls: {
    display: 'flex',
    gap: '1rem',
    alignItems: 'center',
  } as React.CSSProperties,
  dateRangeSelect: {
    padding: '0.75rem 1.25rem',
    borderRadius: '12px',
    border: `1px solid ${brand.border}`,
    background: 'rgba(255,255,255,0.05)',
    color: brand.text.primary,
    fontSize: '0.9rem',
    cursor: 'pointer',
    outline: 'none',
  } as React.CSSProperties,
  exportButton: {
    padding: '0.75rem 1.5rem',
    borderRadius: '12px',
    border: 'none',
    background: `linear-gradient(135deg, ${brand.cyan} 0%, ${brand.purple} 100%)`,
    color: brand.text.primary,
    fontSize: '0.9rem',
    fontWeight: 600,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    transition: 'all 0.3s ease',
  } as React.CSSProperties,
  metricsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '1.5rem',
    marginBottom: '2rem',
  } as React.CSSProperties,
  metricCard: {
    background: brand.card,
    border: `1px solid ${brand.border}`,
    borderRadius: '20px',
    padding: '1.5rem',
    transition: 'all 0.3s ease',
  } as React.CSSProperties,
  metricHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '1rem',
  } as React.CSSProperties,
  metricIcon: {
    width: '48px',
    height: '48px',
    borderRadius: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.5rem',
  } as React.CSSProperties,
  metricChange: (type: 'increase' | 'decrease' | 'neutral') => ({
    fontSize: '0.85rem',
    fontWeight: 600,
    color: type === 'increase' ? brand.success : type === 'decrease' ? brand.error : brand.text.muted,
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
  } as React.CSSProperties),
  metricValue: {
    fontSize: '2.25rem',
    fontWeight: 700,
    color: brand.text.primary,
    marginBottom: '0.25rem',
  } as React.CSSProperties,
  metricLabel: {
    fontSize: '0.9rem',
    color: brand.text.secondary,
  } as React.CSSProperties,
  chartsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
    gap: '1.5rem',
    marginBottom: '2rem',
  } as React.CSSProperties,
  chartCard: {
    background: brand.card,
    border: `1px solid ${brand.border}`,
    borderRadius: '20px',
    padding: '1.5rem',
    overflow: 'hidden',
  } as React.CSSProperties,
  chartTitle: {
    fontSize: '1.1rem',
    fontWeight: 600,
    color: brand.text.primary,
    marginBottom: '1.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  } as React.CSSProperties,
  chartContainer: {
    height: '280px',
    position: 'relative' as const,
  } as React.CSSProperties,
  canvas: {
    width: '100%',
    height: '100%',
  } as React.CSSProperties,
  legend: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: '1rem',
    marginTop: '1rem',
    justifyContent: 'center',
  } as React.CSSProperties,
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.8rem',
    color: brand.text.secondary,
  } as React.CSSProperties,
  legendDot: (color: string) => ({
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    background: color,
  } as React.CSSProperties),
  tableContainer: {
    background: brand.card,
    border: `1px solid ${brand.border}`,
    borderRadius: '20px',
    overflow: 'hidden',
  } as React.CSSProperties,
  tableHeader: {
    padding: '1.5rem',
    borderBottom: `1px solid ${brand.border}`,
  } as React.CSSProperties,
  table: {
    width: '100%',
    borderCollapse: 'collapse' as const,
  } as React.CSSProperties,
  th: {
    textAlign: 'left' as const,
    padding: '1rem 1.5rem',
    fontSize: '0.85rem',
    fontWeight: 600,
    color: brand.text.muted,
    borderBottom: `1px solid ${brand.border}`,
    background: 'rgba(255,255,255,0.02)',
  } as React.CSSProperties,
  td: {
    padding: '1rem 1.5rem',
    fontSize: '0.9rem',
    color: brand.text.primary,
    borderBottom: `1px solid ${brand.border}`,
  } as React.CSSProperties,
  progressBar: (percentage: number, color: string) => ({
    height: '8px',
    borderRadius: '4px',
    background: 'rgba(255,255,255,0.1)',
    overflow: 'hidden',
    position: 'relative' as const,
  } as React.CSSProperties),
  progressFill: (percentage: number, color: string) => ({
    position: 'absolute' as const,
    top: 0,
    left: 0,
    height: '100%',
    width: `${percentage}%`,
    background: color,
    borderRadius: '4px',
    transition: 'width 0.5s ease',
  } as React.CSSProperties),
  insightsCard: {
    background: `linear-gradient(135deg, ${brand.cyan}15 0%, ${brand.purple}15 100%)`,
    border: `1px solid ${brand.cyan}30`,
    borderRadius: '20px',
    padding: '1.5rem',
    marginBottom: '2rem',
  } as React.CSSProperties,
  insightsTitle: {
    fontSize: '1.1rem',
    fontWeight: 600,
    color: brand.cyan,
    marginBottom: '1rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  } as React.CSSProperties,
  insightsList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.75rem',
  } as React.CSSProperties,
  insightItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.75rem',
    fontSize: '0.9rem',
    color: brand.text.secondary,
  } as React.CSSProperties,
  insightIcon: {
    width: '24px',
    height: '24px',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.75rem',
    flexShrink: 0,
  } as React.CSSProperties,
};

// =============================================================================
// MOCK DATA GENERATOR
// =============================================================================

const generateMockData = (dateRange: string) => {
  const multiplier = dateRange === 'week' ? 1 : dateRange === 'month' ? 4 : dateRange === 'quarter' ? 12 : 52;

  const metrics: MetricCard[] = [
    {
      id: 'patients',
      label: 'Total Patients',
      value: Math.floor(120 * multiplier),
      change: 12,
      changeType: 'increase',
      icon: '👥',
      unit: '',
    },
    {
      id: 'sessions',
      label: 'Sessions Completed',
      value: Math.floor(340 * multiplier),
      change: 8,
      changeType: 'increase',
      icon: '🎧',
      unit: '',
    },
    {
      id: 'satisfaction',
      label: 'Satisfaction Rate',
      value: 94.5,
      change: 2.1,
      changeType: 'increase',
      icon: '⭐',
      unit: '%',
    },
    {
      id: 'improvement',
      label: 'Average Improvement',
      value: 31,
      change: -1.5,
      changeType: 'decrease',
      icon: '📈',
      unit: '%',
    },
    {
      id: 'revenue',
      label: 'Revenue',
      value: `${(45 * multiplier).toLocaleString()}K`,
      change: 15,
      changeType: 'increase',
      icon: '💰',
      unit: 'SAR',
    },
    {
      id: 'retention',
      label: 'Patient Retention',
      value: 87,
      change: 0,
      changeType: 'neutral',
      icon: '🔄',
      unit: '%',
    },
  ];

  const demographics: PatientDemographic[] = [
    { ageGroup: '3-5', count: 45, percentage: 18 },
    { ageGroup: '6-8', count: 78, percentage: 31 },
    { ageGroup: '9-12', count: 62, percentage: 25 },
    { ageGroup: '13-17', count: 38, percentage: 15 },
    { ageGroup: '18+', count: 27, percentage: 11 },
  ];

  const outcomes: TreatmentOutcome[] = [
    { category: 'Attention', improved: 78, maintained: 15, declined: 7 },
    { category: 'Speech Processing', improved: 72, maintained: 20, declined: 8 },
    { category: 'Reading Skills', improved: 65, maintained: 25, declined: 10 },
    { category: 'Sound Sensitivity', improved: 82, maintained: 12, declined: 6 },
    { category: 'Academic Performance', improved: 58, maintained: 32, declined: 10 },
  ];

  const trendData: TrendDataPoint[] = Array.from({ length: 12 }, (_, i) => ({
    date: `Week ${i + 1}`,
    value: 70 + Math.random() * 30,
  }));

  const sessionsByDay: ChartDataPoint[] = [
    { label: 'Sun', value: 12 },
    { label: 'Mon', value: 45 },
    { label: 'Tue', value: 52 },
    { label: 'Wed', value: 48 },
    { label: 'Thu', value: 55 },
    { label: 'Fri', value: 8 },
    { label: 'Sat', value: 15 },
  ];

  const referralSources: ChartDataPoint[] = [
    { label: 'Schools', value: 35, color: chartColors[0] },
    { label: 'Hospitals', value: 25, color: chartColors[1] },
    { label: 'Doctors', value: 20, color: chartColors[2] },
    { label: 'Word of Mouth', value: 15, color: chartColors[3] },
    { label: 'Online', value: 5, color: chartColors[4] },
  ];

  const concerns: ChartDataPoint[] = [
    { label: 'Attention', value: 42, color: chartColors[0] },
    { label: 'Processing', value: 28, color: chartColors[1] },
    { label: 'Sensitivity', value: 18, color: chartColors[2] },
    { label: 'Speech', value: 12, color: chartColors[3] },
  ];

  return {
    metrics,
    demographics,
    outcomes,
    trendData,
    sessionsByDay,
    referralSources,
    concerns,
  };
};

// =============================================================================
// CHART COMPONENTS
// =============================================================================

interface BarChartProps {
  data: ChartDataPoint[];
  title: string;
  showValues?: boolean;
}

const BarChart: React.FC<BarChartProps> = ({ data, showValues = true }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const maxValue = Math.max(...data.map(d => d.value));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    ctx.scale(2, 2);

    const width = rect.width;
    const height = rect.height;
    const padding = { top: 30, right: 20, bottom: 40, left: 50 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;
    const barWidth = (chartWidth / data.length) * 0.6;
    const barGap = (chartWidth / data.length) * 0.4;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw grid lines
    ctx.strokeStyle = 'rgba(255,255,255,0.05)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
      const y = padding.top + (chartHeight / 5) * i;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();
    }

    // Draw Y-axis labels
    ctx.fillStyle = brand.text.muted;
    ctx.font = '11px Cairo';
    ctx.textAlign = 'right';
    for (let i = 0; i <= 5; i++) {
      const y = padding.top + (chartHeight / 5) * i;
      const value = Math.round(maxValue - (maxValue / 5) * i);
      ctx.fillText(String(value), padding.left - 10, y + 4);
    }

    // Draw bars
    data.forEach((item, index) => {
      const x = padding.left + index * (barWidth + barGap) + barGap / 2;
      const barHeight = (item.value / maxValue) * chartHeight;
      const y = padding.top + chartHeight - barHeight;

      // Gradient fill
      const gradient = ctx.createLinearGradient(x, y, x, padding.top + chartHeight);
      gradient.addColorStop(0, item.color || brand.cyan);
      gradient.addColorStop(1, `${item.color || brand.cyan}40`);

      // Draw bar with rounded top
      ctx.beginPath();
      ctx.fillStyle = gradient;
      ctx.roundRect(x, y, barWidth, barHeight, [8, 8, 0, 0]);
      ctx.fill();

      // Draw value on top
      if (showValues) {
        ctx.fillStyle = brand.text.primary;
        ctx.font = 'bold 12px Cairo';
        ctx.textAlign = 'center';
        ctx.fillText(String(item.value), x + barWidth / 2, y - 8);
      }

      // Draw X-axis label
      ctx.fillStyle = brand.text.muted;
      ctx.font = '11px Cairo';
      ctx.fillText(item.label, x + barWidth / 2, height - padding.bottom + 20);
    });
  }, [data, maxValue, showValues]);

  return <canvas ref={canvasRef} style={styles.canvas} />;
};

interface DonutChartProps {
  data: ChartDataPoint[];
  centerLabel?: string;
  centerValue?: string | number;
}

const DonutChart: React.FC<DonutChartProps> = ({ data, centerLabel, centerValue }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const total = data.reduce((sum, d) => sum + d.value, 0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    ctx.scale(2, 2);

    const width = rect.width;
    const height = rect.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const outerRadius = Math.min(width, height) / 2 - 20;
    const innerRadius = outerRadius * 0.65;

    ctx.clearRect(0, 0, width, height);

    let startAngle = -Math.PI / 2;

    data.forEach((item, index) => {
      const sliceAngle = (item.value / total) * 2 * Math.PI;
      const endAngle = startAngle + sliceAngle;

      // Draw slice
      ctx.beginPath();
      ctx.arc(centerX, centerY, outerRadius, startAngle, endAngle);
      ctx.arc(centerX, centerY, innerRadius, endAngle, startAngle, true);
      ctx.closePath();

      ctx.fillStyle = item.color || chartColors[index % chartColors.length];
      ctx.fill();

      // Add gap between slices
      ctx.strokeStyle = brand.dark;
      ctx.lineWidth = 2;
      ctx.stroke();

      startAngle = endAngle;
    });

    // Draw center text
    if (centerValue !== undefined) {
      ctx.fillStyle = brand.text.primary;
      ctx.font = 'bold 24px Cairo';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(String(centerValue), centerX, centerY - 8);

      if (centerLabel) {
        ctx.fillStyle = brand.text.muted;
        ctx.font = '12px Cairo';
        ctx.fillText(centerLabel, centerX, centerY + 16);
      }
    }
  }, [data, total, centerLabel, centerValue]);

  return <canvas ref={canvasRef} style={styles.canvas} />;
};

interface LineChartProps {
  data: TrendDataPoint[];
  color?: string;
}

const LineChart: React.FC<LineChartProps> = ({ data, color = brand.cyan }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    ctx.scale(2, 2);

    const width = rect.width;
    const height = rect.height;
    const padding = { top: 20, right: 20, bottom: 40, left: 50 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    ctx.clearRect(0, 0, width, height);

    // Draw grid lines
    ctx.strokeStyle = 'rgba(255,255,255,0.05)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
      const y = padding.top + (chartHeight / 5) * i;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();
    }

    // Calculate points
    const valueRange = maxValue - minValue || 1;
    const points = data.map((item, index) => ({
      x: padding.left + (index / (data.length - 1)) * chartWidth,
      y: padding.top + chartHeight - ((item.value - minValue) / valueRange) * chartHeight,
    }));

    // Draw area fill
    const gradient = ctx.createLinearGradient(0, padding.top, 0, height - padding.bottom);
    gradient.addColorStop(0, `${color}40`);
    gradient.addColorStop(1, `${color}00`);

    ctx.beginPath();
    ctx.moveTo(points[0].x, height - padding.bottom);
    points.forEach(p => ctx.lineTo(p.x, p.y));
    ctx.lineTo(points[points.length - 1].x, height - padding.bottom);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

    // Draw line
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    points.forEach((p, i) => {
      if (i === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    });
    ctx.stroke();

    // Draw points
    points.forEach((p) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.strokeStyle = brand.dark;
      ctx.lineWidth = 2;
      ctx.stroke();
    });

    // Draw X-axis labels
    ctx.fillStyle = brand.text.muted;
    ctx.font = '10px Cairo';
    ctx.textAlign = 'center';
    data.forEach((item, index) => {
      if (index % 2 === 0) {
        const x = padding.left + (index / (data.length - 1)) * chartWidth;
        ctx.fillText(item.date, x, height - padding.bottom + 20);
      }
    });
  }, [data, maxValue, minValue, color]);

  return <canvas ref={canvasRef} style={styles.canvas} />;
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  dateRange: initialDateRange = 'month',
  onExport,
}) => {
  const { isArabic } = useLanguage();
  const [dateRange, setDateRange] = useState(initialDateRange);
  const [data, setData] = useState(() => generateMockData(initialDateRange));

  // Update data when date range changes
  useEffect(() => {
    setData(generateMockData(dateRange));
  }, [dateRange]);

  // ---------------------------------------------------------------------------
  // TRANSLATIONS
  // ---------------------------------------------------------------------------

  const t = useMemo(() => ({
    title: isArabic ? 'لوحة التحليلات' : 'Analytics Dashboard',
    dateRanges: {
      week: isArabic ? 'أسبوع' : 'Week',
      month: isArabic ? 'شهر' : 'Month',
      quarter: isArabic ? 'ربع سنة' : 'Quarter',
      year: isArabic ? 'سنة' : 'Year',
    },
    export: isArabic ? 'تصدير' : 'Export',
    metrics: {
      patients: isArabic ? 'إجمالي المرضى' : 'Total Patients',
      sessions: isArabic ? 'الجلسات المكتملة' : 'Sessions Completed',
      satisfaction: isArabic ? 'معدل الرضا' : 'Satisfaction Rate',
      improvement: isArabic ? 'متوسط التحسن' : 'Avg Improvement',
      revenue: isArabic ? 'الإيرادات' : 'Revenue',
      retention: isArabic ? 'الاحتفاظ بالمرضى' : 'Patient Retention',
    },
    charts: {
      sessionsPerDay: isArabic ? 'الجلسات حسب اليوم' : 'Sessions by Day',
      referralSources: isArabic ? 'مصادر الإحالة' : 'Referral Sources',
      demographics: isArabic ? 'التركيبة العمرية' : 'Age Demographics',
      concerns: isArabic ? 'المخاوف الأساسية' : 'Primary Concerns',
      trend: isArabic ? 'اتجاه التحسن' : 'Improvement Trend',
      outcomes: isArabic ? 'نتائج العلاج' : 'Treatment Outcomes',
    },
    outcomes: {
      improved: isArabic ? 'تحسن' : 'Improved',
      maintained: isArabic ? 'حافظ' : 'Maintained',
      declined: isArabic ? 'تراجع' : 'Declined',
    },
    insights: {
      title: isArabic ? 'رؤى وتوصيات' : 'Insights & Recommendations',
      items: isArabic ? [
        'زيادة بنسبة 12% في المرضى الجدد مقارنة بالفترة السابقة',
        'أعلى معدلات الحضور يومي الثلاثاء والخميس',
        'الفئة العمرية 6-8 سنوات الأكثر شيوعاً',
        'معدل رضا مرتفع (94.5%) - يوصى بطلب المراجعات',
        'فرصة للتوسع في خدمات البالغين (11% حالياً)',
      ] : [
        '12% increase in new patients compared to previous period',
        'Highest attendance rates on Tuesday and Thursday',
        'Age group 6-8 years is most common',
        'High satisfaction rate (94.5%) - recommend requesting reviews',
        'Opportunity to expand adult services (currently 11%)',
      ],
    },
    vsLast: isArabic ? 'مقابل الفترة السابقة' : 'vs last period',
  }), [isArabic]);

  // ---------------------------------------------------------------------------
  // HANDLERS
  // ---------------------------------------------------------------------------

  const handleDateRangeChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setDateRange(e.target.value as 'week' | 'month' | 'quarter' | 'year');
  }, []);

  const handleExport = useCallback(() => {
    onExport?.('pdf');
  }, [onExport]);

  // ---------------------------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------------------------

  return (
    <div style={styles.container} dir={isArabic ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>
          <span>📊</span>
          {t.title}
        </h1>
        <div style={styles.controls}>
          <select
            value={dateRange}
            onChange={handleDateRangeChange}
            style={styles.dateRangeSelect}
          >
            <option value="week">{t.dateRanges.week}</option>
            <option value="month">{t.dateRanges.month}</option>
            <option value="quarter">{t.dateRanges.quarter}</option>
            <option value="year">{t.dateRanges.year}</option>
          </select>
          <button onClick={handleExport} style={styles.exportButton}>
            📥 {t.export}
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div style={styles.metricsGrid}>
        {data.metrics.map((metric) => (
          <div key={metric.id} style={styles.metricCard}>
            <div style={styles.metricHeader}>
              <div
                style={{
                  ...styles.metricIcon,
                  background: `linear-gradient(135deg, ${brand.cyan}30 0%, ${brand.purple}30 100%)`,
                }}
              >
                {metric.icon}
              </div>
              <div style={styles.metricChange(metric.changeType)}>
                {metric.changeType === 'increase' && '↑'}
                {metric.changeType === 'decrease' && '↓'}
                {metric.change !== 0 && `${metric.change}%`}
              </div>
            </div>
            <div style={styles.metricValue}>
              {metric.value}{metric.unit}
            </div>
            <div style={styles.metricLabel}>
              {t.metrics[metric.id as keyof typeof t.metrics] || metric.label}
            </div>
          </div>
        ))}
      </div>

      {/* Insights Card */}
      <div style={styles.insightsCard}>
        <div style={styles.insightsTitle}>
          <span>💡</span>
          {t.insights.title}
        </div>
        <div style={styles.insightsList}>
          {t.insights.items.map((item, index) => (
            <div key={index} style={styles.insightItem}>
              <div
                style={{
                  ...styles.insightIcon,
                  background: `${[brand.success, brand.cyan, brand.purple, brand.warning, brand.coral][index]}20`,
                  color: [brand.success, brand.cyan, brand.purple, brand.warning, brand.coral][index],
                }}
              >
                {['📈', '📅', '👶', '⭐', '🎯'][index]}
              </div>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Charts Grid */}
      <div style={styles.chartsGrid}>
        {/* Sessions by Day */}
        <div style={styles.chartCard}>
          <div style={styles.chartTitle}>
            <span>📅</span>
            {t.charts.sessionsPerDay}
          </div>
          <div style={styles.chartContainer}>
            <BarChart data={data.sessionsByDay} title={t.charts.sessionsPerDay} />
          </div>
        </div>

        {/* Referral Sources */}
        <div style={styles.chartCard}>
          <div style={styles.chartTitle}>
            <span>🔗</span>
            {t.charts.referralSources}
          </div>
          <div style={styles.chartContainer}>
            <DonutChart
              data={data.referralSources}
              centerValue={data.referralSources.length}
              centerLabel={isArabic ? 'مصادر' : 'Sources'}
            />
          </div>
          <div style={styles.legend}>
            {data.referralSources.map((item, index) => (
              <div key={index} style={styles.legendItem}>
                <div style={styles.legendDot(item.color || chartColors[index])} />
                <span>{item.label} ({item.value}%)</span>
              </div>
            ))}
          </div>
        </div>

        {/* Demographics */}
        <div style={styles.chartCard}>
          <div style={styles.chartTitle}>
            <span>👥</span>
            {t.charts.demographics}
          </div>
          <div style={styles.chartContainer}>
            <BarChart
              data={data.demographics.map((d, i) => ({
                label: d.ageGroup,
                value: d.count,
                color: chartColors[i % chartColors.length],
              }))}
              title={t.charts.demographics}
            />
          </div>
        </div>

        {/* Primary Concerns */}
        <div style={styles.chartCard}>
          <div style={styles.chartTitle}>
            <span>🎯</span>
            {t.charts.concerns}
          </div>
          <div style={styles.chartContainer}>
            <DonutChart
              data={data.concerns}
              centerValue="100%"
              centerLabel={isArabic ? 'المرضى' : 'Patients'}
            />
          </div>
          <div style={styles.legend}>
            {data.concerns.map((item, index) => (
              <div key={index} style={styles.legendItem}>
                <div style={styles.legendDot(item.color || chartColors[index])} />
                <span>{item.label} ({item.value}%)</span>
              </div>
            ))}
          </div>
        </div>

        {/* Improvement Trend */}
        <div style={{ ...styles.chartCard, gridColumn: 'span 2' }}>
          <div style={styles.chartTitle}>
            <span>📈</span>
            {t.charts.trend}
          </div>
          <div style={styles.chartContainer}>
            <LineChart data={data.trendData} color={brand.success} />
          </div>
        </div>
      </div>

      {/* Treatment Outcomes Table */}
      <div style={styles.tableContainer}>
        <div style={styles.tableHeader}>
          <div style={styles.chartTitle}>
            <span>📋</span>
            {t.charts.outcomes}
          </div>
        </div>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>{isArabic ? 'الفئة' : 'Category'}</th>
              <th style={styles.th}>{t.outcomes.improved}</th>
              <th style={styles.th}>{t.outcomes.maintained}</th>
              <th style={styles.th}>{t.outcomes.declined}</th>
              <th style={styles.th}>{isArabic ? 'التقدم' : 'Progress'}</th>
            </tr>
          </thead>
          <tbody>
            {data.outcomes.map((outcome, index) => (
              <tr key={index}>
                <td style={styles.td}>{outcome.category}</td>
                <td style={{ ...styles.td, color: brand.success }}>{outcome.improved}%</td>
                <td style={{ ...styles.td, color: brand.warning }}>{outcome.maintained}%</td>
                <td style={{ ...styles.td, color: brand.error }}>{outcome.declined}%</td>
                <td style={styles.td}>
                  <div style={styles.progressBar(outcome.improved, brand.success)}>
                    <div style={styles.progressFill(outcome.improved, brand.success)} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
