import { Job, Application, Post, Conversation, NotificationItem, SkillItem, ExperienceItem, EducationItem, CVFile, Company, JobApplicant } from '../types';

export const initialJobs: Job[] = [
  {
    id: 'job-1',
    title: 'Senior Frontend Developer',
    company: 'TechVision Corp',
    location: 'الرياض، السعودية (عن بُعد)',
    logo: '🚀',
    type: 'دوام كامل',
    domain: 'تطوير البرمجيات',
    salary: '$4,500 - $6,000',
    postedTime: 'منذ ساعتين',
    applicantsCount: 124,
    skills: ['React', 'TypeScript', 'Tailwind CSS', 'Next.js'],
    description: 'نبحث عن مطور واجهات أمامية أول للانضمام لفريقنا الهندسي وبناء تطبيقات تفاعلية فائقة السرعة والأداء باستخدام React و TypeScript.',
    requirements: [
      'خبرة لا تقل عن 5 سنوات في تطوير الواجهات الأمامية باستخدام React و Next.js',
      'إتقان عميق لـ TypeScript و Tailwind CSS وإدارة الحالة المتقدمة',
      'معرفة ممتازة بأفضل ممارسات الأداء وسهولة الوصول (a11y) و SEO',
      'القدرة على كتابة اختبارات آلية واختبارات تكاملية'
    ],
    isVerified: true,
    isSaved: true,
    applied: true,
  },
  {
    id: 'job-2',
    title: 'UI/UX Designer',
    company: 'CreativeHQ',
    location: 'دبي، الإمارات (هجين)',
    logo: '🎨',
    type: 'دوام كامل',
    domain: 'التصميم (UI/UX)',
    salary: '$3,800 - $5,200',
    postedTime: 'منذ 5 ساعات',
    applicantsCount: 89,
    skills: ['Figma', 'Prototyping', 'Design Systems', 'User Research'],
    description: 'مطلوب مصمم واجهات وتجربة مستخدم مبدع لتصميم منصات رقمية وحلول تجارب سهلة الاستخدام تعتمد على دراسة سلوك المستخدم وأنظمة التصميم الحديثة.',
    requirements: [
      'خبرة 3+ سنوات في تصميم منتجات رقمية (Web & Mobile)',
      'إتقان أدوات Figma وتصميم النماذج التفاعلية وأنظمة المكونات Design Systems',
      'فهم عميق لبحوث المستخدم، واختبارات قابلية الاستخدام Usability Testing'
    ],
    isVerified: true,
    isSaved: false,
    applied: false,
  },
  {
    id: 'job-3',
    title: 'DevOps & Cloud Engineer',
    company: 'CloudNative Inc',
    location: 'الرياض، السعودية',
    logo: '☁️',
    type: 'دوام كامل',
    domain: 'تطوير البرمجيات',
    salary: '$3,500 - $5,000',
    postedTime: 'منذ يوم',
    applicantsCount: 42,
    skills: ['Docker', 'Kubernetes', 'AWS', 'CI/CD'],
    description: 'نبحث عن مهندس DevOps محترف لإدارة البنية التحتية السحابية وأتمتة خطوط النشر الآلي وتوفير أعلى معايير الأمان والاستقرار.',
    requirements: [
      'خبرة عملية مع خدمات AWS الأساسية و Kubernetes',
      'إتقان بناء وتطوير أنابيب CI/CD باستخدام GitHub Actions',
      'خبرة في المراقبة والتحليل عبر Prometheus و Grafana'
    ],
    isVerified: true,
    isSaved: false,
    applied: true,
  },
  {
    id: 'job-4',
    title: 'Mobile App Developer (Flutter)',
    company: 'AppMasters',
    location: 'عن بُعد (عالمي)',
    logo: '📱',
    type: 'عمل حر',
    domain: 'تطوير البرمجيات',
    salary: '$35 / ساعة',
    postedTime: 'منذ يومين',
    applicantsCount: 31,
    skills: ['Flutter', 'Dart', 'Firebase', 'State Management'],
    description: 'مشروع لتطوير تطبيق تجارة إلكترونية متعدد المنصات (iOS & Android) بأداء عالي وميزات تفاعلية متقدمة.',
    requirements: [
      'نشر تطبيقين على الأقل في App Store و Google Play',
      'خبرة في إدارة الحالة عبر Bloc أو Riverpod',
      'معرفة عميقة بالربط مع RESTful APIs وقواعد بيانات Firebase'
    ],
    isVerified: false,
    isSaved: true,
    applied: false,
  },
  {
    id: 'job-5',
    title: 'Full Stack Web Developer',
    company: 'StartupHub',
    location: 'القاهرة، مصر (هجين)',
    logo: '🚀',
    type: 'دوام كامل',
    domain: 'تطوير البرمجيات',
    salary: '$2,200 - $3,500',
    postedTime: 'منذ 3 أيام',
    applicantsCount: 167,
    skills: ['Node.js', 'React', 'PostgreSQL', 'Tailwind'],
    description: 'انضم لبيئة عمل ديناميكية وسريعة النمو لبناء وتوسيع تطبيقات SaaS تخدم آلاف المستخدمين اليوميين.',
    requirements: [
      'خبرة عملية في تطوير تطبيقات الويب من البداية للنهاية',
      'إجادة تصميم قواعد بيانات PostgreSQL وبناء واجهات Express / Fastify'
    ],
    isVerified: true,
    isSaved: false,
    applied: true,
  },
  {
    id: 'job-6',
    title: 'Digital Marketing Specialist',
    company: 'GrowthMinds',
    location: 'دبي، الإمارات',
    logo: '📢',
    type: 'دوام كامل',
    domain: 'التسويق الرقمي',
    salary: '$3,000 - $4,200',
    postedTime: 'منذ 4 أيام',
    applicantsCount: 76,
    skills: ['SEO', 'Google Ads', 'Content Strategy', 'Social Media'],
    description: 'مطلوب متخصص تسويق رقمي لقيادة حملات الاستحواذ ونمو العلامة التجارية وتحسين العائد على الإنفاق الإعلاني.',
    requirements: [
      'سجل حافل في تحسين محركات البحث وحملات الدفع لكل نقرة',
      'قدرة تحليلية عالية باستخدام Google Analytics 4'
    ],
    isVerified: true,
    isSaved: false,
    applied: false,
  },
  {
    id: 'job-7',
    title: 'Data Scientist & AI Analyst',
    company: 'InsightData Labs',
    location: 'عمّان، الأردن (عن بُعد)',
    logo: '📊',
    type: 'دوام كامل',
    domain: 'تطوير البرمجيات',
    salary: '$4,000 - $5,500',
    postedTime: 'منذ 5 أيام',
    applicantsCount: 58,
    skills: ['Python', 'Machine Learning', 'SQL', 'Data Viz'],
    description: 'تطوير نماذج ذكاء اصطناعي وتحليل البيانات الضخمة لتقديم رؤى دقيقة تساعد في اتخاذ القرارات الاستراتيجية.',
    requirements: [
      'خبرة في مكتبات Pandas, NumPy, Scikit-learn, PyTorch',
      'مهارات متقدمة في استخراج واستعلام البيانات المعقدة'
    ],
    isVerified: true,
    isSaved: false,
    applied: false,
  },
  {
    id: 'job-8',
    title: 'HR Talent Acquisition Specialist',
    company: 'TalentPeak',
    location: 'الرياض، السعودية',
    logo: '👥',
    type: 'دوام كامل',
    domain: 'الموارد البشرية',
    salary: '$2,800 - $3,600',
    postedTime: 'منذ أسبوع',
    applicantsCount: 49,
    skills: ['Recruitment', 'Talent Sourcing', 'Interviewing', 'HRIS'],
    description: 'استقطاب وتوظيف أفضل الكفاءات التقنية والتنفيذية للشركات الناشئة في منطقة الخليج العربي.',
    requirements: [
      'خبرة سابقة في استقطاب المواهب في قطاع التقنية',
      'مهارات تواصل واستقطاب رفيعة المستوى'
    ],
    isVerified: true,
    isSaved: false,
    applied: false,
  }
];

