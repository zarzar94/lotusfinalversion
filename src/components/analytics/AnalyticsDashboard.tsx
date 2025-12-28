import { useEffect, useRef } from 'react';
import { styles, brandCyan, brandPink, brandPurple, colors } from '../styles';

const barData = [
  { label: 'انتباه', value: 78 },
  { label: 'معالجة سمعية', value: 66 },
  { label: 'توازن', value: 84 },
  { label: 'تسلسل', value: 72 },
];

const donutData = [
  { label: 'إكمال التقييم', value: 42, color: brandCyan },
  { label: 'بداية العلاج', value: 31, color: brandPurple },
  { label: 'متابعة', value: 19, color: brandPink },
];

const lineData = [
  { day: 1, value: 58 },
  { day: 3, value: 63 },
  { day: 5, value: 70 },
  { day: 7, value: 76 },
  { day: 10, value: 82 },
];

const AnalyticsDashboard = ({ locale = 'ar' }: { locale?: 'ar' | 'en' }) => {
  const barRef = useRef<HTMLCanvasElement | null>(null);
  const donutRef = useRef<HTMLCanvasElement | null>(null);
  const lineRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const barCtx = barRef.current?.getContext('2d');
    if (barCtx) {
      barCtx.clearRect(0, 0, 320, 160);
      barData.forEach((item, idx) => {
        const width = 40;
        const gap = 30;
        const x = 30 + idx * (width + gap);
        const height = (item.value / 100) * 140;
        const y = 150 - height;
        barCtx.fillStyle = idx % 2 === 0 ? brandCyan : brandPurple;
        barCtx.fillRect(x, y, width, height);
        barCtx.fillStyle = 'rgba(255,255,255,0.85)';
        barCtx.fillText(item.value.toString(), x + 6, y - 6);
      });
    }

    const donutCtx = donutRef.current?.getContext('2d');
    if (donutCtx) {
      donutCtx.clearRect(0, 0, 200, 200);
      const total = donutData.reduce((acc, item) => acc + item.value, 0);
      let start = -Math.PI / 2;
      donutData.forEach((item) => {
        const slice = (item.value / total) * Math.PI * 2;
        donutCtx.beginPath();
        donutCtx.moveTo(100, 100);
        donutCtx.arc(100, 100, 80, start, start + slice);
        donutCtx.closePath();
        donutCtx.fillStyle = item.color;
        donutCtx.globalAlpha = 0.82;
        donutCtx.fill();
        start += slice;
      });
      donutCtx.globalAlpha = 1;
      donutCtx.fillStyle = colors.surface.elevated;
      donutCtx.beginPath();
      donutCtx.arc(100, 100, 45, 0, Math.PI * 2);
      donutCtx.fill();
    }

    const lineCtx = lineRef.current?.getContext('2d');
    if (lineCtx) {
      lineCtx.clearRect(0, 0, 320, 180);
      lineCtx.strokeStyle = brandPink;
      lineCtx.lineWidth = 3;
      lineCtx.beginPath();
      lineData.forEach((point, idx) => {
        const x = (idx / (lineData.length - 1)) * 300 + 10;
        const y = 160 - (point.value / 100) * 140;
        if (idx === 0) lineCtx.moveTo(x, y);
        else lineCtx.lineTo(x, y);
      });
      lineCtx.stroke();
      lineCtx.fillStyle = brandPink;
      lineData.forEach((point, idx) => {
        const x = (idx / (lineData.length - 1)) * 300 + 10;
        const y = 160 - (point.value / 100) * 140;
        lineCtx.beginPath();
        lineCtx.arc(x, y, 4, 0, Math.PI * 2);
        lineCtx.fill();
      });
    }
  }, []);

  return (
    <section style={{ ...styles.sectionCard, display: 'grid', gap: 16 }}>
      <div style={styles.sectionHeader}>
        <div style={styles.sectionHeaderRow}>
          <h2 style={styles.h2}>{locale === 'ar' ? 'لوحة تحليلات' : 'Analytics Dashboard'}</h2>
          <span style={{ ...styles.chip, background: 'rgba(143,211,204,0.14)' }}>Canvas + KPIs</span>
        </div>
        <p style={styles.bodyText}>
          {locale === 'ar'
            ? 'رسوم بيانية (أعمدة/دونات/خطية)، شبكة مؤشرات، لوحة رؤى، وجدول نتائج العلاج.'
            : 'Bar, donut, and line canvas charts with metrics grid, insights, and outcomes table.'}
        </p>
      </div>

      <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
        <div style={{ ...styles.section, minHeight: 220 }}>
          <div style={styles.sectionHeaderRow}>
            <span style={styles.kicker}>KPI Grid</span>
            <span style={{ ...styles.chip, background: 'rgba(255,255,255,0.05)' }}>4 metrics</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10 }}>
            {[
              { title: 'متابعة ٧ أيام', value: '82%', trend: '+6%' },
              { title: 'إتمام التقييم', value: '71%', trend: '+3%' },
              { title: 'رضا ولي الأمر', value: '4.6/5', trend: '+0.2' },
              { title: 'وقت التفعيل', value: '6د', trend: '-1د' },
            ].map((metric) => (
              <div key={metric.title} style={{ ...styles.section, padding: 12 }}>
                <div style={{ ...styles.kicker, opacity: 0.7 }}>{metric.title}</div>
                <div style={{ ...styles.h3, margin: '4px 0' }}>{metric.value}</div>
                <div style={{ color: brandCyan }}>{metric.trend}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ ...styles.section, minHeight: 220 }}>
          <div style={styles.sectionHeaderRow}>
            <span style={styles.kicker}>Bar</span>
            <span style={{ ...styles.chip, background: 'rgba(176,18,112,0.12)', color: brandPink }}>التقدم</span>
          </div>
          <canvas ref={barRef} width={320} height={160} style={{ width: '100%' }} />
        </div>

        <div style={{ ...styles.section, minHeight: 220 }}>
          <div style={styles.sectionHeaderRow}>
            <span style={styles.kicker}>Donut</span>
            <span style={{ ...styles.chip, background: 'rgba(143,211,204,0.12)' }}>رحلة</span>
          </div>
          <canvas ref={donutRef} width={200} height={200} style={{ width: '100%' }} />
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {donutData.map((item) => (
              <span
                key={item.label}
                style={{
                  ...styles.chip,
                  background: 'rgba(255,255,255,0.05)',
                  borderColor: item.color,
                  color: item.color,
                }}
              >
                {item.label}: {item.value}
              </span>
            ))}
          </div>
        </div>

        <div style={{ ...styles.section, minHeight: 220 }}>
          <div style={styles.sectionHeaderRow}>
            <span style={styles.kicker}>Line</span>
            <span style={{ ...styles.chip, background: 'rgba(255,255,255,0.05)' }}>جلسات</span>
          </div>
          <canvas ref={lineRef} width={320} height={180} style={{ width: '100%' }} />
        </div>
      </div>

      <div style={{ ...styles.section, display: 'grid', gap: 8 }}>
        <div style={styles.sectionHeaderRow}>
          <span style={styles.kicker}>{locale === 'ar' ? 'الرؤى' : 'Insights'}</span>
          <span style={{ ...styles.chip, background: 'rgba(255,255,255,0.05)' }}>AI hints</span>
        </div>
        <ul style={{ margin: 0, paddingInlineStart: 18, color: 'rgba(255,255,255,0.85)', lineHeight: 1.6 }}>
          <li>زيادة الالتزام في الأيام 5-7 تشير إلى فعالية التدرج.</li>
          <li>التسلسل يحتاج تدريباً إضافياً في جلسات المساء.</li>
          <li>معدل الاستكمال قبل الظهيرة أعلى بنسبة 12%.</li>
        </ul>
      </div>

      <div style={{ ...styles.section, display: 'grid', gap: 6 }}>
        <div style={styles.sectionHeaderRow}>
          <span style={styles.kicker}>{locale === 'ar' ? 'نتائج العلاج' : 'Treatment outcomes'}</span>
          <span style={{ ...styles.chip, background: 'rgba(143,211,204,0.12)' }}>جدول</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, minmax(0, 1fr))', gap: 8, fontSize: 13 }}>
          <div style={styles.kicker}>المريض</div>
          <div style={styles.kicker}>التحسن</div>
          <div style={styles.kicker}>الالتزام</div>
          <div style={styles.kicker}>جلسات</div>
          <div style={styles.kicker}>ملاحظات</div>
          {[
            ['سارة', 'تحسن سمعي 15%', '92%', '20', 'تركيز أفضل صباحاً'],
            ['محمود', 'تحسن انتباه 12%', '88%', '18', 'حساسية أقل للضوضاء'],
            ['ليان', 'توازن 10%', '95%', '20', 'تحسن تسلسل الكلمات'],
          ].map((row, idx) => (
            <>
              {row.map((cell) => (
                <div key={`${cell}-${idx}`} style={{ padding: '8px 6px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  {cell}
                </div>
              ))}
            </>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AnalyticsDashboard;
