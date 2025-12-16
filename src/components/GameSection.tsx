import { useEffect, useMemo, useState } from 'react';

import { brandCyan, brandPink, brandPurple, brandPurpleDark, styles } from './styles';

import AssessmentSuiteModal from './games/AssessmentSuiteModal';
import AttentionTestPanel from './games/AttentionTestPanel';
import FrequencyDiscriminationTestPanel from './games/FrequencyDiscriminationTestPanel';
import SequencingTestPanel from './games/SequencingTestPanel';
import QuestionnairePanel from './games/QuestionnairePanel';
import type { GameResult, TestOutcome } from './games/types';
import { resultMeta } from './games/types';

type GameMode = 'suite' | 'attention' | 'frequency' | 'sequence' | 'questionnaire';

const nextStepFrom = (r: GameResult) => {
  if (r === 'low') return { label: 'احجز تقييماً / تواصل الآن', hash: '#contact', tone: brandPink };
  if (r === 'medium') return { label: 'ابدأ بالاستبيان + أكمل الفحص', hash: '#games', tone: brandPurple };
  return { label: 'خيار المدارس/الجامعات', hash: '#schools', tone: brandCyan };
};

function Modal({ title, open, onClose, children }: { title: string; open: boolean; onClose: () => void; children: React.ReactNode }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div style={styles.modalBackdrop} onClick={onClose} role="presentation">
      <div style={styles.modal} dir="rtl" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <div>
            <div style={{ fontWeight: 900, color: brandCyan }}>{title}</div>
            <div style={styles.muted}>أداة فحص تفاعلي (Screening) — غير تشخيصية</div>
          </div>
          <button onClick={onClose} style={styles.ghostBtn}>إغلاق</button>
        </div>
        <div style={{ marginTop: 12 }}>{children}</div>
      </div>
    </div>
  );
}