export const initialApplications: Application[] = [
  {
    id: 'app-1',
    jobId: 'job-1',
    jobTitle: 'Senior Frontend Developer',
    company: 'TechVision Corp',
    logo: '🚀',
    applyDate: '25 يوليو 2026',
    status: 'المقابلة',
    currentStepIndex: 3,
    interviewDate: '10 أغسطس 2026 - الساعة 01:00 ظهراً',
    interviewNote: 'تمت جدولة المقابلة التقنية عبر Google Meet. يرجى الاستعداد لمناقشة خبرتك في هندسة وتطبيقات React واسعة النطاق.',
    resumeFileName: 'ahmed_rashid_cv_2026.pdf',
    timeline: [
      { title: 'تم تقديم الطلب', date: '25 يوليو 2026, 10:30 صباحاً', completed: true, note: 'تم إرفاق السيرة الذاتية ورسالة التغطية بنجاح.' },
      { title: 'تمت مراجعة الطلب', date: '28 يوليو 2026, 02:15 مساءً', completed: true, note: 'قام فريق التوظيف بمراجعة ملفك الشخصي.' },
      { title: 'تم الاختصار (Shortlisted)', date: '2 أغسطس 2026, 11:00 صباحاً', completed: true, note: 'تم اختيار ملفك ضمن قائمة المرشحين المؤهلين للمرحلة التالية.' },
      { title: 'المقابلة التقنية', date: '10 أغسطس 2026, 01:00 مساءً', completed: false, active: true, note: 'مقابلة مع مدير الهندسة التقنية عبر رابط الاجتماع الافتراضي.' },
      { title: 'العرض الوظيفي', date: 'قريباً', completed: false },
      { title: 'التوظيف النهائي', date: 'قريباً', completed: false }
    ]
  },
  {
    id: 'app-2',
    jobId: 'job-3',
    jobTitle: 'DevOps & Cloud Engineer',
    company: 'CloudNative Inc',
    logo: '☁️',
    applyDate: '1 أغسطس 2026',
    status: 'الاختصار',
    currentStepIndex: 2,
    resumeFileName: 'ahmed_rashid_cv_2026.pdf',
    timeline: [
      { title: 'تم تقديم الطلب', date: '1 أغسطس 2026, 09:10 صباحاً', completed: true },
      { title: 'تمت مراجعة الطلب', date: '3 أغسطس 2026, 04:20 مساءً', completed: true },
      { title: 'تم الاختصار في القائمة', date: '5 أغسطس 2026, 01:00 مساءً', completed: false, active: true, note: 'الملف قيد المراجعة النهائية من قائد الفريق السحابي.' },
      { title: 'المقابلة', date: 'بانتظار التحديد', completed: false },
      { title: 'العرض', date: 'قريباً', completed: false },
      { title: 'التوظيف', date: 'قريباً', completed: false }
    ]
  },
  {
    id: 'app-3',
    jobId: 'job-5',
    jobTitle: 'Full Stack Web Developer',
    company: 'StartupHub',
    logo: '🏢',
    applyDate: '15 يونيو 2026',
    status: 'مرفوض',
    currentStepIndex: 2,
    resumeFileName: 'ahmed_rashid_cv_2026.pdf',
    timeline: [
      { title: 'تم تقديم الطلب', date: '15 يونيو 2026', completed: true },
      { title: 'تمت المراجعة', date: '18 يونيو 2026', completed: true },
      { title: 'تم إنهاء الإجراءات', date: '22 يونيو 2026', completed: true, note: 'شكراً لاهتمامك، تم استكمال العدد المطلوب لهذه الفرصة ونتمنى لك التوفيق في فرص قادمة.' }
    ]
  }
];

