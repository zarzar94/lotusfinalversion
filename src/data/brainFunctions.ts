import { brandCyan, brandPurple, brandPink } from '../components/styles';

export type BrainFunction = {
  id: string;
  slug: string;
  labelAr: string;
  labelEn: string;
  color: string;
  icon: string;
  content: {
    title: string;
    subtitle: string;
    questions: string[];
    explanation: string;
    benefits: string[];
  };
  position: { x: number; y: number; r: number };
};

export const BRAIN_FUNCTIONS: BrainFunction[] = [
  {
    id: 'auditory',
    slug: 'auditory',
    labelAr: 'المعالجة السمعية',
    labelEn: 'Auditory',
    color: brandCyan,
    icon: '👂',
    position: { x: 160, y: 130, r: 14 },
    content: {
      title: 'Auditory Processing',
      subtitle: 'How we process and interpret sounds',
      questions: [
        'Sometimes the auditory system seems to be out-of-balance, something is "off" but it is difficult to pinpoint exactly what it is.',
        'Sounds may be too loud, even painful, words may sound distorted and difficult to understand, or may seem to be coming so fast so they run together, making it difficult to hear words distinctly.',
        'Background noise in restaurants or other busy places distract and confuse the conversation.',
      ],
      explanation: 'These difficulties interfere with auditory processing and make communication and socialization a challenge. Are you looking for a way to make communication and socialization easier and less stressful? The Berard method of AIT is designed to re-balance, retrain the functions, so the auditory system will become an efficient processor of sound input. Berard AIT provides a specific, novel type of stimulation with frequency, intensity, and the correct duration to stimulate change. Neuroplasticity is the brain\'s natural ability to change itself. Berard AIT re-educates the system to create a smooth and effective route for auditory input.',
      benefits: [
        'Improved sound processing clarity',
        'Better speech comprehension',
        'Reduced sound sensitivity',
        'Enhanced communication skills',
      ],
    },
  },
  {
    id: 'language',
    slug: 'language',
    labelAr: 'تطوير اللغة',
    labelEn: 'Language',
    color: brandPurple,
    icon: '💬',
    position: { x: 270, y: 150, r: 13 },
    content: {
      title: 'Language Development',
      subtitle: 'Building blocks of communication',
      questions: [
        'Is it difficult for you to understand conversation in noisy places?',
        'Have you ever had trouble forming your thoughts into words? Or had the impression that once you\'ve spoken, it\'s not what you really had wanted to say?',
        'Do you know a child with language delays or difficulty communicating?',
        'Perhaps you know someone with speech or articulation problems?',
        'Are you struggling to learn a second language? Or do you want to reduce your accent?',
      ],
      explanation: 'Language delay or difficulties cause frustration, anxiety, behavior challenges, and impacts on social and academic growth. The Berard method of AIT is well documented for its ability to retrain auditory processing. It also specifically stimulates the language centers, thereby improving the ability to develop language, or to learn new languages more easily. Our ability to identify and discriminate sounds must become automatic so that these sounds can become words. Berard AIT automates this process so thoughts can be better organized and be sequenced into expressive language that represents what we really want to say.',
      benefits: [
        'Improved speech clarity',
        'Better language comprehension',
        'Enhanced vocabulary development',
        'Easier second language learning',
      ],
    },
  },
  {
    id: 'balance',
    slug: 'balance',
    labelAr: 'التوازن والتنسيق',
    labelEn: 'Balance',
    color: brandPink,
    icon: '⚖️',
    position: { x: 380, y: 120, r: 12 },
    content: {
      title: 'Balance and Coordination',
      subtitle: 'Physical harmony and motor control',
      questions: [
        'Have you tried to learn to ride a bike, play a sport, or dance, and only experienced frustration?',
        'Have you tried to learn a craft or skill, or write neatly, and feel like a failure?',
        'Are you "all thumbs" or feel like you have two left feet?',
        'Is balance and fear of falling affecting your safety and mobility?',
        'Do you, or someone you know, give up and avoid activities requiring balance and coordination?',
      ],
      explanation: 'Discover Berard AIT, a way to improve balance and coordination so goals can be achieved, or to improve mobility and safety in daily life activities. Balance and coordination require a variety of functions that must be well-integrated and work together. The vestibular system, located within the ear, regulates many balance and motor functions. Berard AIT provides stimulation with specific vibrational input designed to retrain an out-of-balance system. The auditory and visual systems integrate, leading to more efficient function. As body awareness develops, improvement in muscle coordination and sequencing movements makes it easier to achieve the goal. Confidence grows and interest in practicing and participating in activities is no longer a problem. Berard AIT enables dreams of achieving skill in fine and gross motor activities to become a reality.',
      benefits: [
        'Improved motor coordination',
        'Better spatial awareness',
        'Enhanced physical confidence',
        'Reduced fear of movement',
      ],
    },
  },
  {
    id: 'wellbeing',
    slug: 'wellbeing',
    labelAr: 'الرفاهية النفسية',
    labelEn: 'Well Being',
    color: brandCyan,
    icon: '✨',
    position: { x: 440, y: 180, r: 13 },
    content: {
      title: 'Well Being',
      subtitle: 'Overall mental and emotional health',
      questions: [
        'Do you feel discouraged or disappointed in yourself?',
        'Are you not achieving the goals and plans for things that you dream about?',
        'Do you feel it is useless to try something new because you have failed with other similar activities?',
        'Are you lacking motivation because things just seem too difficult to do successfully?',
      ],
      explanation: 'Many individuals report that after completing Berard AIT, they feel more motivated, organized, and more content. It is well documented that the Berard program often improves sensory and auditory processing. Behaviors used to compensate for processing problems are no longer needed. Your body and brain work smoothly together, and new skills are easier to learn. Memory improves and stress decreases. You feel more confident, secure, and positive, as a result of these changes in skills and abilities. You see that you are achieving your goals and are motivated to take on new challenges because you are now finding success.',
      benefits: [
        'Increased motivation',
        'Better emotional regulation',
        'Enhanced self-confidence',
        'Reduced stress and anxiety',
      ],
    },
  },
  {
    id: 'music',
    slug: 'music',
    labelAr: 'إدراك الموسيقى',
    labelEn: 'Music',
    color: brandPurple,
    icon: '🎵',
    position: { x: 450, y: 260, r: 12 },
    content: {
      title: 'Music Perception',
      subtitle: 'The universal language of sound',
      questions: [
        'Music is said to be the universal Language of Mankind, but it doesn\'t come naturally to everyone.',
        'Do you have difficulty in perceiving the differences in musical pitch? Or do you sing "off-key", commonly know as being tone deaf?',
        'Have you struggled to learn to play a musical instrument without much success?',
        'Or do you already speak the universal Language of Mankind and just want to enrich your listening or playing experience?',
      ],
      explanation: 'Berard AIT can improve your ability to perceive the differences in musical pitch more accurately. One of the well-documented results of Berard is the improvement of auditory processing. The same mechanism of auditory processing that improves perception of speech sounds and words, also improves perception of musical notes, allowing for better clarity of sound. Berard AIT leads to an enriched experience with music, both with playing or listening to it.',
      benefits: [
        'Better pitch recognition',
        'Improved musical appreciation',
        'Enhanced instrument learning',
        'Richer listening experience',
      ],
    },
  },
  {
    id: 'memory',
    slug: 'memory',
    labelAr: 'تعزيز الذاكرة',
    labelEn: 'Memory',
    color: brandPink,
    icon: '🧠',
    position: { x: 420, y: 330, r: 14 },
    content: {
      title: 'Memory Enhancement',
      subtitle: 'Storing and recalling information',
      questions: [
        'Everyone forgets sometimes, but do you feel forgetting is beginning to interfere in your life?',
        'Do you forget important events or information?',
        'Do you think of yourself as forgetful? (Or have you been criticized for your forgetfulness)?',
        'Are you becoming frustrated because of your forgetfulness?',
      ],
      explanation: 'The Berard method of AIT can help improve memory. In order to remember something, you must be attentive to the information so it can be processed quickly and be registered clearly in the brain. If you are not attending well, or are distracted easily, you will not be able to register and remember information in a well-organized way. Berard AIT improves attention and concentration, and balances important systems used for processing information, so that they function without conscious effort. As processing improves, it is easier to pay attention and concentrate, which in turn, allows you to store information correctly and easily, and quickly recall it when necessary.',
      benefits: [
        'Improved information retention',
        'Better recall abilities',
        'Enhanced working memory',
        'Reduced forgetfulness',
      ],
    },
  },
  {
    id: 'behavior',
    slug: 'behavior',
    labelAr: 'تنظيم السلوك',
    labelEn: 'Behavior',
    color: brandCyan,
    icon: '🎯',
    position: { x: 320, y: 350, r: 13 },
    content: {
      title: 'Behavior Regulation',
      subtitle: 'Managing responses and reactions',
      questions: [
        'Negative behavior sometimes seems to come from "out of the blue" with no apparent cause.',
        'Sudden aggression, lack of cooperation, emotional meltdowns, withdrawal, and anxiety, all create frustration, confusion, and stress, for both the individual experiencing the outbursts and those involved in the situation.',
      ],
      explanation: 'Are you looking for a way to resolve challenging behavior? Getting to the root cause of challenging behavior can result in better, long-term success. In many cases, negative behavior is a result of compensating for faulty sensory experiences, or weaknesses in processing auditory input. When sensory modulation and auditory processing are functioning well, it is easier to adjust to the changes and demands of life experiences. Berard AIT is a process that restores the ability to modulate sensory input and balances the auditory system. When these brain/body systems are in balance, we can better manage the changes and interactions that occur in our daily lives.',
      benefits: [
        'Better emotional control',
        'Reduced outbursts',
        'Improved cooperation',
        'Enhanced self-regulation',
      ],
    },
  },
  {
    id: 'learning',
    slug: 'learning',
    labelAr: 'تعزيز التعلم',
    labelEn: 'Learning',
    color: brandPurple,
    icon: '📚',
    position: { x: 220, y: 340, r: 13 },
    content: {
      title: 'Learning Enhancement',
      subtitle: 'Acquiring and retaining knowledge',
      questions: [
        'Have you always had some difficulty learning, either in school or on the job?',
        'Do you find oral or written explanations and directions hard to follow?',
        'Have you always felt not "smart enough" to learn?',
        'Perhaps you know a child struggling in school?',
      ],
      explanation: 'Berard AIT retrains the brain\'s processing capabilities and makes learning easier. Learning is not a question of intelligence, but simply the process of acquiring new, or modifying existing, knowledge, behaviors, and skills. When auditory and sensory processing problems impact this process, learning is difficult. Berard AIT rewires the processing system; the brain and body become well-integrated and information can be learned and retained in an organized way.',
      benefits: [
        'Improved comprehension',
        'Better information processing',
        'Enhanced academic performance',
        'Easier skill acquisition',
      ],
    },
  },
  {
    id: 'sensory',
    slug: 'sensory',
    labelAr: 'المعالجة الحسية',
    labelEn: 'Sensory',
    color: brandPink,
    icon: '🌟',
    position: { x: 150, y: 280, r: 12 },
    content: {
      title: 'Sensory Processing',
      subtitle: 'How we interpret sensory input',
      questions: [
        'For some people, the physical or internal environment can be too intense, overwhelming, frightening, or confusing, due to too much stimulation.',
        'The ability to process input and adjust behaviors and emotions appropriately is disrupted.',
        'Acting out with aggression as a defense, or withdrawing and clinging to someone for comfort and protection, may be an adaptive response to this dysfunction.',
      ],
      explanation: 'Attention becomes focused on being constantly "on guard" in preparation for the next stressful experience that may occur. Sometimes, the system becomes so overwhelmed that it may shutdown and become closed off to input. Sensory stimulation may not seem to penetrate and register sufficiently to prompt a response. Berard AIT is an effective way to reorganize the sensory system. This unique program retrains the system, using a specific, novel type of stimulation with frequency, intensity, and the correct duration to stimulate change. Sensory input can then be correctly modulated and integrated in a natural way. It becomes possible to respond to one\'s environment with appropriate behaviors and emotions. The meltdowns, aggression, and withdrawals resolve.',
      benefits: [
        'Better sensory integration',
        'Reduced sensory overload',
        'Improved environmental adaptation',
        'Calmer responses to stimuli',
      ],
    },
  },
  {
    id: 'attention',
    slug: 'attention',
    labelAr: 'الانتباه والتركيز',
    labelEn: 'Attention',
    color: brandCyan,
    icon: '🎯',
    position: { x: 180, y: 200, r: 14 },
    content: {
      title: 'Attention and Concentration',
      subtitle: 'Focusing on what matters',
      questions: [
        'Is it hard for you to pay attention, or to carefully observe and listen to something important?',
        'Can you concentrate on the task without your attention drifting to unrelated topics?',
        'Do other activities, visual objects, or noise, tug at your attention?',
        'Do you get tired and bored, and often fidget?',
      ],
      explanation: 'Berard AIT is a unique way to increase attention and concentration on a task. The Berard method of AIT retrains a body/brain system that is not operating at peak performance. Rebalancing the auditory system, and integrating that system with the visual system, makes it easier to focus and process the information that\'s most important. The appropriate stimulation provided by Berard AIT enables the inefficient system to create better connections. Distractions no longer compete for attention. Effective processing of information reduces overload, fatigue, and restlessness. Attention and concentration become possible.',
      benefits: [
        'Improved focus duration',
        'Better task completion',
        'Reduced distractibility',
        'Enhanced concentration',
      ],
    },
  },
];

export const getBrainFunctionBySlug = (slug: string): BrainFunction | undefined => {
  return BRAIN_FUNCTIONS.find((bf) => bf.slug === slug);
};