export default function GameSection() {
  const [mode, setMode] = useState<GameMode | null>(null);
  const [lastOutcome, setLastOutcome] = useState<TestOutcome | null>(null);
  const [modalOutcome, setModalOutcome] = useState<TestOutcome | null>(null);

  // reset modal outcome when switching modes
  useEffect(() => {
    setModalOutcome(null);
  }, [mode]);

  const cards = useMemo(
    () => [
      {
        mode: 'suite' as const,
        title: '🧪 معمل الفحص السمعي (3 اختبارات) — تقرير PDF/CSV',
        desc: 'جلسة تفاعلية قصيرة لقياس مؤشرات الانتباه السمعي + تمييز التردد + التسلسل تحت الضوضاء (Screening).',
        tag: 'الأفضل كبداية',
      },
      {
        mode: 'attention' as const,
        title: '🎯 اختبار الانتباه السمعي تحت الضوضاء (Go/No-Go)',
        desc: 'يقيس الانتباه الانتقائي + الاندفاعية باستخدام d\' (Signal Detection) وزمن الاستجابة.',
        tag: 'موضوعي',
      },
      {
        mode: 'frequency' as const,
        title: '🎚️ اختبار تمييز التردد (Adaptive 2IFC)',
        desc: 'تقدير تقريبي لعتبة تمييز فروقات التردد عبر صعوبة تكيفية.',
        tag: 'موضوعي',
      },
      {
        mode: 'sequence' as const,
        title: '🏫 محاكاة صف — تسلسل/ذاكرة سمعية تحت الضوضاء',
        desc: 'اتباع سلسلة أوامر صوتية (تمثيل بالأشكال) مع ضوضاء متزايدة. مناسب لعرض المدارس.',
        tag: 'School Demo',
      },
      {
        mode: 'questionnaire' as const,
        title: '📝 استبيان مؤشرات للأهل (غير تشخيصي)',
        desc: 'يعطي سياقاً ذاتياً ويُفضّل استخدامه مع الاختبارات الموضوعية.',
        tag: 'Subjective',
      },
    ],
    []
  );

  const lastMeta = lastOutcome ? resultMeta[lastOutcome.result] : null;
  const lastNext = lastOutcome ? nextStepFrom(lastOutcome.result) : null;

  return (
    <section id="games" style={styles.sectionCard}>
      <div style={styles.sectionHeader}>
        <h2 style={styles.h2}>الألعاب / الفحوصات التفاعلية (Screening Lab)</h2>
        <p style={styles.lead}>
          هذه ليست "لعبة عشوائية" — بل <b style={{ color: brandCyan }}>اختبارات تفاعلية منظمة</b> تعطي مؤشرات قابلة للقياس (زمن استجابة، دقة،
          عتبة تمييز). <b style={{ color: brandPink }}>ليست تشخيصاً طبياً</b> ولا تغني عن تقييم أخصائي.
        </p>

        <div style={{ ...styles.section, marginTop: 12, marginBottom: 0 }}>
          <div style={{ fontWeight: 900, color: brandPurpleDark }}>أفضل تجربة</div>
          <div style={styles.muted}>استخدم سماعات + ارفع الصوت لمستوى مريح + مكان هادئ. بعض المتصفحات تمنع تشغيل الصوت قبل الضغط على “ابدأ”.</div>
        </div>
      </div>

      <div style={styles.gameGrid}>
        {cards.map((c) => (
          <div key={c.mode} style={styles.gameCard}>
            <div style={styles.gameCardTop}>
              <div style={{ fontWeight: 900 }}>{c.title}</div>
              <span style={styles.chip}>{c.tag}</span>
            </div>
            <div style={styles.muted}>{c.desc}</div>
            <button
              onClick={() => setMode(c.mode)}
              style={{ ...styles.primaryBtn, marginTop: 6, background: `linear-gradient(135deg, ${brandPurpleDark}, ${brandPink})` }}
            >
              ابدأ
            </button>
          </div>
        ))}
      </div>

      {lastOutcome && lastMeta && lastNext ? (
        <div style={{ ...styles.section, marginTop: 14, marginBottom: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 900, color: lastMeta.color }}>آخر نتيجة محفوظة: {lastOutcome.title}</div>
              <div style={{ ...styles.muted, marginTop: 6 }}>{lastOutcome.scoreLabel}</div>
              <div style={{ ...styles.muted, marginTop: 6 }}>{lastOutcome.message}</div>
            </div>
            <a
              href={lastNext.hash}
              style={{ ...styles.primaryBtn, textDecoration: 'none', background: `linear-gradient(135deg, ${brandPurpleDark}, ${lastNext.tone})` }}
            >
              {lastNext.label}
            </a>
          </div>
        </div>
      ) : null}

      {/* SUITE MODAL */}
      <AssessmentSuiteModal open={mode === 'suite'} onClose={() => setMode(null)} />

      {/* SINGLE TEST MODALS */}
      <Modal
        open={mode === 'attention'}
        onClose={() => setMode(null)}
        title="🎯 اختبار الانتباه السمعي تحت الضوضاء"
      >
        <AttentionTestPanel
          onDone={(o) => {
            setLastOutcome(o);
            setModalOutcome(o);
          }}
        />
        {modalOutcome ? (
          <div style={{ ...styles.section, marginTop: 12, marginBottom: 0 }}>
            <div style={{ fontWeight: 900, color: resultMeta[modalOutcome.result].color }}>النتيجة: {resultMeta[modalOutcome.result].label}</div>
            <div style={{ ...styles.muted, marginTop: 6 }}>{modalOutcome.scoreLabel}</div>
          </div>
        ) : null}
      </Modal>

      <Modal
        open={mode === 'frequency'}
        onClose={() => setMode(null)}
        title="🎚️ اختبار تمييز التردد"
      >
        <FrequencyDiscriminationTestPanel
          onDone={(o) => {
            setLastOutcome(o);
            setModalOutcome(o);
          }}
        />
        {modalOutcome ? (
          <div style={{ ...styles.section, marginTop: 12, marginBottom: 0 }}>
            <div style={{ fontWeight: 900, color: resultMeta[modalOutcome.result].color }}>النتيجة: {resultMeta[modalOutcome.result].label}</div>
            <div style={{ ...styles.muted, marginTop: 6 }}>{modalOutcome.scoreLabel}</div>
          </div>
        ) : null}
      </Modal>

      <Modal
        open={mode === 'sequence'}
        onClose={() => setMode(null)}
        title="🏫 محاكاة صف — تسلسل/ذاكرة سمعية"
      >
        <SequencingTestPanel
          onDone={(o) => {
            setLastOutcome(o);
            setModalOutcome(o);
          }}
        />
        {modalOutcome ? (
          <div style={{ ...styles.section, marginTop: 12, marginBottom: 0 }}>
            <div style={{ fontWeight: 900, color: resultMeta[modalOutcome.result].color }}>النتيجة: {resultMeta[modalOutcome.result].label}</div>
            <div style={{ ...styles.muted, marginTop: 6 }}>{modalOutcome.scoreLabel}</div>
          </div>
        ) : null}
      </Modal>

      <Modal
        open={mode === 'questionnaire'}
        onClose={() => setMode(null)}
        title="📝 استبيان مؤشرات للأهل"
      >
        <QuestionnairePanel
          onDone={(o) => {
            setLastOutcome(o);
            setModalOutcome(o);
          }}
        />
        {modalOutcome ? (
          <div style={{ ...styles.section, marginTop: 12, marginBottom: 0 }}>
            <div style={{ fontWeight: 900, color: resultMeta[modalOutcome.result].color }}>النتيجة: {resultMeta[modalOutcome.result].label}</div>
            <div style={{ ...styles.muted, marginTop: 6 }}>{modalOutcome.scoreLabel}</div>
          </div>
        ) : null}
      </Modal>
    </section>
  );
}
