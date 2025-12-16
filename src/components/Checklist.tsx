import { useMemo, useState } from 'react';

import { checklistCategories, checklistItems } from '../data/checklistItems';
import { assetUrl } from '../utils/asset';
import { createPdfDoc, PDF_MARGIN_X, writePdfText } from '../utils/pdf';
import { brandCyan, brandPink, brandPurpleDark, styles } from './styles';

const Checklist = () => {
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [exporting, setExporting] = useState(false);

  const selectedItems = useMemo(() => checklistItems.filter((item) => selected[item.id]), [selected]);
  const selectedCount = selectedItems.length;

  const recommendation = useMemo(() => {
    if (selectedCount <= 4) {
      return {
        label: 'مؤشرات قليلة',
        color: brandCyan,
        msg: 'النتيجة لا تُعد تشخيصاً. إذا كانت هناك مخاوف واضحة، استشر مختصاً.'
      };
    }
    if (selectedCount <= 10) {
      return {
        label: 'مؤشرات متوسطة',
        color: brandPurpleDark,
        msg: 'قد يكون من المفيد إجراء اختبار/استبيان إضافي أو تجربة لعبة التركيز السمعي. يمكن أيضاً مشاركة النتائج مع المدرسة.',
      };
    }
    return {
      label: 'مؤشرات مرتفعة',
      color: brandPink,
      msg: 'ننصح بحجز تقييم متخصص/جلسة تعريفية — خاصة إذا كانت الأعراض تؤثر على المدرسة أو السلوك.'
    };
  }, [selectedCount]);

  const toggle = (id: string) => {
    setSelected((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const clearAll = () => setSelected({});

  const exportSelectedPdf = async () => {
    if (exporting) return;
    setExporting(true);
    try {
      const doc = await createPdfDoc();
      let y = 56;
      doc.setFont('Cairo', 'bold');
      writePdfText(doc, 'قائمة التحقق — Berard AIT Sound Lab', PDF_MARGIN_X, y);
      y += 22;
      doc.setFont('Cairo', 'normal');
      writePdfText(doc, `عدد البنود المحددة: ${selectedCount}`, PDF_MARGIN_X, y);
      y += 18;
      writePdfText(doc, `ملاحظة: هذه القائمة مؤشر أولي وليست تشخيصاً.`, PDF_MARGIN_X, y);
      y += 18;
      writePdfText(doc, `التوصية: ${recommendation.label}`, PDF_MARGIN_X, y);
      y += 26;

      if (selectedItems.length === 0) {
        writePdfText(doc, 'لم يتم تحديد أي بند.', PDF_MARGIN_X, y);
        y += 18;
      } else {
        for (const item of selectedItems) {
          if (y > 760) {
            doc.addPage();
            y = 56;
          }
          doc.setFont('Cairo', 'bold');
          writePdfText(doc, `• ${item.ar}`, PDF_MARGIN_X, y);
          y += 16;
          if (item.en) {
            doc.setFont('Cairo', 'normal');
            doc.text(item.en, PDF_MARGIN_X, y); // English (LTR)
            y += 16;
          }
          y += 6;
        }
      }

      doc.save('Berard-AIT-Checklist-Selected.pdf');
    } finally {
      setExporting(false);
    }
  };

  return (
    <section id="checklist" style={styles.sectionCard}>
      <div style={styles.sectionHeader}>
        <div style={styles.sectionHeaderRow}>
          <h2 style={styles.h2}>قائمة التحقق (Checklist)</h2>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ ...styles.chip, background: 'rgba(143,211,204,0.12)', borderColor: 'rgba(143,211,204,0.25)' }}>
              ✅ {selectedCount} بند
            </span>
            <a
              href={assetUrl('downloads/Check list (2).pdf')}
              target="_blank"
              rel="noreferrer"
              style={{ ...styles.ghostBtn, textDecoration: 'none' }}
            >
              📄 تحميل النسخة الرسمية
            </a>
            <button
              type="button"
              style={exporting ? styles.disabledBtn : styles.ghostBtn}
              onClick={exportSelectedPdf}
              disabled={exporting}
            >
              {exporting ? 'جارٍ التصدير…' : 'تصدير اختيارك PDF'}
            </button>
            <button type="button" style={styles.dangerBtn} onClick={clearAll}>
              مسح
            </button>
          </div>
        </div>
        <p style={styles.bodyText}>
          اختر البنود التي تلاحظها لدى الطفل/الطالب. الهدف هو تكوين صورة أولية تساعدك على اتخاذ قرار (اختبار إضافي، جلسة تعريفية، أو تقييم مختص).
        </p>
        <p style={styles.muted}>
          ⚠️ هذه القائمة ليست تشخيصاً طبياً. النتائج لأغراض توعوية وتنظيمية فقط.
        </p>
      </div>

      <div style={{ marginTop: 14, ...styles.section, marginBottom: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ fontWeight: 900 }}>
            التوصية الحالية: <span style={{ color: recommendation.color }}>{recommendation.label}</span>
          </div>
          <a href="#games" style={{ ...styles.primaryBtn, textDecoration: 'none' }}>
            جرب الألعاب التفاعلية
          </a>
        </div>
        <p style={{ ...styles.bodyText, marginTop: 8 }}>{recommendation.msg}</p>
      </div>

      <div style={{ marginTop: 16, display: 'grid', gap: 14 }}>
        {checklistCategories.map((category) => (
          <div key={category.title} style={{ ...styles.sectionCard, marginBottom: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
              <h3 style={{ ...styles.h3, margin: 0 }}>{category.title}</h3>
              {category.note ? <span style={styles.muted}>{category.note}</span> : null}
            </div>

            <div style={styles.checklistGrid}>
              {category.items.map((item) => (
                <label key={item.id} style={styles.checkItem}>
                  <input
                    type="checkbox"
                    checked={!!selected[item.id]}
                    onChange={() => toggle(item.id)}
                    style={styles.checkbox}
                  />
                  <div style={{ display: 'grid', gap: 2 }}>
                    <span style={{ fontWeight: 800 }}>{item.ar}</span>
                    {item.en ? <span style={styles.muted} dir="ltr">{item.en}</span> : null}
                  </div>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Checklist;
