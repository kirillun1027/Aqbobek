export type Language = "kk" | "ru" | "en"

export const languages: { code: Language; label: string; flag: string }[] = [
  { code: "kk", label: "Қазақша", flag: "🇰🇿" },
  { code: "ru", label: "Русский", flag: "🇷🇺" },
  { code: "en", label: "English", flag: "🇬🇧" },
]

export const translations = {
  // Common
  common: {
    schoolName: {
      kk: "Ақбөбек Лицейі",
      ru: "Лицей Акбобек",
      en: "Aqbobek Lyceum",
    },
    schoolPortal: {
      kk: "Мектеп порталы",
      ru: "Школьный портал",
      en: "School Portal",
    },
    unifiedPortal: {
      kk: "Біртұтас мектеп порталы",
      ru: "Единый школьный портал",
      en: "Unified School Portal",
    },
    signIn: {
      kk: "Кіру",
      ru: "Войти",
      en: "Sign In",
    },
    signOut: {
      kk: "Шығу",
      ru: "Выйти",
      en: "Sign Out",
    },
    loading: {
      kk: "Жүктелуде...",
      ru: "Загрузка...",
      en: "Loading...",
    },
    redirecting: {
      kk: "Бағытталуда...",
      ru: "Перенаправление...",
      en: "Redirecting...",
    },
    viewAll: {
      kk: "Барлығын көру",
      ru: "Смотреть все",
      en: "View All",
    },
    save: {
      kk: "Сақтау",
      ru: "Сохранить",
      en: "Save",
    },
    cancel: {
      kk: "Болдырмау",
      ru: "Отмена",
      en: "Cancel",
    },
    submit: {
      kk: "Жіберу",
      ru: "Отправить",
      en: "Submit",
    },
    search: {
      kk: "Іздеу",
      ru: "Поиск",
      en: "Search",
    },
    settings: {
      kk: "Баптаулар",
      ru: "Настройки",
      en: "Settings",
    },
    welcomeBack: {
      kk: "Қош келдіңіз",
      ru: "Добро пожаловать",
      en: "Welcome back",
    },
    excellenceInEducation: {
      kk: "Білімдегі үздіктік",
      ru: "Совершенство в образовании",
      en: "Excellence in Education",
    },
  },

  // Landing Page
  landing: {
    heroTitle: {
      kk: "Біртұтас мектеп порталы",
      ru: "Единый школьный портал",
      en: "Unified School Portal for",
    },
    heroSubtitle: {
      kk: "Бір платформада бағалар, жетістіктер, іс-шаралар және жеке AI тәлімгерлік. Оқушылар, мұғалімдер, ата-аналар және әкімшілерді біріктіреді.",
      ru: "Одна платформа для оценок, достижений, мероприятий и персонального AI-наставничества. Объединяет учеников, учителей, родителей и администраторов.",
      en: "One platform for grades, achievements, events, and personalized AI mentoring. Connect students, teachers, parents, and administrators.",
    },
    getStarted: {
      kk: "Бастау",
      ru: "Начать",
      en: "Get Started",
    },
    viewKioskDemo: {
      kk: "Киоск демосын көру",
      ru: "Посмотреть демо киоска",
      en: "View Kiosk Demo",
    },
    kiosk: {
      kk: "Киоск",
      ru: "Киоск",
      en: "Kiosk",
    },
    everythingYouNeed: {
      kk: "Барлығы бір жерде",
      ru: "Всё в одном месте",
      en: "Everything You Need in One Place",
    },
    designedForEveryone: {
      kk: "Барлығы үшін жасалған",
      ru: "Разработано для всех",
      en: "Designed for Everyone",
    },
    readyToGetStarted: {
      kk: "Бастауға дайынсыз ба?",
      ru: "Готовы начать?",
      en: "Ready to Get Started?",
    },
    signInToAccess: {
      kk: "Порталға кіру немесе киоск демосын көру үшін.",
      ru: "Войдите в портал или посмотрите демо киоска.",
      en: "Sign in to access the portal or view the kiosk demo.",
    },
    signInNow: {
      kk: "Қазір кіру",
      ru: "Войти сейчас",
      en: "Sign In Now",
    },
    educationalPlatform: {
      kk: "Білім беру платформасы",
      ru: "Образовательная платформа",
      en: "Educational Platform",
    },
  },

  // Features
  features: {
    gradeTracking: {
      title: {
        kk: "Бағаларды бақылау",
        ru: "Отслеживание оценок",
        en: "Grade Tracking",
      },
      description: {
        kk: "BilimClass интеграциясымен нақты уақыттағы бағаларға қол жеткізу. Пәндер мен тоқсандар бойынша үлгерімді бақылаңыз.",
        ru: "Доступ к оценкам в реальном времени с интеграцией BilimClass. Отслеживайте успеваемость по предметам и четвертям.",
        en: "Real-time access to grades with BilimClass integration. Track performance across subjects and quarters.",
      },
    },
    achievements: {
      title: {
        kk: "Жетістіктер",
        ru: "Достижения",
        en: "Achievements",
      },
      description: {
        kk: "Академиялық, спорттық, өнер және басқа салалардағы оқушылардың жетістіктерін тіркеңіз және атап өтіңіз.",
        ru: "Записывайте и отмечайте достижения учащихся в учебе, спорте, искусстве и других областях.",
        en: "Record and celebrate student accomplishments in academics, sports, arts, and more.",
      },
    },
    aiMentor: {
      title: {
        kk: "AI Тәлімгер",
        ru: "AI Наставник",
        en: "AI Mentor",
      },
      description: {
        kk: "AI негізіндегі жеке кеңестер. Оқу кеңестері, мансап бағдары және жақсарту стратегияларын алыңыз.",
        ru: "Персональные советы на основе AI. Получайте советы по учёбе, карьерные рекомендации и стратегии улучшения.",
        en: "Personalized advice powered by AI. Get study tips, career guidance, and improvement strategies.",
      },
    },
    events: {
      title: {
        kk: "Мектеп іс-шаралары",
        ru: "Школьные мероприятия",
        en: "School Events",
      },
      description: {
        kk: "Емтихандар, демалыс күндері, спорттық іс-шаралар және мәдени шаралар туралы хабардар болыңыз.",
        ru: "Будьте в курсе экзаменов, каникул, спортивных и культурных мероприятий.",
        en: "Stay updated with exams, holidays, sports events, and cultural activities.",
      },
    },
    roleBasedAccess: {
      title: {
        kk: "Рөлге негізделген қол жеткізу",
        ru: "Ролевой доступ",
        en: "Role-Based Access",
      },
      description: {
        kk: "Оқушылар, мұғалімдер, ата-аналар және әкімшілер үшін арнайы бақылау тақталары.",
        ru: "Персонализированные панели для учеников, учителей, родителей и администраторов.",
        en: "Tailored dashboards for students, teachers, parents, and administrators.",
      },
    },
    kioskMode: {
      title: {
        kk: "Киоск режимі",
        ru: "Режим киоска",
        en: "Kiosk Mode",
      },
      description: {
        kk: "Үздік оқушыларды, іс-шараларды және жетістіктерді көрсететін интерактивті дәліз дисплейі.",
        ru: "Интерактивный дисплей для холла с лучшими учениками, событиями и достижениями.",
        en: "Interactive hallway display showing top students, events, and achievements.",
      },
    },
  },

  // Roles
  roles: {
    student: {
      title: {
        kk: "Оқушылар",
        ru: "Ученики",
        en: "Students",
      },
      description: {
        kk: "Бағаларды қараңыз, прогресті бақылаңыз, жетістіктерге қол жеткізіңіз және AI негізіндегі оқу кеңестерін алыңыз.",
        ru: "Просматривайте оценки, отслеживайте прогресс, получайте достижения и AI-советы по учёбе.",
        en: "View grades, track progress, earn achievements, and get AI-powered study advice.",
      },
    },
    teacher: {
      title: {
        kk: "Мұғалімдер",
        ru: "Учителя",
        en: "Teachers",
      },
      description: {
        kk: "Сынып үлгерімін бақылаңыз, қауіптегі оқушыларды анықтаңыз, бағалар мен жетістіктерді тіркеңіз.",
        ru: "Отслеживайте успеваемость класса, выявляйте отстающих учеников, записывайте оценки и достижения.",
        en: "Monitor class performance, identify at-risk students, and record grades and achievements.",
      },
    },
    parent: {
      title: {
        kk: "Ата-аналар",
        ru: "Родители",
        en: "Parents",
      },
      description: {
        kk: "Балаңыздың академиялық үлгерімі және алдағы мектеп іс-шаралары туралы хабардар болыңыз.",
        ru: "Будьте в курсе успеваемости вашего ребёнка и предстоящих школьных мероприятий.",
        en: "Stay informed about your child's academic progress and upcoming school events.",
      },
    },
    admin: {
      title: {
        kk: "Әкімшілер",
        ru: "Администраторы",
        en: "Administrators",
      },
      description: {
        kk: "Хабарландыруларды жариялаңыз, мектеп бойынша үлгерімді талдаңыз және киоск дисплейін басқарыңыз.",
        ru: "Публикуйте объявления, анализируйте успеваемость по школе и управляйте киоском.",
        en: "Publish announcements, analyze school-wide performance, and manage the kiosk display.",
      },
    },
  },

  // Navigation
  nav: {
    dashboard: {
      kk: "Басқару тақтасы",
      ru: "Панель управления",
      en: "Dashboard",
    },
    myGrades: {
      kk: "Менің бағаларым",
      ru: "Мои оценки",
      en: "My Grades",
    },
    achievements: {
      kk: "Жетістіктер",
      ru: "Достижения",
      en: "Achievements",
    },
    aiMentor: {
      kk: "AI Тәлімгер",
      ru: "AI Наставник",
      en: "AI Mentor",
    },
    events: {
      kk: "Іс-шаралар",
      ru: "Мероприятия",
      en: "Events",
    },
    students: {
      kk: "Оқушылар",
      ru: "Ученики",
      en: "Students",
    },
    atRiskStudents: {
      kk: "Қауіптегі оқушылар",
      ru: "Отстающие ученики",
      en: "At-Risk Students",
    },
    recordGrade: {
      kk: "Баға қою",
      ru: "Поставить оценку",
      en: "Record Grade",
    },
    recordAchievement: {
      kk: "Жетістік тіркеу",
      ru: "Записать достижение",
      en: "Record Achievement",
    },
    analytics: {
      kk: "Аналитика",
      ru: "Аналитика",
      en: "Analytics",
    },
    manageEvents: {
      kk: "Іс-шараларды басқару",
      ru: "Управление мероприятиями",
      en: "Manage Events",
    },
    kioskMode: {
      kk: "Киоск режимі",
      ru: "Режим киоска",
      en: "Kiosk Mode",
    },
  },

  // Login
  login: {
    title: {
      kk: "Кіру",
      ru: "Вход",
      en: "Sign In",
    },
    subtitle: {
      kk: "Порталға кіру үшін деректеріңізді енгізіңіз",
      ru: "Введите данные для входа в портал",
      en: "Enter your credentials to access the portal",
    },
    email: {
      kk: "Электрондық пошта",
      ru: "Электронная почта",
      en: "Email",
    },
    password: {
      kk: "Құпия сөз",
      ru: "Пароль",
      en: "Password",
    },
    enterEmail: {
      kk: "Поштаңызды енгізіңіз",
      ru: "Введите вашу почту",
      en: "Enter your email",
    },
    enterPassword: {
      kk: "Құпия сөзді енгізіңіз",
      ru: "Введите пароль",
      en: "Enter your password",
    },
    signingIn: {
      kk: "Кіруде...",
      ru: "Вход...",
      en: "Signing in...",
    },
    quickDemoAccess: {
      kk: "Жылдам демо кіру:",
      ru: "Быстрый демо-доступ:",
      en: "Quick Demo Access:",
    },
    loginFailed: {
      kk: "Кіру сәтсіз болды",
      ru: "Ошибка входа",
      en: "Login failed",
    },
  },

  // Dashboard
  dashboard: {
    welcomeMessage: {
      kk: "Қош келдіңіз",
      ru: "Добро пожаловать",
      en: "Welcome",
    },
    academicOverview: {
      kk: "Міне сіздің осы тоқсандағы академиялық шолуыңыз",
      ru: "Вот ваш академический обзор за эту четверть",
      en: "Here's your academic overview for this quarter",
    },
    average: {
      kk: "Орташа",
      ru: "Средний",
      en: "Average",
    },
    points: {
      kk: "Ұпайлар",
      ru: "Баллы",
      en: "Points",
    },
    rank: {
      kk: "Орын",
      ru: "Место",
      en: "Rank",
    },
    subjects: {
      kk: "Пәндер",
      ru: "Предметы",
      en: "Subjects",
    },
    subjectPerformance: {
      kk: "Пәндер бойынша үлгерім",
      ru: "Успеваемость по предметам",
      en: "Subject Performance",
    },
    yourGradesAcrossSubjects: {
      kk: "Барлық пәндер бойынша бағаларыңыз",
      ru: "Ваши оценки по всем предметам",
      en: "Your grades across all subjects",
    },
    recentAchievements: {
      kk: "Соңғы жетістіктер",
      ru: "Последние достижения",
      en: "Recent Achievements",
    },
    yourAccomplishments: {
      kk: "Осы жылғы жетістіктеріңіз",
      ru: "Ваши достижения в этом году",
      en: "Your accomplishments this year",
    },
    noAchievementsYet: {
      kk: "Әзірге жетістіктер жоқ",
      ru: "Пока нет достижений",
      en: "No achievements yet",
    },
    upcomingEvents: {
      kk: "Алдағы іс-шаралар",
      ru: "Предстоящие мероприятия",
      en: "Upcoming Events",
    },
    whatsHappeningAtSchool: {
      kk: "Мектептегі жаңалықтар",
      ru: "Что происходит в школе",
      en: "What's happening at school",
    },
    noUpcomingEvents: {
      kk: "Алдағы іс-шаралар жоқ",
      ru: "Нет предстоящих мероприятий",
      en: "No upcoming events",
    },
    startConversation: {
      kk: "Сөйлесуді бастау",
      ru: "Начать разговор",
      en: "Start Conversation",
    },
    aiMentorDescription: {
      kk: "Бағаларыңызды жақсарту, мансап бағдары және оқу кеңестері бойынша AI тәлімгеріңізден жеке кеңес алыңыз.",
      ru: "Получите персональные советы от AI-наставника по улучшению оценок, карьере и учёбе.",
      en: "Get personalized advice on improving your grades, career guidance, and study tips from your AI mentor.",
    },
    totalStudents: {
      kk: "Барлық оқушылар",
      ru: "Всего учеников",
      en: "Total Students",
    },
    classAverage: {
      kk: "Сынып орташасы",
      ru: "Средний балл класса",
      en: "Class Average",
    },
    atRisk: {
      kk: "Қауіпте",
      ru: "В зоне риска",
      en: "At Risk",
    },
    recordGrade: {
      kk: "Баға қою",
      ru: "Поставить оценку",
      en: "Record Grade",
    },
    addNewGrade: {
      kk: "Оқушыға жаңа баға қою",
      ru: "Поставить новую оценку ученику",
      en: "Add a new grade for a student",
    },
    recordAchievement: {
      kk: "Жетістік тіркеу",
      ru: "Записать достижение",
      en: "Record Achievement",
    },
    awardAchievement: {
      kk: "Оқушыға жетістік беру",
      ru: "Наградить ученика достижением",
      en: "Award an achievement to a student",
    },
    atRiskStudents: {
      kk: "Қауіптегі оқушылар",
      ru: "Отстающие ученики",
      en: "At-Risk Students",
    },
    studentsNeedingSupport: {
      kk: "Қосымша қолдау қажет оқушылар",
      ru: "Ученики, нуждающиеся в дополнительной поддержке",
      en: "Students needing additional support",
    },
    strugglingIn: {
      kk: "Қиналып жатыр:",
      ru: "Затрудняется в:",
      en: "Struggling in:",
    },
    lowOverallAverage: {
      kk: "Төмен жалпы орташа",
      ru: "Низкий общий средний балл",
      en: "Low overall average",
    },
    allStudentsPerformingWell: {
      kk: "Барлық оқушылар жақсы үлгеріммен оқып жатыр!",
      ru: "Все ученики показывают хорошую успеваемость!",
      en: "All students are performing well!",
    },
    subjectAverages: {
      kk: "Пәндер бойынша орташа",
      ru: "Средние баллы по предметам",
      en: "Subject Averages",
    },
    classPerformanceBySubject: {
      kk: "Пәндер бойынша сынып үлгерімі",
      ru: "Успеваемость класса по предметам",
      en: "Class performance by subject",
    },
    schoolCalendar: {
      kk: "Мектеп күнтізбесі",
      ru: "Школьный календарь",
      en: "School calendar",
    },
    teacherDashboard: {
      kk: "Мұғалім тақтасы",
      ru: "Панель учителя",
      en: "Teacher Dashboard",
    },
    overviewOfStudents: {
      kk: "Оқушылар мен сынып үлгерімінің шолуы",
      ru: "Обзор учеников и успеваемости класса",
      en: "Overview of your students and class performance",
    },
    childProgress: {
      kk: "Балаңыздың үлгерімі",
      ru: "Прогресс вашего ребёнка",
      en: "Your child's progress",
    },
    monitorChildAcademic: {
      kk: "Балаңыздың академиялық жолын бақылаңыз",
      ru: "Отслеживайте академический путь вашего ребёнка",
      en: "Monitor your child's academic journey",
    },
    schoolOverview: {
      kk: "Мектеп шолуы",
      ru: "Обзор школы",
      en: "School Overview",
    },
    schoolWideAnalytics: {
      kk: "Мектеп бойынша аналитика мен басқару",
      ru: "Аналитика и управление по всей школе",
      en: "School-wide analytics and management",
    },
    totalTeachers: {
      kk: "Барлық мұғалімдер",
      ru: "Всего учителей",
      en: "Total Teachers",
    },
    totalEvents: {
      kk: "Барлық іс-шаралар",
      ru: "Всего мероприятий",
      en: "Total Events",
    },
    viewAnalytics: {
      kk: "Аналитиканы көру",
      ru: "Посмотреть аналитику",
      en: "View Analytics",
    },
    manageKiosk: {
      kk: "Киоскті басқару",
      ru: "Управление киоском",
      en: "Manage Kiosk",
    },
    configureKiosk: {
      kk: "Киоск дисплейін баптау",
      ru: "Настроить дисплей киоска",
      en: "Configure kiosk display",
    },
  },

  // Kiosk
  kiosk: {
    loadingKiosk: {
      kk: "Киоск жүктелуде...",
      ru: "Загрузка киоска...",
      en: "Loading Kiosk...",
    },
    topStudents: {
      kk: "Үздік оқушылар",
      ru: "Лучшие ученики",
      en: "Top Students",
    },
    events: {
      kk: "Іс-шаралар",
      ru: "Мероприятия",
      en: "Events",
    },
    achievements: {
      kk: "Жетістіктер",
      ru: "Достижения",
      en: "Achievements",
    },
    upcomingEvents: {
      kk: "Алдағы іс-шаралар",
      ru: "Предстоящие мероприятия",
      en: "Upcoming Events",
    },
    recentAchievements: {
      kk: "Соңғы жетістіктер",
      ru: "Последние достижения",
      en: "Recent Achievements",
    },
    featured: {
      kk: "Таңдаулы",
      ru: "Избранное",
      en: "Featured",
    },
    pts: {
      kk: "ұпай",
      ru: "очки",
      en: "pts",
    },
    welcomeToSchool: {
      kk: "Ақбөбек Лицейіне қош келдіңіз - Білімдегі үздіктік",
      ru: "Добро пожаловать в Лицей Акбобек - Совершенство в образовании",
      en: "Welcome to Aqbobek Lyceum - Excellence in Education",
    },
    congratsTopStudents: {
      kk: "Үздік оқушыларымызды құттықтаймыз!",
      ru: "Поздравляем наших лучших учеников!",
      en: "Congratulations to all our top-performing students!",
    },
    visitPortal: {
      kk: "Толық ақпарат үшін мектеп порталына кіріңіз",
      ru: "Посетите школьный портал для получения дополнительной информации",
      en: "Visit the school portal for more information",
    },
  },

  // AI Mentor
  aiMentor: {
    title: {
      kk: "AI Тәлімгер",
      ru: "AI Наставник",
      en: "AI Mentor",
    },
    yourPersonalAdvisor: {
      kk: "Сіздің жеке академиялық кеңесшіңіз",
      ru: "Ваш персональный академический советник",
      en: "Your personal academic advisor",
    },
    chatWithMentor: {
      kk: "Тәлімгермен сөйлесу",
      ru: "Чат с наставником",
      en: "Chat with Your Mentor",
    },
    askAboutStrategies: {
      kk: "Оқу стратегиялары, мансап бағдары немесе академиялық кеңес туралы сұраңыз",
      ru: "Спросите о стратегиях обучения, карьере или академических советах",
      en: "Ask about study strategies, career guidance, or academic advice",
    },
    hello: {
      kk: "Сәлем",
      ru: "Привет",
      en: "Hello",
    },
    imYourMentor: {
      kk: "Мен сіздің AI тәлімгеріңізмін. Академиялық үлгеріміңізге негізделген жеке кеңес бере аламын. Нені талқылағыңыз келеді?",
      ru: "Я ваш AI-наставник. Могу дать персональные советы на основе вашей успеваемости. О чём хотите поговорить?",
      en: "I'm your AI mentor. I can provide personalized advice based on your academic performance. What would you like to discuss?",
    },
    askYourMentor: {
      kk: "AI тәлімгеріңізден сұраңыз...",
      ru: "Спросите AI-наставника...",
      en: "Ask your AI mentor...",
    },
    aiProvidesGeneral: {
      kk: "AI Тәлімгер жалпы бағыт береді. Нақты академиялық сұрақтар бойынша мұғалімдерге хабарласыңыз.",
      ru: "AI Наставник даёт общие рекомендации. По конкретным вопросам обращайтесь к учителям.",
      en: "AI Mentor provides general guidance. Consult teachers for specific academic questions.",
    },
    suggestedQuestions: {
      improve: {
        kk: "Бағаларымды жақсарту үшін неге назар аударуым керек?",
        ru: "На чём мне сосредоточиться, чтобы улучшить оценки?",
        en: "What should I focus on to improve my grades?",
      },
      career: {
        kk: "Күшті жақтарыма сүйене отырып, қандай мамандықтарды қарастыруым керек?",
        ru: "Какие профессии мне подойдут, исходя из моих сильных сторон?",
        en: "Based on my strengths, what careers should I consider?",
      },
      studyTips: {
        kk: "Әлсіз пәндерім бойынша оқу кеңестерін беріңіз",
        ru: "Дайте советы по учёбе для моих слабых предметов",
        en: "Give me study tips for my weakest subjects",
      },
      university: {
        kk: "Университетке түсу емтихандарына қалай дайындалуым керек?",
        ru: "Как мне подготовиться к вступительным экзаменам?",
        en: "How can I prepare for university entrance exams?",
      },
    },
    unavailable: {
      kk: "AI тәлімгер қазір қол жетімсіз",
      ru: "AI-наставник сейчас недоступен",
      en: "AI mentor is unavailable",
    },
  },

  // Categories
  categories: {
    exam: {
      kk: "Емтихан",
      ru: "Экзамен",
      en: "Exam",
    },
    holiday: {
      kk: "Демалыс",
      ru: "Каникулы",
      en: "Holiday",
    },
    sports: {
      kk: "Спорт",
      ru: "Спорт",
      en: "Sports",
    },
    cultural: {
      kk: "Мәдени",
      ru: "Культурное",
      en: "Cultural",
    },
    academic: {
      kk: "Академиялық",
      ru: "Академическое",
      en: "Academic",
    },
    arts: {
      kk: "Өнер",
      ru: "Искусство",
      en: "Arts",
    },
    competition: {
      kk: "Жарыс",
      ru: "Соревнование",
      en: "Competition",
    },
    other: {
      kk: "Басқа",
      ru: "Другое",
      en: "Other",
    },
  },

  // Role Labels
  roleLabels: {
    student: {
      kk: "Оқушы",
      ru: "Ученик",
      en: "Student",
    },
    teacher: {
      kk: "Мұғалім",
      ru: "Учитель",
      en: "Teacher",
    },
    parent: {
      kk: "Ата-ана",
      ru: "Родитель",
      en: "Parent",
    },
    admin: {
      kk: "Әкімші",
      ru: "Администратор",
      en: "Administrator",
    },
  },
} as const

export type TranslationKey = keyof typeof translations
