import { useState, useMemo } from 'react';
import { styles, brandCyan, brandPink, brandPurple, brandPurpleDark } from './styles';
import { PlayIcon, VideoIcon, ChartIcon, BrainIcon, EyeIcon, EarIcon, BeakerIcon } from './Icons';
import { useLanguage } from '../context/LanguageContext';

type Video = {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  duration: string;
  icon: React.ReactNode;
  category: 'intro' | 'science' | 'results';
};

const videos: Video[] = [
  {
    id: 'intro-ait',
    title: 'مقدمة عن Berard AIT',
    titleEn: 'Introduction to Berard AIT',
    description: 'نظرة عامة على برنامج التدريب السمعي وكيف يعمل',
    descriptionEn: 'An overview of the auditory training program and how it works',
    duration: '5:30',
    icon: <VideoIcon size={28} color={brandCyan} />,
    category: 'intro',
  },
  {
    id: 'how-it-works',
    title: 'كيف يتم Berard AIT؟',
    titleEn: 'How is Berard AIT Done?',
    description: 'شرح الخطوات الإجرائية والإجابة على الأسئلة الشائعة',
    descriptionEn: 'A step-by-step walkthrough and answers to common questions',
    duration: '8:15',
    icon: <BeakerIcon size={28} color={brandCyan} />,
    category: 'intro',
  },
  {
    id: 'results',
    title: 'نتائج Berard AIT',
    titleEn: 'Results From Berard AIT',
    description: 'بيانات ما قبل/بعد تُظهر تحسينات قابلة للقياس',
    descriptionEn: 'Before/after data showing measurable improvements',
    duration: '6:45',
    icon: <ChartIcon size={28} color={brandPink} />,
    category: 'results',
  },
  {
    id: 'changes',
    title: 'التغييرات المتوقعة ومتى تحدث',
    titleEn: 'What Changes Occur and When',
    description: 'تفاصيل النتائج المتوقعة والجدول الزمني',
    descriptionEn: 'Expected outcomes and the typical timeline',
    duration: '7:20',
    icon: <ChartIcon size={28} color={brandPink} />,
    category: 'results',
  },
  {
    id: 'auditory-processing',
    title: 'AIT والمعالجة السمعية',
    titleEn: 'AIT and Auditory Processing',
    description: 'العلاقة بين البرنامج وتطوير المهارات السمعية',
    descriptionEn: 'How the program supports auditory skills development',
    duration: '9:00',
    icon: <EarIcon size={28} color={brandPurple} />,
    category: 'science',
  },
  {
    id: 'visual-processing',
    title: 'AIT والمعالجة البصرية',
    titleEn: 'AIT and Visual Processing',
    description: 'الروابط بين الأنظمة السمعية والبصرية',
    descriptionEn: 'Connections between auditory and visual processing',
    duration: '7:45',
    icon: <EyeIcon size={28} color={brandPurple} />,
    category: 'science',
  },
  {
    id: 'brain-changes',
    title: 'الدماغ الذي يُغيّر نفسه',
    titleEn: 'The Brain That Changes Itself',
    description: 'شرح مفاهيم اللدونة العصبية',
    descriptionEn: 'Neuroplasticity concepts explained',
    duration: '10:30',
    icon: <BrainIcon size={28} color={brandPurple} />,
    category: 'science',
  },
];

const categoryLabels = {
  intro: { labelAr: 'مقدمة', labelEn: 'Intro', color: brandCyan },
  science: { labelAr: 'علمي', labelEn: 'Science', color: brandPurple },
  results: { labelAr: 'نتائج', labelEn: 'Results', color: brandPink },
};

