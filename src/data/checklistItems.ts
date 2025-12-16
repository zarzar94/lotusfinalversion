export type ChecklistItem = {
  id: string;
  ar: string;
  en?: string;
};

export type ChecklistCategory = {
  title: string;
  note?: string;
  items: ChecklistItem[];
};

/**
 * Website checklist extracted from the provided PDF "Check list (2).pdf".
 * IMPORTANT: This checklist is a non-diagnostic indicator list.
 */
export const checklistCategories: ChecklistCategory[] = [
  {
    title: 'صعوبات أكاديمية ولغوية',
    note: 'موصى به بشكل متكرر لدى كثير من الحالات.',
    items: [
      { id: 'reading', ar: 'صعوبات القراءة', en: 'Reading difficulties' },
      { id: 'writing', ar: 'صعوبات الكتابة', en: 'Writing difficulties' },
      { id: 'spelling', ar: 'صعوبات التهجئة', en: 'Spelling difficulties' },
      { id: 'language', ar: 'صعوبات اللغة', en: 'Language difficulties' },
      { id: 'speech', ar: 'صعوبات الكلام / النطق', en: 'Speech difficulties' },
      { id: 'stammering', ar: 'التأتأة', en: 'Stammering' },
      { id: 'lack_speech', ar: 'ضعف / نقص الكلام', en: 'Lack of speech' },
    ],
  },
  {
    title: 'مؤشرات سمعية',
    items: [
      { id: 'sound_recognition', ar: 'ضعف تمييز الأصوات', en: 'Poor sound recognition' },
      { id: 'hyperacusis', ar: 'فرط حساسية السمع', en: 'Hyper-sensitive hearing' },
      { id: 'painful_hearing', ar: 'السمع المؤلم', en: 'Painful hearing' },
      { id: 'tinnitus', ar: 'طنين الأذن', en: 'Tinnitus' },
    ],
  },
  {
    title: 'تعلم وتركيز ووظائف تنفيذية',
    items: [
      { id: 'learning', ar: 'صعوبات التعلم', en: 'Learning difficulties' },
      { id: 'memory', ar: 'ضعف الذاكرة', en: 'Poor memory' },
      { id: 'concentration', ar: 'ضعف التركيز', en: 'Poor concentration' },
      { id: 'organisation', ar: 'ضعف التنظيم', en: 'Poor organisation' },
      { id: 'ideas', ar: 'ضعف تنظيم الأفكار', en: 'Poor marshalling of ideas' },
    ],
  },
  {
    title: 'توازن وحركة',
    items: [
      { id: 'balance', ar: 'مشاكل التوازن والتنسيق', en: 'Balance & coordination problems' },
      { id: 'motor', ar: 'مشاكل حركية', en: 'Motor problems' },
      { id: 'clumsiness', ar: 'ضعف التناسق / العثرات المتكررة', en: 'Clumsiness' },
    ],
  },
  {
    title: 'سلوك ومزاج وصحة عامة',
    note: 'قد تظهر التحسينات كمنتج ثانوي لدى بعض الحالات (وليست ضماناً).',
    items: [
      { id: 'behaviour', ar: 'سلوكيات صعبة', en: 'Challenging behaviour' },
      { id: 'hyperactivity', ar: 'فرط النشاط', en: 'Hyperactivity' },
      { id: 'depression', ar: 'الاكتئاب', en: 'Depression' },
      { id: 'anxiety', ar: 'القلق', en: 'Anxiety' },
      { id: 'panic', ar: 'نوبات الهلع', en: 'Panic attacks' },
      { id: 'fatigue', ar: 'التعب والإجهاد والتوتر', en: 'Fatigue / stress' },
      { id: 'eating', ar: 'اضطرابات الأكل', en: 'Eating disorders' },
      { id: 'allergies', ar: 'الحساسية', en: 'Allergies' },
    ],
  },
  {
    title: 'تشخيصات/حالات شائعة مرتبطة بالسمع/التعلم',
    note: 'هذه أمثلة شائعة وردت في القائمة — التشخيص الطبي يتم فقط عبر مختص.',
    items: [
      { id: 'dyslexia', ar: 'عسر القراءة', en: 'Dyslexia' },
      { id: 'dyspraxia', ar: 'عسر الأداء الحركي', en: 'Dyspraxia' },
      { id: 'asperger', ar: 'متلازمة أسبرجر', en: 'Asperger syndrome' },
      { id: 'tourette', ar: 'متلازمة توريت', en: 'Tourette syndrome' },
      { id: 'autism', ar: 'اضطرابات طيف التوحد', en: 'Autism spectrum disorders' },
      { id: 'cerebral_palsy', ar: 'الشلل الدماغي', en: 'Cerebral palsy' },
      { id: 'add', ar: 'اضطراب نقص الانتباه (ADD)', en: 'Attention deficit disorder (ADD)' },
      { id: 'adhd', ar: 'اضطراب نقص الانتباه وفرط النشاط (ADHD)', en: 'ADHD' },
      { id: 'capd', ar: 'اضطراب المعالجة السمعية المركزية (CAPD)', en: 'Central auditory processing disorder (CAPD)' },
      { id: 'sid', ar: 'خلل التكامل الحسي', en: 'Sensory integration dysfunction' },
      { id: 'delay', ar: 'اضطرابات التأخر النمائي', en: 'Neuro-developmental delay' },
      { id: 'ocd', ar: 'اضطرابات الوسواس القهري', en: 'Obsessive compulsive disorders' },
    ],
  },
];

// Flattened list (useful for exports)
export const checklistItems: ChecklistItem[] = checklistCategories.flatMap((c) => c.items);