export const initialPosts: Post[] = [
  {
    id: 'post-1',
    authorName: 'سارة خليل',
    authorHeadline: 'Senior React Developer | UI/UX Enthusiast',
    authorAvatar: 'سخ',
    avatarColor: 'bg-indigo-600',
    timeAgo: 'منذ ساعتين',
    content: 'سعيدة جداً بمشاركة مشروعي الأخير الذي قمت ببنائه باستخدام React و D3.js! قمنا بتحويل لوحة تحكم البيانات المعقدة إلى تجربة تفاعلية سلسة بألوان هادئة وأداء فائق. تجربة المستخدم تبدأ دائماً من البساطة والوضوح.',
    skills: ['React', 'D3.js', 'Tailwind CSS', 'Framer Motion'],
    likes: 34,
    comments: 8,
    isLiked: false,
    category: 'إنجاز'
  },
  {
    id: 'post-2',
    authorName: 'عمر ناصر',
    authorHeadline: 'DevOps Engineer @ CloudTech',
    authorAvatar: 'عن',
    avatarColor: 'bg-sky-600',
    timeAgo: 'منذ 5 ساعات',
    content: 'فخور بحصولي على شهادة AWS Certified Solutions Architect! رحلة شيقة من التعلم والممارسة العملية. نصيحتي لكل مطور برمجيات: لا تهمل فهم أساسيات الـ Cloud والنشر التلقائي، فهي تصنع فارقاً كبيراً في قيمتك بالسوق.',
    skills: ['AWS', 'Cloud Computing', 'DevOps', 'Docker'],
    likes: 142,
    comments: 23,
    isLiked: true,
    category: 'عرض مهارات'
  },
  {
    id: 'post-3',
    authorName: 'لينا حداد',
    authorHeadline: 'Lead Product Designer',
    authorAvatar: 'لح',
    avatarColor: 'bg-blue-600',
    timeAgo: 'منذ 8 ساعات',
    content: 'سؤال لزملائي المطورين والمصممين: هل تفضلون الاعتماد على الأنماط البصرية الفاتحة (الأبيض والأزرق) للتطبيقات الإنتاجية ولوحات التحكم، أم أنكم دائماً في صف الوضع الليلي؟ دراساتنا الأخيرة أظهرت أن 68% من المحترفين يفضلون الأبيض الصافي أثناء ساعات العمل للتركيز العالي.',
    skills: ['UI/UX', 'Product Design', 'User Research'],
    likes: 56,
    comments: 41,
    isLiked: false,
    category: 'سؤال'
  }
];

