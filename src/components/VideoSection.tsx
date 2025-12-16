import { styles, brandCyan, brandPink, brandPurple, brandPurpleDark } from './styles';

type Video = {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  duration: string;
  icon: string;
  category: 'intro' | 'science' | 'results';
};

const videos: Video[] = [
  {
    id: 'intro-ait',
    title: 'مقدمة عن Berard AIT',
    titleEn: 'Introduction to Berard AIT',
    description: 'نظرة عامة على برنامج التدريب السمعي وكيف يعمل',
    duration: '5:30',
    icon: '🎬',
    category: 'intro',
  },
  {
    id: 'how-it-works',
    title: 'كيف يتم Berard AIT؟',
    titleEn: 'How is Berard AIT Done?',
    description: 'شرح الخطوات الإجرائية والإجابة على الأسئلة الشائعة',
    duration: '8:15',
    icon: '⚙️',
    category: 'intro',
  },
  {
    id: 'results',
    title: 'نتائج Berard AIT',
    titleEn: 'Results From Berard AIT',
    description: 'بيانات ما قبل/بعد تُظهر تحسينات قابلة للقياس',
    duration: '6:45',
    icon: '📊',
    category: 'results',
  },
  {
    id: 'changes',
    title: 'التغييرات المتوقعة ومتى تحدث',
    titleEn: 'What Changes Occur and When',
    description: 'تفاصيل النتائج المتوقعة والجدول الزمني',
    duration: '7:20',
    icon: '📈',
    category: 'results',
  },
  {
    id: 'auditory-processing',
    title: 'AIT والمعالجة السمعية',
    titleEn: 'AIT and Auditory Processing',
    description: 'العلاقة بين البرنامج وتطوير المهارات السمعية',
    duration: '9:00',
    icon: '👂',
    category: 'science',
  },
  {
    id: 'visual-processing',
    title: 'AIT والمعالجة البصرية',
    titleEn: 'AIT and Visual Processing',
    description: 'الروابط بين الأنظمة السمعية والبصرية',
    duration: '7:45',
    icon: '👁️',
    category: 'science',
  },
  {
    id: 'brain-changes',
    title: 'الدماغ الذي يُغيّر نفسه',
    titleEn: 'The Brain That Changes Itself',
    description: 'شرح مفاهيم اللدونة العصبية',
    duration: '10:30',
    icon: '🧠',
    category: 'science',
  },
];

const categoryLabels = {
  intro: { label: 'مقدمة', color: brandCyan },
  science: { label: 'علمي', color: brandPurple },
  results: { label: 'نتائج', color: brandPink },
};

export default function VideoSection() {
  return (
    <section id="videos" style={styles.sectionCard}>
      <div style={styles.sectionHeader}>
        <div style={styles.sectionHeaderRow}>
          <h2 style={styles.h2}>مكتبة الفيديو التعليمية</h2>
          <span style={{ ...styles.chip, background: 'rgba(176,18,112,0.12)', borderColor: 'rgba(176,18,112,0.25)' }}>
            🎥 محتوى مرئي
          </span>
        </div>
        <p style={styles.bodyText}>
          مجموعة من الفيديوهات التعليمية لفهم أعمق لبرنامج Berard AIT وأساسه العلمي.
        </p>
      </div>

      {/* Category Filters */}
      <div style={{
        marginTop: 16,
        display: 'flex',
        gap: 10,
        flexWrap: 'wrap',
        paddingBottom: 16,
        borderBottom: '1px solid rgba(255,255,255,0.08)',
      }}>
        <span style={{ ...styles.chip, background: 'rgba(255,255,255,0.1)' }}>
          الكل ({videos.length})
        </span>
        {Object.entries(categoryLabels).map(([key, { label, color }]) => (
          <span
            key={key}
            style={{
              ...styles.chip,
              background: `${color}22`,
              borderColor: `${color}44`,
            }}
          >
            {label} ({videos.filter(v => v.category === key).length})
          </span>
        ))}
      </div>

      {/* Video Grid */}
      <div style={{
        marginTop: 20,
        display: 'grid',
        gap: 14,
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))'
      }}>
        {videos.map((video) => {
          const cat = categoryLabels[video.category];
          return (
            <div
              key={video.id}
              style={{
                background: 'rgba(15,22,41,0.7)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 16,
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = `${cat.color}55`;
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = `0 12px 30px rgba(0,0,0,0.3)`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {/* Video Thumbnail Placeholder */}
              <div style={{
                aspectRatio: '16/9',
                background: `linear-gradient(135deg, ${cat.color}22, rgba(15,22,41,0.9))`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
              }}>
                <span style={{ fontSize: 48, opacity: 0.8 }}>{video.icon}</span>

                {/* Play Button */}
                <div style={{
                  position: 'absolute',
                  width: 56,
                  height: 56,
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.95)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                }}>
                  <div style={{
                    width: 0,
                    height: 0,
                    borderTop: '10px solid transparent',
                    borderBottom: '10px solid transparent',
                    borderLeft: `16px solid ${brandPurpleDark}`,
                    marginLeft: 4,
                  }} />
                </div>

                {/* Duration Badge */}
                <div style={{
                  position: 'absolute',
                  bottom: 8,
                  left: 8,
                  background: 'rgba(0,0,0,0.8)',
                  padding: '4px 8px',
                  borderRadius: 6,
                  fontSize: 12,
                  fontWeight: 700,
                }}>
                  {video.duration}
                </div>

                {/* Category Badge */}
                <div style={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  background: cat.color,
                  color: '#fff',
                  padding: '4px 10px',
                  borderRadius: 8,
                  fontSize: 11,
                  fontWeight: 800,
                }}>
                  {cat.label}
                </div>
              </div>

              {/* Video Info */}
              <div style={{ padding: 14 }}>
                <h3 style={{
                  margin: 0,
                  fontSize: 15,
                  fontWeight: 800,
                  color: '#f7f8fb',
                  lineHeight: 1.4,
                }}>
                  {video.title}
                </h3>
                <div style={{
                  fontSize: 12,
                  color: cat.color,
                  marginTop: 4,
                  fontWeight: 600,
                }}>
                  {video.titleEn}
                </div>
                <p style={{
                  margin: '8px 0 0',
                  fontSize: 13,
                  color: 'rgba(255,255,255,0.7)',
                  lineHeight: 1.5,
                }}>
                  {video.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* YouTube Channel CTA */}
      <div style={{
        marginTop: 24,
        padding: 20,
        background: `linear-gradient(135deg, rgba(255,0,0,0.1), rgba(176,18,112,0.1))`,
        borderRadius: 14,
        border: '1px solid rgba(255,0,0,0.2)',
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        flexWrap: 'wrap',
      }}>
        <div style={{
          width: 60,
          height: 60,
          borderRadius: 12,
          background: '#FF0000',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 28,
        }}>
          ▶️
        </div>
        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{ fontWeight: 800, fontSize: 16 }}>المزيد على YouTube</div>
          <div style={{ ...styles.muted, marginTop: 4 }}>
            شاهد المزيد من الفيديوهات التعليمية على قناتنا
          </div>
        </div>
        <a
          href="https://www.youtube.com/@BerardAIT"
          target="_blank"
          rel="noreferrer"
          style={{
            ...styles.primaryBtn,
            textDecoration: 'none',
            background: '#FF0000',
          }}
        >
          زيارة القناة
        </a>
      </div>

      <p style={{ ...styles.muted, marginTop: 16, textAlign: 'center' }}>
        ⚠️ الفيديوهات للأغراض التعليمية فقط وليست بديلاً عن الاستشارة المهنية
      </p>
    </section>
  );
}