// Lab Monitor Screen component
const LabMonitor = ({ video, isHovered, isArabic, onHover }: {
  video: Video;
  isHovered: boolean;
  isArabic: boolean;
  onHover: (id: string | null) => void;
}) => {
  const cat = categoryLabels[video.category];
  const catLabel = isArabic ? cat.labelAr : cat.labelEn;

  return (
    <div
      onMouseEnter={() => onHover(video.id)}
      onMouseLeave={() => onHover(null)}
      style={{
        position: 'relative',
        cursor: 'pointer',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: isHovered ? 'translateY(-8px) scale(1.02)' : 'translateY(0) scale(1)',
      }}
    >
      {/* Monitor Frame */}
      <div style={{
        background: 'linear-gradient(180deg, #2a2a3a 0%, #1a1a24 100%)',
        borderRadius: 16,
        padding: 8,
        border: '2px solid rgba(100,100,120,0.3)',
        boxShadow: isHovered
          ? `0 20px 50px rgba(0,0,0,0.5), 0 0 30px ${cat.color}30, inset 0 1px 0 rgba(255,255,255,0.1)`
          : '0 10px 30px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
        transition: 'all 0.4s ease',
      }}>
        {/* Screen Bezel */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(15,22,41,0.95), rgba(10,15,30,0.98))',
          borderRadius: 10,
          overflow: 'hidden',
          border: `1px solid ${isHovered ? cat.color + '40' : 'rgba(255,255,255,0.05)'}`,
          transition: 'border-color 0.3s ease',
        }}>
          {/* Screen Content - Video Thumbnail */}
          <div style={{
            aspectRatio: '16/9',
            position: 'relative',
            background: `radial-gradient(ellipse at center, ${cat.color}15, transparent 70%)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            {/* Scanlines overlay */}
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px)',
              pointerEvents: 'none',
              opacity: 0.3,
            }} />

            {/* Screen glow effect */}
            <div style={{
              position: 'absolute',
              inset: 0,
              background: `radial-gradient(circle at 50% 0%, ${cat.color}20, transparent 60%)`,
              opacity: isHovered ? 1 : 0.5,
              transition: 'opacity 0.3s ease',
            }} />

            {/* Icon display */}
            <div style={{
              position: 'relative',
              zIndex: 2,
              opacity: 0.9,
              transform: isHovered ? 'scale(1.1)' : 'scale(1)',
              transition: 'transform 0.3s ease',
            }}>
              {video.icon}
            </div>

            {/* Play Button */}
            <div style={{
              position: 'absolute',
              width: 60,
              height: 60,
              borderRadius: '50%',
              background: isHovered ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.85)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 4px 20px rgba(0,0,0,0.4), 0 0 ${isHovered ? 30 : 15}px ${cat.color}40`,
              transition: 'all 0.3s ease',
              transform: isHovered ? 'scale(1.1)' : 'scale(1)',
              zIndex: 3,
            }}>
              <PlayIcon size={24} color={brandPurpleDark} style={{ marginLeft: 3 }} />
            </div>

            {/* Duration badge */}
            <div style={{
              position: 'absolute',
              bottom: 10,
              left: 10,
              background: 'rgba(0,0,0,0.85)',
              padding: '4px 10px',
              borderRadius: 6,
              fontSize: 12,
              fontWeight: 700,
              fontFamily: 'monospace',
              color: cat.color,
              border: `1px solid ${cat.color}30`,
            }}>
              {video.duration}
            </div>

            {/* Category badge */}
            <div style={{
              position: 'absolute',
              top: 10,
              right: 10,
              background: cat.color,
              color: '#fff',
              padding: '4px 12px',
              borderRadius: 8,
              fontSize: 11,
              fontWeight: 800,
            }}>
              {catLabel}
            </div>

            {/* Live indicator dot */}
            <div style={{
              position: 'absolute',
              top: 12,
              left: 12,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}>
              <div style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: '#22c55e',
                animation: 'pulse 2s infinite',
              }} />
              <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.6)', fontWeight: 600 }}>LAB</span>
            </div>
          </div>

          {/* Video Info Panel */}
          <div style={{
            padding: '14px 16px',
            borderTop: '1px solid rgba(255,255,255,0.06)',
            background: 'rgba(0,0,0,0.2)',
          }}>
            <h3 style={{
              margin: 0,
              fontSize: 14,
              fontWeight: 800,
              color: '#f7f8fb',
              lineHeight: 1.4,
            }}>
              {isArabic ? video.title : video.titleEn}
            </h3>
            {isArabic ? (
              <div style={{
                fontSize: 11,
                color: cat.color,
                marginTop: 4,
                fontWeight: 600,
                fontFamily: 'monospace',
              }}>
                {video.titleEn}
              </div>
            ) : null}
            <p style={{
              margin: '8px 0 0',
              fontSize: 12,
              color: 'rgba(255,255,255,0.6)',
              lineHeight: 1.5,
            }}>
              {isArabic ? video.description : video.descriptionEn}
            </p>
          </div>
        </div>

        {/* Monitor Stand */}
        <div style={{
          height: 6,
          background: 'linear-gradient(180deg, #3a3a4a, #2a2a3a)',
          marginTop: 8,
          marginLeft: '30%',
          marginRight: '30%',
          borderRadius: '0 0 4px 4px',
        }} />
      </div>
    </div>
  );
};