export const initialConversations: Conversation[] = [
  {
    id: 'conv-1',
    companyName: 'TechVision Corp',
    companyLogo: '🚀',
    lastMessage: 'رائع! نود جدولة مقابلة الأسبوع المقبل لمناقشة التفاصيل.',
    lastMessageTime: 'منذ 5 دقائق',
    unreadCount: 2,
    isOnline: true,
    jobTitle: 'Senior Frontend Developer',
    messages: [
      { id: 'm-1', sender: 'company', text: 'مرحباً أحمد! راجعنا طلبك وسيرتك الذاتية لمنصب Senior Frontend Developer وأعجبنا جداً تنوع مشاريعك.', time: '10:30 ص' },
      { id: 'm-2', sender: 'user', text: 'أهلاً بك! شكراً جزيلاً لتواصلكم الكريم، يسعدني ويشرفني ذلك.', time: '10:35 ص' },
      { id: 'm-3', sender: 'company', text: 'ملف أعمالك مثير للإعجاب. هل يمكنك إخبارنا بإيجاز عن تجربتك مع معمارية تطبيقات React واسعة النطاق؟', time: '10:40 ص' },
      { id: 'm-4', sender: 'user', text: 'بالتأكيد! في وظيفتي السابقة قمت بقيادة إعادة بناء بنية الواجهة الأمامية لنظام يخدم أكثر من 500 ألف مستخدم نشط، مع تقسيم المكونات وتحسين زمن التحميل بنسبة 45%.', time: '10:45 ص' },
      {
        id: 'm-5',
        sender: 'company',
        time: '10:50 ص',
        isOffer: true,
        offerDetails: {
          jobTitle: 'Senior Frontend Developer',
          salary: '$5,500 شهرياً (صافي)',
          startDate: '1 أكتوبر 2026',
          accepted: false,
          declined: false
        }
      },
      { id: 'm-6', sender: 'company', text: 'رائع! نود جدولة مقابلة الأسبوع المقبل لمناقشة التفاصيل والعرض الوظيفي.', time: '10:52 ص' }
    ],
    sharedFiles: [
      { name: 'ahmed_cv_2026.pdf', date: 'اليوم، 10:30 ص', size: '1.2 MB' },
      { name: 'offer_letter_techvision.pdf', date: 'اليوم، 10:50 ص', size: '850 KB' }
    ]
  },
  {
    id: 'conv-2',
    companyName: 'CloudNative Inc',
    companyLogo: '☁️',
    lastMessage: 'لاحظنا ملفك الشخصي وخبرتك في النظم السحابية ونرغب بالتنسيق معك.',
    lastMessageTime: 'منذ 3 ساعات',
    unreadCount: 1,
    isOnline: true,
    jobTitle: 'DevOps & Cloud Engineer',
    messages: [
      { id: 'cn-1', sender: 'company', text: 'مرحباً أحمد، نحن في CloudNative مهتمون بخبرتك البرمجية وحرصك على الممارسات السحابية.', time: '09:15 ص' },
      { id: 'cn-2', sender: 'company', text: 'لاحظنا ملفك الشخصي وخبرتك في النظم السحابية ونرغب بالتنسيق معك.', time: '09:16 ص' }
    ],
    sharedFiles: [
      { name: 'ahmed_cv_2026.pdf', date: 'أمس', size: '1.2 MB' }
    ]
  },
  {
    id: 'conv-3',
    companyName: 'CreativeHQ',
    companyLogo: '🎨',
    lastMessage: 'شكراً لمشاركتك معنا ونتمنى لك كل التوفيق في مسيرتك.',
    lastMessageTime: 'أمس',
    unreadCount: 0,
    isOnline: false,
    jobTitle: 'UI/UX Designer',
    messages: [
      { id: 'cr-1', sender: 'company', text: 'أهلاً أحمد، استلمنا نموذج طلبك، وسنقوم بالرد بعد إتمام فرز المرحلة الأولى.', time: 'أمس' },
      { id: 'cr-2', sender: 'company', text: 'شكراً لمشاركتك معنا ونتمنى لك كل التوفيق في مسيرتك.', time: 'أمس' }
    ],
    sharedFiles: []
  }
];

export const initialNotifications: NotificationItem[] = [
  { id: 'n-1', icon: '💼', title: 'تمت مراجعة طلب توظيفك لمنصب Senior Frontend Developer من قبل TechVision', time: 'منذ 10 دقائق', unread: true, actionTab: 'applications' },
  { id: 'n-2', icon: '🎉', title: 'تلقيت عرض توظيف رسمي جديد في صندوق الرسائل من TechVision Corp', time: 'منذ 25 دقيقة', unread: true, actionTab: 'messages' },
  { id: 'n-3', icon: '👍', title: 'أعجب عمر ناصر بمنشورك الأخير حول تقنيات الويب الحديثة', time: 'منذ ساعة', unread: true, actionTab: 'feed' },
  { id: 'n-4', icon: '🎯', title: 'هناك 4 وظائف جديدة تطابق مهاراتك (React, TypeScript)', time: 'منذ ساعتين', unread: false, actionTab: 'jobs' },
  { id: 'n-5', icon: '🚀', title: 'مبروك! تم توثيق حسابك في منصة فرصة بنجاح', time: 'منذ يومين', unread: false, actionTab: 'profile' }
];

