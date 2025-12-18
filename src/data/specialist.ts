/**
 * Specialist Profile Data
 * Lead practitioner information for Lotus × Bérard AIT
 */

export interface Credential {
  id: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  year?: string;
  icon: string;
  color: string;
}

export interface Specialist {
  id: string;
  nameAr: string;
  nameEn: string;
  titleAr: string;
  titleEn: string;
  certificationId: string;
  image: string;
  credentials: Credential[];
  bioAr: string;
  bioEn: string;
}

export const SPECIALIST: Specialist = {
  id: 'mohamed-kamal',
  nameAr: 'محمد كمال عرفة',
  nameEn: 'Mohamed Kamal Arafa',
  titleAr: 'أخصائي التخاطب',
  titleEn: 'Speech & Language Specialist',
  certificationId: 'PA21213',
  image: '/images/specialist-profile.jpg',
  credentials: [
    {
      id: 'berard-cert',
      titleAr: 'ممارس معتمد لطريقة بيرارد',
      titleEn: 'Certified Bérard AIT Practitioner',
      descriptionAr: 'معتمد من لندن',
      descriptionEn: 'Certified in London',
      year: '2012',
      icon: '🎓',
      color: '#8FD3CC',
    },
    {
      id: 'autism-society',
      titleAr: 'عضو فريق التشخيص',
      titleEn: 'Diagnostic Team Member',
      descriptionAr: 'الجمعية السعودية للتوحد سابقاً',
      descriptionEn: 'Saudi Autism Society (Former)',
      icon: '🧩',
      color: '#AF84BA',
    },
    {
      id: 'ministry-supervisor',
      titleAr: 'مشرف برامج التخاطب',
      titleEn: 'Speech Programs Supervisor',
      descriptionAr: 'وزارة الشؤون الاجتماعية السعودية سابقاً',
      descriptionEn: 'Saudi Ministry of Social Affairs (Former)',
      icon: '📋',
      color: '#B01270',
    },
    {
      id: 'phonetic-studies',
      titleAr: 'دراسات صوتية',
      titleEn: 'Phonetic Studies',
      descriptionAr: 'جامعة الإسكندرية',
      descriptionEn: 'Alexandria University',
      year: '1987',
      icon: '🎧',
      color: '#22c55e',
    },
  ],
  bioAr: `محمد كمال عرفة هو أخصائي تخاطب ذو خبرة تمتد لأكثر من 35 عاماً في مجال اضطرابات التواصل والمعالجة السمعية. حاصل على شهادة ممارس معتمد في طريقة Bérard AIT من لندن، وقد عمل مع مئات الأسر في المملكة العربية السعودية والإمارات.

يتميز بخبرته العميقة في تشخيص وعلاج اضطرابات المعالجة السمعية، وقد ساهم في تأسيس برامج التخاطب في عدة مؤسسات حكومية. يؤمن بأن كل طفل يستحق فرصة للتواصل الفعال والتعلم الأمثل.`,
  bioEn: `Mohamed Kamal Arafa is a speech and language specialist with over 35 years of experience in communication disorders and auditory processing. He is a certified Bérard AIT practitioner trained in London and has worked with hundreds of families across Saudi Arabia and the UAE.

He brings deep expertise in diagnosing and treating auditory processing disorders and has helped establish speech therapy programs in several government institutions. He believes every child deserves the opportunity for effective communication and optimal learning.`,
};

export const CENTRE_INFO = {
  nameAr: 'مركز لوتس الشامل',
  nameEn: 'Lotus Holistic Centre',
  taglineAr: 'رعاية صحية شاملة بدون أدوية',
  taglineEn: 'Drugless Holistic Healthcare',
  foundedYear: '1994',
  locationAr: 'مدينة خليفة أ والخالدية، أبوظبي، الإمارات',
  locationEn: 'Khalifa City A & Al Khalidiya, Abu Dhabi, UAE',
  descriptionAr: `مركز لوتس الشامل هو مركز طب شامل فريد يقع في مدينة خليفة أ والخالدية بأبوظبي. يعمل المركز منذ عام 1994 من ستة مباني واسعة ومجهزة بشكل ممتاز مع فريق دولي من المتخصصين في الرعاية الصحية.

نؤمن بالرعاية الصحية بدون أدوية من خلال العلاجات غير الجراحية. مهمتنا تركز على تعزيز الرعاية الذاتية للمريض والوعي الصحي والتثقيف حول تحسينات نمط الحياة والحفاظ على العافية.

نقدم برنامج Bérard AIT للتكامل السمعي كأحد خدماتنا المتخصصة، تحت إشراف ممارسين معتمدين دولياً.`,
  descriptionEn: `Lotus Holistic Centre is a unique holistic medicine center located in Khalifa City A and Al Khalidiya, Abu Dhabi. Operating since 1994, the facility spans six spacious, well-appointed buildings with an international team of healthcare professionals.

We emphasize drugless healthcare through non-invasive treatments. Our mission focuses on promoting patient self-care, health awareness, and education about lifestyle improvements and wellness maintenance.

We offer the Bérard AIT auditory integration program as one of our specialized services, supervised by internationally certified practitioners.`,
  services: [
    {
      id: 'berard-ait',
      nameAr: 'برنامج Bérard AIT',
      nameEn: 'Bérard AIT Program',
      icon: '🎧',
      color: '#8FD3CC',
    },
    {
      id: 'speech-therapy',
      nameAr: 'علاج التخاطب',
      nameEn: 'Speech Therapy',
      icon: '🗣️',
      color: '#AF84BA',
    },
    {
      id: 'occupational-therapy',
      nameAr: 'العلاج الوظيفي',
      nameEn: 'Occupational Therapy',
      icon: '🤲',
      color: '#B01270',
    },
    {
      id: 'psychological-support',
      nameAr: 'الدعم النفسي',
      nameEn: 'Psychological Support',
      icon: '💚',
      color: '#22c55e',
    },
  ],
  values: [
    {
      id: 'expertise',
      titleAr: 'الخبرة المتخصصة',
      titleEn: 'Specialized Expertise',
      descAr: 'فريق من المتخصصين المعتمدين دولياً',
      descEn: 'Team of internationally certified specialists',
      icon: '🎓',
    },
    {
      id: 'personalized',
      titleAr: 'رعاية شخصية',
      titleEn: 'Personalized Care',
      descAr: 'خطط علاجية مصممة لاحتياجات كل فرد',
      descEn: 'Treatment plans designed for individual needs',
      icon: '💎',
    },
    {
      id: 'evidence',
      titleAr: 'مبني على الأدلة',
      titleEn: 'Evidence-Based',
      descAr: 'أساليب علاجية مدعومة بالأبحاث العلمية',
      descEn: 'Treatment methods backed by scientific research',
      icon: '📊',
    },
    {
      id: 'family',
      titleAr: 'شراكة مع الأسرة',
      titleEn: 'Family Partnership',
      descAr: 'نعمل جنباً إلى جنب مع الأسر لتحقيق النتائج',
      descEn: 'Working alongside families to achieve results',
      icon: '👨‍👩‍👧‍👦',
    },
  ],
  linkedin: 'https://www.linkedin.com/company/lotus-holistic-centre/',
} as const;

export type CentreInfo = typeof CENTRE_INFO;
