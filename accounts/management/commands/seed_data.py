import uuid
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from rest_framework.authtoken.models import Token
from accounts.models import Skill, Experience, Education, CVFile
from companies.models import Company
from jobs.models import Job, Application, SavedJob
from posts.models import Post
from chat.models import Conversation, Message
from notifications.models import Notification

User = get_user_model()

class Command(BaseCommand):
    help = 'Populate database with initial mock data from Forsa platform'

    def handle(self, *args, **options):
        self.stdout.write(self.style.NOTICE('Starting database population...'))

        # 1. Superuser & Default User
        admin_user, _ = User.objects.get_or_create(
            username='admin',
            defaults={
                'email': 'admin@forsa.com',
                'first_name': 'مدير',
                'last_name': 'المنصة',
                'role': 'employer',
                'is_staff': True,
                'is_superuser': True,
            }
        )
        admin_user.set_password('admin123')
        admin_user.save()

        user, _ = User.objects.get_or_create(
            username='ahmed.dev',
            defaults={
                'email': 'ahmed.rashid.dev@example.com',
                'first_name': 'أحمد',
                'last_name': 'الرشيد',
                'role': 'seeker',
                'avatar': 'أر',
                'headline': 'Senior Full Stack Developer متخصص في معمارية تطبيقات الويب باستخدام React, TypeScript و Node.js.',
                'phone': '+966 50 123 4567',
                'location': 'الرياض، المملكة العربية السعودية',
                'bio': 'مطور برمجيات ذو شغف كبير ببناء منتجات رقمية قابلة للتوسع وتجارب مستخدم سلسة وعالية الأداء.'
            }
        )
        user.set_password('password123')
        user.save()
        Token.objects.get_or_create(user=user)

        # 2. User Profile (Skills, Experiences, Education, Resumes)
        Skill.objects.filter(user=user).delete()
        skills_data = [
            {'name': 'React & Next.js', 'level': 'خبير', 'percentage': 95},
            {'name': 'TypeScript', 'level': 'خبير', 'percentage': 90},
            {'name': 'Node.js & Express', 'level': 'متقدم', 'percentage': 85},
            {'name': 'Tailwind CSS', 'level': 'خبير', 'percentage': 95},
            {'name': 'GraphQL & REST APIs', 'level': 'متقدم', 'percentage': 88},
            {'name': 'Docker & CI/CD', 'level': 'متوسط', 'percentage': 75},
            {'name': 'PostgreSQL & MongoDB', 'level': 'متقدم', 'percentage': 82},
            {'name': 'Testing (Jest/Cypress)', 'level': 'متوسط', 'percentage': 78},
        ]
        for s in skills_data:
            Skill.objects.create(user=user, **s)

        Experience.objects.filter(user=user).delete()
        experiences_data = [
            {
                'role': 'Senior Frontend Engineer',
                'company': 'TechWave Solutions',
                'location': 'الرياض، السعودية',
                'period': '2022 - الآن',
                'description': 'قيادة فريق تطوير الواجهات الأمامية وبناء المنصة السحابية المحدثة، تحسين سرعة التحميل بنسبة 40% وتطبيق معمارية المكونات القابلة لإعادة الاستخدام.'
            },
            {
                'role': 'Full Stack Developer',
                'company': 'Digital Pioneers',
                'location': 'دبي، الإمارات (عن بُعد)',
                'period': '2020 - 2022',
                'description': 'تطوير تطبيقات ويب تجارية وإدارة قواعد البيانات وربط بوابات الدفع الإلكتروني وتكامل الـ APIs المختلفة.'
            },
            {
                'role': 'Frontend Developer',
                'company': 'Creative Code',
                'location': 'جدة، السعودية',
                'period': '2018 - 2020',
                'description': 'تصميم وتنفيذ صفحات هبوط متجاوبة وتحسين تجربة التصفح عبر الهواتف الذكية مع معايير SEO القياسية.'
            }
        ]
        for e in experiences_data:
            Experience.objects.create(user=user, **e)

        Education.objects.filter(user=user).delete()
        educations_data = [
            {
                'degree': 'بكالوريوس علوم الحاسب والمعلومات',
                'institution': 'جامعة الملك سعود',
                'period': '2014 - 2018',
                'description': 'تخرجت بمرتبة الشرف مع التركيز على هندسة البرمجيات وخوارزميات الذكاء الاصطناعي.'
            },
            {
                'degree': 'شهادة احترافية في هندسة الحوسبة السحابية (AWS)',
                'institution': 'Amazon Web Services',
                'period': '2021',
                'description': 'AWS Certified Solutions Architect – Associate'
            }
        ]
        for ed in educations_data:
            Education.objects.create(user=user, **ed)

        CVFile.objects.filter(user=user).delete()
        CVFile.objects.create(
            user=user,
            name='السيرة_الذاتية_أحمد_الرشيد_2026.pdf',
            upload_date='منذ يومين',
            size='2.4 MB',
            is_default=True
        )
        CVFile.objects.create(
            user=user,
            name='Ahmed_Rashid_Resume_EN.pdf',
            upload_date='منذ شهر',
            size='1.8 MB',
            is_default=False
        )

        # 3. Companies
        companies_data = [
            {
                'id': 'comp-1',
                'name': 'TechVision Corp',
                'tagline': 'رواد حلول البرمجيات السحابية والتحول الرقمي',
                'logo': '🚀',
                'cover_gradient': 'from-blue-600 to-indigo-700',
                'industry': 'تقنية المعلومات والبرمجيات',
                'location': 'الرياض، المملكة العربية السعودية',
                'employees_count': '250 - 500 موظف',
                'founded_year': '2017',
                'website': 'https://techvision.example.com',
                'description': 'شركة رائدة متخصصة في ابتكار وتطوير الأنظمة السحابية المتقدمة وحلول الذكاء الاصطناعي لقطاعات الأعمال الكبرى.',
                'benefits': ['تأمين صحي شامل VIP', 'ساعات عمل مرنة وخيار العمل عن بُعد', 'مكافآت سنوية وبدل تعليم وتطوير', 'بيئة عمل محفزة ومبتكرة'],
                'rating': 4.9,
                'reviews_count': 142,
                'is_verified': True,
                'open_jobs_count': 4
            },
            {
                'id': 'comp-2',
                'name': 'CreativeHQ',
                'tagline': 'أستوديو إبداعي لتصميم التجارب الرقمية والمنتجات الحديثة',
                'logo': '🎨',
                'cover_gradient': 'from-purple-600 to-pink-600',
                'industry': 'التصميم الإبداعي والمنتجات الرقمية',
                'location': 'دبي، الإمارات العربية المتحدة',
                'employees_count': '50 - 100 موظف',
                'founded_year': '2019',
                'website': 'https://creativehq.example.com',
                'description': 'نحن فريق شغوف بالابتكار وتصميم واجهات المستخدم الحديثة التي تترك أثراً دائماً وتساعد الشركات في بناء هويتها التفاعلية.',
                'benefits': ['بيئة عمل استثنائية في قلب دبي', 'أحدث أجهزة Apple وشاشات احترافية', 'فعاليات ترفيهية وورش عمل دورية', 'إجازات سنوية مرنة'],
                'rating': 4.8,
                'reviews_count': 89,
                'is_verified': True,
                'open_jobs_count': 3
            },
            {
                'id': 'comp-3',
                'name': 'CloudNative Inc',
                'tagline': 'تمكين الشركات عبر هندسة البنية التحتية السحابية وأمن البيانات',
                'logo': '☁️',
                'cover_gradient': 'from-cyan-600 to-blue-700',
                'industry': 'الحوسبة السحابية والبنية التحتية',
                'location': 'الرياض، المملكة العربية السعودية',
                'employees_count': '100 - 250 موظف',
                'founded_year': '2018',
                'website': 'https://cloudnative.example.com',
                'description': 'نساعد المؤسسات الحكومية والخاصة في نقل وبناء أنظمتها السحابية باستخدام أحدث تقنيات الحاويات والحلول التلقائية.',
                'benefits': ['فرص تدريب وشهادات معتمدة مدفوعة', 'حوافز أداء مجزية وبدلات تنقل', 'تأمين طبي للموظف وأسرته'],
                'rating': 4.7,
                'reviews_count': 64,
                'is_verified': True,
                'open_jobs_count': 5
            }
        ]
        for c in companies_data:
            Company.objects.update_or_create(id=c['id'], defaults=c)

        # 4. Jobs
        jobs_data = [
            {
                'id': 'job-1',
                'title': 'Senior Frontend Developer',
                'company': 'TechVision Corp',
                'location': 'الرياض، السعودية (عن بُعد)',
                'logo': '🚀',
                'type': 'دوام كامل',
                'domain': 'تطوير البرمجيات',
                'salary': ',500 - ,000',
                'posted_time': 'منذ ساعتين',
                'applicants_count': 124,
                'skills': ['React', 'TypeScript', 'Tailwind CSS', 'Next.js'],
                'description': 'نبحث عن مطور واجهات أمامية أول للانضمام لفريقنا الهندسي وبناء تطبيقات تفاعلية فائقة السرعة والأداء باستخدام React و TypeScript.',
                'requirements': [
                    'خبرة لا تقل عن 5 سنوات في تطوير الواجهات الأمامية باستخدام React و Next.js',
                    'إتقان عميق لـ TypeScript و Tailwind CSS وإدارة الحالة المتقدمة',
                    'معرفة ممتازة بأفضل ممارسات الأداء وسهولة الوصول (a11y) و SEO'
                ],
                'is_verified': True
            },
            {
                'id': 'job-2',
                'title': 'UI/UX Designer',
                'company': 'CreativeHQ',
                'location': 'دبي، الإمارات (هجين)',
                'logo': '🎨',
                'type': 'دوام كامل',
                'domain': 'التصميم (UI/UX)',
                'salary': ',800 - ,200',
                'posted_time': 'منذ 5 ساعات',
                'applicants_count': 89,
                'skills': ['Figma', 'Prototyping', 'Design Systems', 'User Research'],
                'description': 'مطلوب مصمم واجهات وتجربة مستخدم مبدع لتصميم منصات رقمية وحلول تجارب سهلة الاستخدام.',
                'requirements': [
                    'خبرة 3+ سنوات في تصميم منتجات رقمية (Web & Mobile)',
                    'إتقان أدوات Figma وتصميم النماذج التفاعلية وأنظمة المكونات Design Systems'
                ],
                'is_verified': True
            },
            {
                'id': 'job-3',
                'title': 'DevOps & Cloud Engineer',
                'company': 'CloudNative Inc',
                'location': 'الرياض، السعودية',
                'logo': '☁️',
                'type': 'دوام كامل',
                'domain': 'تطوير البرمجيات',
                'salary': ',500 - ,000',
                'posted_time': 'منذ يوم',
                'applicants_count': 42,
                'skills': ['Docker', 'Kubernetes', 'AWS', 'CI/CD'],
                'description': 'نبحث عن مهندس DevOps محترف لإدارة البنية التحتية السحابية وأتمتة خطوط النشر الآلي.',
                'requirements': [
                    'خبرة عملية مع خدمات AWS الأساسية و Kubernetes',
                    'إتقان بناء وتطوير أنابيب CI/CD باستخدام GitHub Actions'
                ],
                'is_verified': True
            }
        ]
        for j in jobs_data:
            c_obj = Company.objects.filter(name=j['company']).first()
            j['company_ref'] = c_obj
            Job.objects.update_or_create(id=j['id'], defaults=j)

        # Save some jobs for user
        SavedJob.objects.get_or_create(user=user, job=Job.objects.get(id='job-1'))

        # 5. Applications & Employer Hub Applicants
        app_1, _ = Application.objects.update_or_create(
            id='app-1',
            defaults={
                'job': Job.objects.get(id='job-1'),
                'user': user,
                'job_title': 'Senior Frontend Developer',
                'company': 'TechVision Corp',
                'logo': '🚀',
                'apply_date': '2026-03-10',
                'status': 'المقابلة',
                'current_step_index': 3,
                'interview_date': 'الخميس 19 مارس - 2:00 م',
                'interview_note': 'مقابلة تقنية مع قائد الفريق الهندسي عبر Google Meet',
                'resume_file_name': 'السيرة_الذاتية_أحمد_الرشيد_2026.pdf',
                'candidate_name': 'أحمد الرشيد',
                'candidate_headline': 'Senior Full Stack Developer',
                'candidate_avatar': 'أر',
                'candidate_email': 'ahmed.rashid.dev@example.com',
                'candidate_phone': '+966 50 123 4567',
                'experience_years': 6,
                'education': 'جامعة الملك سعود - علوم حاسب',
                'match_score': 94,
                'candidate_skills': ['React', 'TypeScript', 'Next.js', 'Tailwind CSS'],
                'timeline': [
                    {'title': 'تم استلام طلبك بنجاح', 'date': '10 مارس 2026', 'completed': True, 'active': False},
                    {'title': 'المراجعة والتدقيق المبدئي', 'date': '12 مارس 2026', 'completed': True, 'active': False},
                    {'title': 'تم ترشيحك للقائمة المختصرة', 'date': '14 مارس 2026', 'completed': True, 'active': False},
                    {'title': 'المقابلة الفنية / الشخصية', 'date': '19 مارس 2026', 'completed': False, 'active': True, 'note': 'موعد المقابلة محدد عبر الرابط المرسل'},
                    {'title': 'عرض العمل الرسمي', 'date': 'قيد الانتظار', 'completed': False, 'active': False},
                    {'title': 'التوظيف النهائي وتوقيع العقد', 'date': 'قيد الانتظار', 'completed': False, 'active': False},
                ]
            }
        )

        # 6. Posts (Feed)
        posts_data = [
            {
                'id': 'post-1',
                'author': user,
                'author_name': 'أحمد الرشيد',
                'author_headline': 'Senior Full Stack Developer @ TechWave Solutions',
                'author_avatar': 'أر',
                'avatar_color': 'from-blue-600 to-indigo-600',
                'time_ago': 'منذ 3 ساعات',
                'content': 'سعيد جداً بمشاركة انتهاء إطلاق الإصدار الجديد من بنيتنا التحتية المعتمدة على Next.js 15 و React Server Components. التحسن في زمن الاستجابة (TTFB) كان مذهلاً بنسبة تجاوزت 45%!',
                'skills': ['Next.js', 'React', 'WebPerformance'],
                'likes_count': 48,
                'comments_count': 12,
                'category': 'إنجاز'
            },
            {
                'id': 'post-2',
                'author': admin_user,
                'author_name': 'سارة المهيدب',
                'author_headline': 'Head of People & Culture @ TechVision Corp',
                'author_avatar': 'سم',
                'avatar_color': 'from-emerald-600 to-teal-600',
                'time_ago': 'منذ 6 ساعات',
                'content': 'نحن نوظف! نبحث عن 3 مطورين ومصممين استثنائيين للانضمام إلى فريقنا في الرياض أو عن بُعد. إذا كنت تبحث عن بيئة تقدر الابتكار وتمنحك مساحة للنمو الحقيقي، تصفح وظائفنا الشاغرة الآن.',
                'skills': ['Hiring', 'TechJobs', 'CareerGrowth'],
                'likes_count': 92,
                'comments_count': 34,
                'category': 'عام'
            }
        ]
        for p in posts_data:
            Post.objects.update_or_create(id=p['id'], defaults=p)

        # 7. Conversations & Messages
        conv_1, _ = Conversation.objects.update_or_create(
            id='conv-1',
            defaults={
                'user': user,
                'company_name': 'TechVision Corp',
                'company_logo': '🚀',
                'last_message': 'أهلاً بك أحمد، نود دعوتك للمقابلة التقنية يوم الخميس القادم.',
                'last_message_time': '10:30 ص',
                'unread_count': 1,
                'is_online': True,
                'job_title': 'Senior Frontend Developer',
                'shared_files': [{'name': 'Job_Offer_Details.pdf', 'date': '12 مارس', 'size': '420 KB'}]
            }
        )
        Message.objects.filter(conversation=conv_1).delete()
        Message.objects.create(
            id='msg-1',
            conversation=conv_1,
            sender='company',
            text='مرحباً أحمد، يسعدنا اهتمامك بالانضمام إلى TechVision Corp! لقد راجعنا ملفك وأعمالك وأعجبنا بشدة.',
            time='أمس 4:15 م'
        )
        Message.objects.create(
            id='msg-2',
            conversation=conv_1,
            sender='user',
            text='أهلاً بك، شكراً جزيلاً لك! يسعدني ويشرفني جداً هذا التواصل.',
            time='أمس 4:22 م'
        )
        Message.objects.create(
            id='msg-3',
            conversation=conv_1,
            sender='company',
            is_offer=True,
            offer_details={
                'jobTitle': 'Senior Frontend Developer',
                'salary': ',500 شهرياً',
                'startDate': '1 أبريل 2026',
                'accepted': False,
                'declined': False
            },
            time='10:30 ص'
        )

        # 8. Notifications
        notifications_data = [
            {'id': 'notif-1', 'icon': 'Calendar', 'title': 'تم تحديد موعد مقابلة جديدة مع TechVision Corp', 'time': 'منذ ساعتين', 'unread': True, 'action_tab': 'applications'},
            {'id': 'notif-2', 'icon': 'CheckCircle2', 'title': 'تمت ترقية طلبك إلى مرحلة القائمة المختصرة', 'time': 'منذ 5 ساعات', 'unread': True, 'action_tab': 'applications'},
            {'id': 'notif-3', 'icon': 'Briefcase', 'title': 'وظيفة جديدة تناسب مهاراتك: Senior React Engineer', 'time': 'منذ يوم', 'unread': False, 'action_tab': 'jobs'},
        ]
        Notification.objects.filter(user=user).delete()
        for n in notifications_data:
            Notification.objects.create(user=user, **n)

        self.stdout.write(self.style.SUCCESS('Successfully populated database with comprehensive Forsa data!'))