export const initialSkills: SkillItem[] = [
  { id: 'sk-1', name: 'React.js / Next.js', level: 'خبير', percentage: 95 },
  { id: 'sk-2', name: 'TypeScript', level: 'متقدم', percentage: 90 },
  { id: 'sk-3', name: 'Tailwind CSS', level: 'خبير', percentage: 98 },
  { id: 'sk-4', name: 'Node.js & Express', level: 'متقدم', percentage: 85 },
  { id: 'sk-5', name: 'PostgreSQL / MongoDB', level: 'متوسط', percentage: 75 },
  { id: 'sk-6', name: 'Docker & CI/CD', level: 'متوسط', percentage: 70 },
  { id: 'sk-7', name: 'Git & GitHub', level: 'متقدم', percentage: 92 },
  { id: 'sk-8', name: 'UI/UX Prototyping (Figma)', level: 'متوسط', percentage: 65 }
];

export const initialExperiences: ExperienceItem[] = [
  {
    id: 'exp-1',
    role: 'Senior Full Stack Developer',
    company: 'TechStart Solutions',
    location: 'القاهرة، مصر (هجين)',
    period: 'أبريل 2023 — الآن',
    description: 'قيادة فريق مكون من 5 مهندسين لتطوير منصة SaaS متكاملة. تحسين سرعة استجابة التطبيق بنسبة 40% من خلال تحسين بنية الـ State وتقسيم الحزم البرمجية، وتصميم APIs موثوقة باستخدام Node.js و Express.'
  },
  {
    id: 'exp-2',
    role: 'Frontend Developer',
    company: 'WebCraft Agency',
    location: 'عن بُعد (دبي)',
    period: 'يناير 2021 — مارس 2023',
    description: 'تطوير أكثر من 15 واجهة تفاعلية للعملاء باستخدام React, Redux, و Tailwind. التعاون الوثيق مع مصممي UI/UX لضمان أفضل معايير تجربة المستخدم ودعم كامل للأجهزة اللوحية والمحمولة.'
  }
];

export const initialEducations: EducationItem[] = [
  {
    id: 'edu-1',
    degree: 'بكالوريوس علوم الحاسوب وتكنولوجيا المعلومات',
    institution: 'جامعة القاهرة',
    period: '2017 — 2021',
    description: 'تقدير ممتاز مع مرتبة الشرف، مشروع التخرج في مجال منصات التعلم الذاتي التفاعلية.'
  },
  {
    id: 'edu-2',
    degree: 'شهادة مهنية في الحوسبة السحابية وهندسة النظم',
    institution: 'AWS Certified Solutions Architect',
    period: '2023',
    description: 'اعتماد رسمي في معمارية وتأمين التطبيقات الموزعة على البنية التحتية السحابية.'
  }
];

export const initialCVFiles: CVFile[] = [
  {
    id: 'cv-1',
    name: 'ahmed_rashid_cv_2026.pdf',
    uploadDate: '15 أغسطس 2026',
    size: '1.2 MB',
    isDefault: true
  },
  {
    id: 'cv-2',
    name: 'ahmed_rashid_portfolio_resume.pdf',
    uploadDate: '10 يناير 2026',
    size: '2.4 MB',
    isDefault: false
  }
];

export const initialEmployerCompany: Company = {
  id: 'comp-1',
  name: 'TechVision Corp',
  tagline: 'رواد حلول السحابة والتحول الرقمي في الشرق الأوسط',
  logo: '🚀',
  coverGradient: 'from-blue-600 via-indigo-600 to-slate-900',
  industry: 'تطوير البرمجيات والتقنية',
  location: 'الرياض، المملكة العربية السعودية',
  employeesCount: '150 - 300 موظف',
  foundedYear: '2019',
  website: 'https://techvision.example.com',
  description: 'شركة تقنية رائدة تركز على بناء حلول برمجية سحابية متقدمة وتطبيقات فائقة الأداء لملايين المستخدمين في الشرق الأوسط وشمال أفريقيا، مع بيئة عمل محفزة للإبداع والابتكار.',
  benefits: [
    'تأمين طبي عائلي VIP شامل',
    'ساعات عمل مرنة وخيار العمل عن بُعد',
    'ميزانية سنوية لتطوير المهارات والشهادات الاحترافية',
    'مكافآت أداء سنوية وتوزيع أرباح',
    'أحدث أجهزة Mac وملحقات العمل'
  ],
  rating: 4.9,
  reviewsCount: 84,
  isVerified: true,
  openJobsCount: 3
};

