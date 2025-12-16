import { lazy, Suspense, useEffect } from 'react';

import Header from './components/Header';
import { styles, brandCyan, brandPink, brandPurpleDark } from './components/styles';
import BackgroundFX from './components/BackgroundFX';
import ProgramOverview from './components/ProgramOverview';
import ResultsSection from './components/ResultsSection';
import ComparisonSection from './components/ComparisonSection';
import SchoolPartnershipSection from './components/SchoolPartnershipSection';
import Footer from './components/Footer';
import WhatsAppFab from './components/WhatsAppFab';
import ErrorBoundary from './components/ErrorBoundary';

const SlideViewer = lazy(() => import('./components/SlideViewer'));
const Checklist = lazy(() => import('./components/Checklist'));
const GameSection = lazy(() => import('./components/GameSection'));
const ContactForm = lazy(() => import('./components/ContactForm'));

function App() {
  useEffect(() => {
    const scrollToHash = () => {
      const hash = window.location.hash;
      if (!hash) return;
      const id = hash.replace('#', '');
      const el = document.getElementById(id);
      if (!el) return;
      // Delay helps when loading directly into a section (React mounts after initial HTML parse)
      window.setTimeout(() => {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
    };

    scrollToHash();
    window.addEventListener('hashchange', scrollToHash);
    return () => window.removeEventListener('hashchange', scrollToHash);
  }, []);

  return (
    <ErrorBoundary>
    <div style={styles.page}>
      <BackgroundFX />
      <Header />

      <main style={styles.container}>
        {/* HERO */}
        <section id="about" style={styles.sectionCard}>
          <div style={styles.sectionHeader}>
            <div style={styles.sectionHeaderRow}>
              <h2 style={styles.h2}>Berard AIT Sound Lab — أبوظبي</h2>
              <span style={{ ...styles.chip, background: 'rgba(143,211,204,0.12)', borderColor: 'rgba(143,211,204,0.25)' }}>
                عربي أولاً
              </span>
            </div>
            <p style={styles.lead}>
              تجربة تفاعلية حديثة تجمع بين <b style={{ color: brandCyan }}>العلم</b> و<b style={{ color: brandPink }}>الموسيقى</b> لفهم تحديات
              التركيز السمعي داخل الصف والبيت — مع محتوى من العرض التقديمي، ألعاب سمعية، وقائمة تحقق للأهل والمدارس.
            </p>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 14 }}>
              <a href="#games" style={{ ...styles.primaryBtn, textDecoration: 'none', background: `linear-gradient(135deg, ${brandPurpleDark}, ${brandPink})` }}>
                ابدأ اللعبة (Hook)
              </a>
              <a href="#checklist" style={{ ...styles.ghostBtn, textDecoration: 'none', borderColor: 'rgba(143,211,204,0.25)' }}>
                افتح قائمة التحقق
              </a>
              <a href="#schools" style={{ ...styles.ghostBtn, textDecoration: 'none', borderColor: 'rgba(175,132,186,0.25)' }}>
                شراكة مدارس / جامعات
              </a>
            </div>

            <div style={{ marginTop: 14, ...styles.section, marginBottom: 0 }}>
              <div style={{ fontWeight: 900, color: brandPurpleDark }}>مهم (امتثال/سلامة)</div>
              <p style={{ ...styles.muted, marginTop: 6 }}>
                المحتوى والألعاب هنا توعوية وغير تشخيصية. إذا كانت لديك مخاوف سريرية، يرجى التواصل مع مختص مؤهل.
              </p>
            </div>
          </div>
        </section>

        <ProgramOverview />
        <ResultsSection />

        <Suspense fallback={<div style={styles.sectionCard}>جارٍ تحميل عارض الشرائح…</div>}>
          <SlideViewer />
        </Suspense>

        <Suspense fallback={<div style={styles.sectionCard}>جارٍ تحميل قائمة التحقق…</div>}>
          <Checklist />
        </Suspense>

        <Suspense fallback={<div style={styles.sectionCard}>جارٍ تحميل الألعاب…</div>}>
          <GameSection />
        </Suspense>

        <ComparisonSection />
        <SchoolPartnershipSection />

        <Suspense fallback={<div style={styles.sectionCard}>جارٍ تحميل نموذج التواصل…</div>}>
          <ContactForm />
        </Suspense>

        <Footer />
      </main>

      <WhatsAppFab />
    </div>
    </ErrorBoundary>
  );
}

export default App;