export default function VideoSection() {
  const { isArabic } = useLanguage();
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'intro' | 'science' | 'results'>('all');

  const filteredVideos = useMemo(() => {
    if (filter === 'all') return videos;
    return videos.filter(v => v.category === filter);
  }, [filter]);

  const css = useMemo(() => `
    @keyframes pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.5; transform: scale(1.2); }
    }
    @keyframes flicker {
      0%, 100% { opacity: 1; }
      92% { opacity: 1; }
      93% { opacity: 0.8; }
      94% { opacity: 1; }
      96% { opacity: 0.9; }
      97% { opacity: 1; }
    }
    .lab-section {
      animation: flicker 10s infinite;
    }
    .filter-btn {
      transition: all 0.3s ease;
    }
    .filter-btn:hover {
      transform: translateY(-2px);
    }
  `, []);

  return (
    <section id="videos" className="lab-section" style={{
      ...styles.sectionCard,
      position: 'relative',
      overflow: 'hidden',
    }}>
      <style>{css}</style>

      {/* Lab Background Elements */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 2,
        background: `linear-gradient(90deg, transparent, ${brandCyan}30, ${brandPurple}30, transparent)`,
      }} />

      {/* Grid pattern */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `
          linear-gradient(rgba(143,211,204,0.02) 1px, transparent 1px),
          linear-gradient(90deg, rgba(143,211,204,0.02) 1px, transparent 1px)
        `,
        backgroundSize: '30px 30px',
        pointerEvents: 'none',
      }} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={styles.sectionHeader}>
          <div style={styles.sectionHeaderRow}>
            <h2 style={styles.h2}>{isArabic ? 'مختبر الفيديو التعليمي' : 'Video Learning Lab'}</h2>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 14px',
              background: 'rgba(143,211,204,0.1)',
              border: '1px solid rgba(143,211,204,0.2)',
              borderRadius: 10,
            }}>
              <BeakerIcon size={16} color={brandCyan} />
              <span style={{ fontSize: 12, fontWeight: 700, color: brandCyan }}>
                {filteredVideos.length} {isArabic ? 'عرض' : 'videos'}
              </span>
            </div>
          </div>
          <p style={styles.bodyText}>
            {isArabic
              ? 'شاشات العرض المخبرية لفهم برنامج Berard AIT وأساسه العلمي'
              : 'Lab-style screens to understand Berard AIT and its scientific foundation'}
          </p>

          {/* Filter tabs */}
          <div style={{
            display: 'flex',
            gap: 8,
            marginTop: 16,
            padding: '8px',
            background: 'rgba(0,0,0,0.2)',
            borderRadius: 12,
            border: '1px solid rgba(255,255,255,0.05)',
          }}>
            {[
              { key: 'all', label: isArabic ? `الكل (${videos.length})` : `All (${videos.length})`, color: '#fff' },
              { key: 'intro', label: isArabic ? categoryLabels.intro.labelAr : categoryLabels.intro.labelEn, color: brandCyan },
              { key: 'science', label: isArabic ? categoryLabels.science.labelAr : categoryLabels.science.labelEn, color: brandPurple },
              { key: 'results', label: isArabic ? categoryLabels.results.labelAr : categoryLabels.results.labelEn, color: brandPink },
            ].map((tab) => (
              <button
                key={tab.key}
                className="filter-btn"
                onClick={() => setFilter(tab.key as typeof filter)}
                style={{
                  padding: '10px 18px',
                  borderRadius: 8,
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: 13,
                  fontWeight: 700,
                  background: filter === tab.key
                    ? `${tab.color}20`
                    : 'transparent',
                  color: filter === tab.key ? tab.color : 'rgba(255,255,255,0.5)',
                  borderBottom: filter === tab.key ? `2px solid ${tab.color}` : '2px solid transparent',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Video Grid - Lab Monitors */}
        <div style={{
          marginTop: 24,
          display: 'grid',
          gap: 20,
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        }}>
          {filteredVideos.map((video) => (
            <LabMonitor
              key={video.id}
              video={video}
              isHovered={hoveredId === video.id}
              isArabic={isArabic}
              onHover={setHoveredId}
            />
          ))}
        </div>

        {/* YouTube Channel CTA - Lab Style */}
        <div style={{
          marginTop: 30,
          padding: '24px',
          background: 'linear-gradient(135deg, rgba(255,0,0,0.08), rgba(176,18,112,0.08))',
          borderRadius: 16,
          border: '2px solid rgba(255,0,0,0.15)',
          display: 'flex',
          alignItems: 'center',
          gap: 20,
          flexWrap: 'wrap',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Monitor frame effect */}
          <div style={{
            position: 'absolute',
            inset: 0,
            border: '8px solid rgba(40,40,50,0.5)',
            borderRadius: 14,
            pointerEvents: 'none',
          }} />

          <div style={{
            width: 70,
            height: 70,
            borderRadius: 14,
            background: '#FF0000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 30px rgba(255,0,0,0.3)',
          }}>
            <PlayIcon size={32} color="#fff" />
          </div>
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ fontWeight: 800, fontSize: 17, color: '#fff' }}>
              {isArabic ? 'البث المباشر على YouTube' : 'Live on YouTube'}
            </div>
            <div style={{ ...styles.muted, marginTop: 6 }}>
              {isArabic ? 'المزيد من المحتوى التعليمي والعروض الحية' : 'More educational content and live sessions'}
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
              padding: '14px 28px',
              fontSize: 14,
            }}
          >
            {isArabic ? 'دخول القناة' : 'Visit channel'}
          </a>
        </div>

        <p style={{ ...styles.muted, marginTop: 20, textAlign: 'center', fontSize: 12 }}>
          {isArabic
            ? 'المحتوى المخبري للأغراض التعليمية فقط — استشر المختصين للتقييم الفردي'
            : 'Lab content is for educational purposes only — consult a specialist for an individual evaluation.'}
        </p>
      </div>
    </section>
  );
}