export const initialCompanies: Company[] = [
  initialEmployerCompany,
  {
    id: 'comp-2',
    name: 'CloudNative Inc',
    tagline: 'البنية التحتية السحابية وحلول الأتمتة الحديثة',
    logo: '☁️',
    coverGradient: 'from-cyan-600 via-blue-600 to-indigo-900',
    industry: 'الحوسبة السحابية والبنية التحتية',
    location: 'دبي، الإمارات العربية المتحدة',
    employeesCount: '50 - 100 موظف',
    foundedYear: '2021',
    website: 'https://cloudnative.example.com',
    description: 'نساعد الشركات والمؤسسات الكبرى على نقل وتوسيع أعمالها على السحابة بكل موثوقية وأمان عبر أحدث ممارسات DevOps وهندسة الموثوقية (SRE).',
    benefits: [
      'بيئة عمل هجينة (عن بُعد + مكتبي)',
      'تغطية تكاليف المؤتمرات التقنية العالمية',
      'إجازات سنوية مدفوعة 30 يوماً',
      'تأمين صحي درجة أولى'
    ],
    rating: 4.8,
    reviewsCount: 46,
    isVerified: true,
    openJobsCount: 2
  },
  {
    id: 'comp-3',
    name: 'StartupHub',
    tagline: 'حاضنة التكنولوجيا والابتكار الأولى للشركات الناشئة',
    logo: '💡',
    coverGradient: 'from-amber-500 via-orange-600 to-red-700',
    industry: 'حاضنات الأعمال والاستثمار الجريء',
    location: 'القاهرة، جمهورية مصر العربية',
    employeesCount: '25 - 50 موظف',
    foundedYear: '2020',
    website: 'https://startuphub.example.com',
    description: 'منظومة متكاملة لدعم وتوسيع الشركات التكنولوجية الناشئة في المنطقة، وتقديم بيئة احترافية للابتكار وسرعة الانطلاق نحو الأسواق الإقليمية.',
    benefits: [
      'مساحات عمل إبداعية ومحفزة',
      'برامج إرشاد مع كبار الخبراء الإقليميين',
      'فرص حصص ملكية (Equity / ESOP)',
      'ساعات عمل مرنة ومحفزة'
    ],
    rating: 4.7,
    reviewsCount: 62,
    isVerified: true,
    openJobsCount: 4
  },
  {
    id: 'comp-4',
    name: 'AppMasters',
    tagline: 'صنّاع تطبيقات الجوال الاستثنائية والحلول التفاعلية',
    logo: '📱',
    coverGradient: 'from-violet-600 via-purple-700 to-slate-950',
    industry: 'تطوير تطبيقات الهواتف الذكية',
    location: 'عمّان، الأردن (فريق عالمي عن بُعد)',
    employeesCount: '40 - 80 موظف',
    foundedYear: '2018',
    website: 'https://appmasters.example.com',
    description: 'أستوديو تقني متخصص في تصميم وتطوير تطبيقات الهواتف الذكية (iOS و Android) لرواد الأعمال والعلامات التجارية الكبرى بملايين التنزيلات عالمياً.',
    benefits: [
      'العمل عن بُعد بنسبة 100%',
      'راتب مجزي بالدولار الأمريكي مع حوافز إنجاز',
      'ميزانية سنوية لاقتناء أجهزة ومعدات العمل',
      'اشتراكات مجانية في منصات التعلم والذكاء الاصطناعي'
    ],
    rating: 4.8,
    reviewsCount: 39,
    isVerified: true,
    openJobsCount: 2
  },
  {
    id: 'comp-5',
    name: 'GrowthMinds',
    tagline: 'وكالة النمو الرقمي والتسويق القائم على البيانات',
    logo: '📢',
    coverGradient: 'from-emerald-600 via-teal-700 to-slate-900',
    industry: 'التسويق الرقمي والإعلام',
    location: 'الرياض، السعودية وأبوظبي، الإمارات',
    employeesCount: '60 - 120 موظف',
    foundedYear: '2019',
    website: 'https://growthminds.example.com',
    description: 'نبتكر استراتيجيات تسويق ونمو مدروسة تضاعف مبيعات وحضور كبرى الشركات الرقمية في الخليج العربي من خلال تحليل البيانات وتجارب المستخدمين.',
    benefits: [
      'مكافآت شهرية مرتبطة بنتائج الحملات',
      'بيئة سريعة التطور وفرص قيادية مبكرة',
      'تأمين صحي عائلي وتذاكر سفر سنوية',
      'يوم عمل أسبوعي مخصص للمشاريع الابتكارية'
    ],
    rating: 4.6,
    reviewsCount: 53,
    isVerified: true,
    openJobsCount: 3
  },
  {
    id: 'comp-6',
    name: 'InsightData Labs',
    tagline: 'تمكين المؤسسات عبر الذكاء الاصطناعي والتحليلات التنبؤية',
    logo: '📊',
    coverGradient: 'from-blue-700 via-indigo-800 to-slate-950',
    industry: 'الذكاء الاصطناعي وعلوم البيانات',
    location: 'الرياض، المملكة العربية السعودية',
    employeesCount: '70 - 150 موظف',
    foundedYear: '2022',
    website: 'https://insightdata.example.com',
    description: 'مختبر أبحاث وتطوير يقود ثورة البيانات الضخمة ونماذج الذكاء الاصطناعي التوليدي لخدمة قطاعات البنوك، الرعاية الصحية، والخدمات الحكومية.',
    benefits: [
      'مشاريع نوعية على مستوى وطني وإقليمي',
      'وصول لأقوى خوادم الحوسبة الرسومية GPU Clusters',
      'برامج زمالة بحثية وأكاديمية',
      'مرونة عالية ومكافآت براءات اختراع'
    ],
    rating: 4.9,
    reviewsCount: 41,
    isVerified: true,
    openJobsCount: 2
  },
  {
    id: 'comp-7',
    name: 'Madarek FinTech',
    tagline: 'مستقبل المدفوعات والخدمات المصرفية المفتوحة',
    logo: '💳',
    coverGradient: 'from-emerald-700 via-cyan-800 to-slate-950',
    industry: 'التكنولوجيا المالية والمدفوعات',
    location: 'المنامة، البحرين والرياض، السعودية',
    employeesCount: '100 - 250 موظف',
    foundedYear: '2020',
    website: 'https://madarek.example.com',
    description: 'شركة تكنولوجيا مالية مرخصة تقدم حلول الدفع المبتكرة، المحافظ الرقمية، وتسهيل المعاملات المالية بين الشركات والأفراد بأمان تام.',
    benefits: [
      'رواتب منافسة مع خيارات أسهم',
      'تأمين صحي متميز فئة الذهب',
      'صندوق ادخار وتقاعد مدعوم',
      'برامج إجازات أبوة وأمومة ممتدة'
    ],
    rating: 4.9,
    reviewsCount: 77,
    isVerified: true,
    openJobsCount: 3
  },
  {
    id: 'comp-8',
    name: 'TalentPeak',
    tagline: 'شريكك الاستراتيجي في توظيف الكفاءات والقيادات التنفيذية',
    logo: '👥',
    coverGradient: 'from-rose-600 via-pink-700 to-slate-900',
    industry: 'الموارد البشرية واستقطاب الكفاءات',
    location: 'جدة، المملكة العربية السعودية',
    employeesCount: '30 - 70 موظف',
    foundedYear: '2017',
    website: 'https://talentpeak.example.com',
    description: 'نربط أبرز الشركات والمؤسسات في الخليج بألمع الكفاءات والقيادات التنفيذية من مختلف أنحاء العالم عبر تقنيات فحص متقدمة وشبكة علاقات واسعة.',
    benefits: [
      'عمولات توظيف مجزية وغير محدودة',
      'برامج تبادل دولي وتدريب في أكبر عواصم الأعمال',
      'بيئة عمل داعمة ومتنوعة',
      'مكافآت تميز ربع سنوية'
    ],
    rating: 4.7,
    reviewsCount: 38,
    isVerified: true,
    openJobsCount: 1
  }
];

export const initialCompanyApplicants: JobApplicant[] = [
  {
    id: 'cand-1',
    jobId: 'job-1',
    jobTitle: 'Senior Frontend Developer',
    candidateName: 'سارة عبد الرحمن',
    candidateHeadline: 'مطور واجهات أول | متخصص React و Next.js و State Management',
    candidateAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    candidateEmail: 'sara.rahman@example.com',
    candidatePhone: '+966 50 123 4567',
    experienceYears: 6,
    education: 'بكالوريوس تقنية معلومات - جامعة الملك سعود',
    appliedDate: 'اليوم، منذ ساعتين',
    status: 'المراجعة',
    matchScore: 96,
    resumeFileName: 'Sara_Abdulrahman_Senior_Frontend_Resume.pdf',
    coverNote: 'أمتلك خبرة 6 سنوات في بناء منصات SaaS وتطبيقات الواجهات باستخدام React و Next.js مع إتقان عالي لـ TypeScript وتصميم واجهات سريعة ومتجاوبة.',
    skills: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Redux Toolkit', 'Jest']
  },
  {
    id: 'cand-2',
    jobId: 'job-1',
    jobTitle: 'Senior Frontend Developer',
    candidateName: 'عمر التميمي',
    candidateHeadline: 'مهندس برمجيات واجهات | خبير أداء الويب و WebSockets',
    candidateAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    candidateEmail: 'omar.tamimi@example.com',
    candidatePhone: '+966 54 987 6543',
    experienceYears: 5,
    education: 'بكالوريوس علوم حاسب - جامعة البترول والمعادن',
    appliedDate: 'أمس، 04:30 م',
    status: 'المقابلة',
    matchScore: 92,
    resumeFileName: 'Omar_AlTamimi_Frontend_CV.pdf',
    coverNote: 'شغوف بتطوير واجهات عالية الاعتمادية والتفاعل الحي، قمت بقيادة فرق تطوير واجهات في شركتين ناشئتين سابقتين.',
    skills: ['React', 'TypeScript', 'GraphQL', 'Vite', 'Tailwind CSS', 'Performance Optimization'],
    interviewDate: 'غداً، 02:00 م عبر Google Meet'
  },
  {
    id: 'cand-3',
    jobId: 'job-3',
    jobTitle: 'DevOps & Cloud Engineer',
    candidateName: 'مروان خليل',
    candidateHeadline: 'مهندس DevOps معتمد AWS | خبير Kubernetes و CI/CD',
    candidateAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    candidateEmail: 'marwan.khalil@example.com',
    candidatePhone: '+971 52 334 5566',
    experienceYears: 7,
    education: 'ماجستير أمن وبنية سحابية - جامعة القاهرة',
    appliedDate: 'منذ يومين',
    status: 'الاختصار',
    matchScore: 94,
    resumeFileName: 'Marwan_Khalil_DevOps_Specialist.pdf',
    coverNote: 'أدرت بنى تحتية سحابية تخدم أكثر من 2 مليون طلب يومياً مع نسبة توفر 99.99%، ويسعدني المساهمة في توسيع أنظمة الشركة.',
    skills: ['AWS', 'Kubernetes', 'Terraform', 'Docker', 'GitHub Actions', 'Prometheus']
  },
  {
    id: 'cand-4',
    jobId: 'job-1',
    jobTitle: 'Senior Frontend Developer',
    candidateName: 'ريم المطيري',
    candidateHeadline: 'مهندسة واجهات ومطورة تجربة مستخدم UI/UX',
    candidateAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    candidateEmail: 'reem.almutairi@example.com',
    candidatePhone: '+966 56 778 8990',
    experienceYears: 4,
    education: 'بكالوريوس علوم الحاسوب - جامعة الملك عبد العزيز',
    appliedDate: 'منذ 3 أيام',
    status: 'التقدم',
    matchScore: 88,
    resumeFileName: 'Reem_Almutairi_UI_Frontend.pdf',
    coverNote: 'مهتمة جداً بفرصة العمل لديكم للمساهمة في بناء واجهات استثنائية تجمع بين جمال التصميم وقوة البرمجة.',
    skills: ['React', 'JavaScript', 'CSS Modules', 'Figma to Code', 'REST APIs']
  },
  {
    id: 'cand-5',
    jobId: 'job-5',
    jobTitle: 'Full Stack Web Developer',
    candidateName: 'كريم الصاوي',
    candidateHeadline: 'Full Stack Developer | Node.js & React & Postgres',
    candidateAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80',
    candidateEmail: 'kareem.sawi@example.com',
    candidatePhone: '+20 100 554 4332',
    experienceYears: 5,
    education: 'بكالوريوس حاسبات ومعلومات - جامعة عين شمس',
    appliedDate: 'منذ 4 أيام',
    status: 'العرض',
    matchScore: 95,
    resumeFileName: 'Kareem_ElSawy_FullStack_2026.pdf',
    coverNote: 'تم تقديم عرض وظيفي رسمي للمرشح بعد اجتياز المقابلة التقنية والشخصية بتفوق.',
    skills: ['Node.js', 'Express', 'React', 'PostgreSQL', 'Redis', 'Docker']
  },
  {
    id: 'cand-6',
    jobId: 'job-6',
    jobTitle: 'Digital Marketing Specialist',
    candidateName: 'نور الهدى الشامي',
    candidateHeadline: 'متخصصة نمو وتسويق أداء وحملات إعلانية',
    candidateAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    candidateEmail: 'nour.shami@example.com',
    candidatePhone: '+971 50 889 1122',
    experienceYears: 4,
    education: 'بكالوريوس تسويق رقمي - الجامعة الأمريكية بدبي',
    appliedDate: 'منذ 5 أيام',
    status: 'المقابلة',
    matchScore: 91,
    resumeFileName: 'Nour_AlShami_Growth_Marketing.pdf',
    coverNote: 'حققت نمواً بنسبة 180% في العائد على الإنفاق الإعلاني في حملات التسويق الرقمي العام الماضي.',
    skills: ['Google Ads', 'Meta Ads', 'SEO', 'Data Analytics', 'TikTok Ads'],
    interviewDate: 'الخميس، 11:30 ص عبر الهاتف'
  }
];

