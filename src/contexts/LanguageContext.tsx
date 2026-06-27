'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type Language = 'en' | 'id'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
  isLoaded: boolean
}

const translations = {
  en: {
    home: 'Home',
    services: 'Services',
    portfolio: 'Portfolio',
    blog: 'Blog',
    contact: 'Contact',
    about: 'About Us',
    marketplace: 'Marketplace',
    affiliate: 'Affiliate',
    // Hero section
    heroTitle: 'We\nYour Best\nBusiness Solution',
    heroSubtitle: 'We help your business connect with audiences more easily and quickly. Let\'s start now!',
    contactUs: 'Contact Us',
    getStarted: 'Get Started',
    learnMore: 'Learn More',
    // Services
    servicesTitle: 'Our Services',
    servicesSubtitle: 'Comprehensive digital solutions for your business needs',
    companyProfile: 'Company Profile Website',
    companyProfileDesc: 'Professional corporate websites that showcase your brand and values',
    onlineShop: 'E-Commerce Website',
    onlineShopDesc: 'Complete online store solutions with payment integration and inventory management',
    customDev: 'Custom Website & Mobile App',
    customDevDesc: 'Tailored web and mobile applications built to your specific requirements',
    landingPage: 'Landing Page',
    landingPageDesc: 'High-converting landing pages designed to maximize your marketing campaigns',
    newsPortal: 'News Portal Website',
    newsPortalDesc: 'Dynamic news and content management systems with modern publishing tools',
    readyToStart: 'Ready to Start Your Project?',
    letsDiscuss: 'Let\'s discuss your requirements and create something amazing together.',
    getFreeConsultation: 'Get Free Consultation',
    // About
    aboutTitle: 'About Us',
    aboutSubtitle: 'We are a passionate team of developers and designers committed to creating exceptional digital experiences.',
    aboutDescription: 'With years of experience in web development, we create innovative solutions that help businesses grow and succeed in the digital world.',
    whyChoose: 'Why Choose BikinCode Solution?',
    expertTeam: 'Expert Team',
    expertTeamDesc: 'Our skilled developers and designers bring years of experience to every project.',
    modernTech: 'Modern Technology',
    modernTechDesc: 'We use the latest technologies and best practices to ensure your project is future-proof.',
    support247: '24/7 Support',
    support247Desc: 'We provide ongoing support and maintenance to keep your systems running smoothly.',
    ourMission: 'Our Mission',
    missionDesc: 'To empower businesses with innovative digital solutions that drive growth, enhance user experiences, and create lasting value in the digital landscape.',
    meetTeam: 'Meet Our Team',
    happyClients: 'Happy Clients',
    projectsCompleted: 'Projects Completed',
    yearsExperience: 'Years Experience',
    clientSatisfaction: 'Client Satisfaction',
    // Portfolio
    portfolioTitle: 'Our Portfolio',
    portfolioSubtitle: 'Explore our latest projects and see how we\'ve helped businesses achieve their digital goals.',
    portfolioDescription: 'Take a look at some of our recent projects and see how we\'ve helped businesses achieve their goals.',
    all: 'All',
    mobileApp: 'Mobile App',
    customSystem: 'Custom System',
    viewAllProjects: 'View All Projects',
    // Contact
    contactTitle: 'Get In Touch',
    contactSubtitle: 'Ready to start your project? Contact us today',
    contactDescription: 'We\'d love to hear from you. Send us a message and we\'ll respond as soon as possible.',
    letsStart: 'Let\'s Start a Conversation',
    email: 'Email',
    phone: 'Phone',
    office: 'Office',
    businessHours: 'Business Hours',
    mondayFriday: 'Monday - Friday',
    saturday: 'Saturday',
    sunday: 'Sunday',
    closed: 'Closed',
    fullName: 'Full Name',
    emailAddress: 'Email Address',
    subject: 'Subject',
    message: 'Message',
    yourFullName: 'Your full name',
    yourEmail: 'your@email.com',
    whatsThis: 'What\'s this about?',
    tellUs: 'Tell us about your project...',
    sendMessage: 'Send Message',
    // Footer
    footerDesc: 'Professional web development solutions for modern businesses',
    quickLinks: 'Quick Links',
    followUs: 'Follow Us',
    subscribeNewsletter: 'Subscribe to Newsletter',
    yourEmail: 'Your email',
    allRightsReserved: 'All rights reserved.',
    privacyPolicy: 'Privacy Policy',
    termsOfService: 'Terms of Service',
    sitemap: 'Sitemap',
    // Common
    readMore: 'Read More',
    viewAll: 'View All',
    sendMessage: 'Send Message',
    // Marketplace
    marketplaceTitle: 'Marketplace',
    marketplaceSubtitle: 'Discover and purchase premium digital solutions for your business.',
    marketplaceComingSoon: 'Marketplace Coming Soon',
    marketplaceDesc: 'We\'re building an amazing marketplace where you can find and purchase premium templates, plugins, and digital solutions. Stay tuned!',
    // Affiliate
    affiliateTitle: 'Affiliate Program',
    affiliateSubtitle: 'Join our affiliate program and earn commissions by referring clients to our services.',
    affiliateComingSoon: 'Affiliate Program Coming Soon',
    affiliateDesc: 'We\'re launching an exciting affiliate program where you can earn generous commissions by referring clients to our web development services. Stay tuned!',
    // Blog
    blogTitle: 'Blog',
    blogSubtitle: 'Stay updated with the latest trends in web development and technology.',
    blogComingSoon: 'Blog Coming Soon',
    blogDesc: 'We\'re working on bringing you insightful articles about web development, design trends, and technology insights. Stay tuned!',
  },
  id: {
    home: 'Beranda',
    services: 'Layanan',
    portfolio: 'Portofolio',
    blog: 'Blog',
    contact: 'Kontak',
    about: 'Tentang Kami',
    marketplace: 'Marketplace',
    affiliate: 'Afiliasi',
    // Hero section
    heroTitle: 'Kami\nSolusi Bisnis\nTerbaik Anda',
    heroSubtitle: 'Kami membantu bisnis Anda terhubung dengan audiens secara lebih mudah dan cepat. Mari mulai sekarang!',
    contactUs: 'Hubungi Kami',
    getStarted: 'Mulai Sekarang',
    learnMore: 'Pelajari Lebih Lanjut',
    // Services
    servicesTitle: 'Layanan Kami',
    servicesSubtitle: 'Solusi digital menyeluruh untuk kebutuhan bisnis Anda',
    companyProfile: 'Website Company Profile',
    companyProfileDesc: 'Website korporat profesional yang menampilkan brand dan nilai perusahaan Anda',
    onlineShop: 'Website E-Commerce',
    onlineShopDesc: 'Solusi toko online lengkap dengan integrasi pembayaran dan manajemen inventori',
    customDev: 'Website & Aplikasi Mobile Custom',
    customDevDesc: 'Aplikasi web dan mobile yang disesuaikan dengan kebutuhan spesifik Anda',
    landingPage: 'Landing Page',
    landingPageDesc: 'Landing page dengan tingkat konversi tinggi untuk memaksimalkan kampanye pemasaran Anda',
    newsPortal: 'Website Portal Berita',
    newsPortalDesc: 'Sistem manajemen berita dan konten dinamis dengan tools publishing modern',
    readyToStart: 'Siap Memulai Proyek Anda?',
    letsDiscuss: 'Mari diskusikan kebutuhan Anda dan ciptakan sesuatu yang luar biasa bersama-sama.',
    getFreeConsultation: 'Konsultasi Gratis',
    // About
    aboutTitle: 'Tentang Kami',
    aboutSubtitle: 'Kami adalah tim developer dan desainer berpengalaman yang berkomitmen menciptakan pengalaman digital yang luar biasa.',
    aboutDescription: 'Dengan pengalaman bertahun-tahun dalam pengembangan web, kami menciptakan solusi inovatif yang membantu bisnis berkembang dan sukses di era digital.',
    whyChoose: 'Mengapa Memilih BikinCode Solution?',
    expertTeam: 'Tim Ahli',
    expertTeamDesc: 'Developer dan desainer berpengalaman kami menghadirkan keahlian bertahun-tahun di setiap proyek.',
    modernTech: 'Teknologi Terdepan',
    modernTechDesc: 'Kami menggunakan teknologi terbaru dan praktik terbaik untuk memastikan proyek Anda siap menghadapi masa depan.',
    support247: 'Dukungan 24/7',
    support247Desc: 'Kami menyediakan dukungan berkelanjutan dan pemeliharaan untuk menjaga sistem Anda tetap berjalan optimal.',
    ourMission: 'Misi Kami',
    missionDesc: 'Memberdayakan bisnis dengan solusi digital inovatif yang mendorong pertumbuhan, meningkatkan pengalaman pengguna, dan menciptakan nilai berkelanjutan di era digital.',
    meetTeam: 'Tim Kami',
    happyClients: 'Klien Puas',
    projectsCompleted: 'Proyek Selesai',
    yearsExperience: 'Tahun Pengalaman',
    clientSatisfaction: 'Kepuasan Klien',
    // Portfolio
    portfolioTitle: 'Portofolio Kami',
    portfolioSubtitle: 'Jelajahi proyek-proyek terbaru kami dan lihat bagaimana kami membantu bisnis mencapai tujuan digitalnya.',
    portfolioDescription: 'Lihat beberapa proyek terbaru kami dan bagaimana kami membantu bisnis mencapai tujuannya.',
    all: 'Semua',
    mobileApp: 'Aplikasi Mobile',
    customSystem: 'Sistem Custom',
    viewAllProjects: 'Lihat Semua Proyek',
    // Contact
    contactTitle: 'Hubungi Kami',
    contactSubtitle: 'Siap memulai proyek Anda? Hubungi kami hari ini',
    contactDescription: 'Kami senang mendengar dari Anda. Kirimkan pesan dan kami akan merespons secepatnya.',
    letsStart: 'Mari Mulai Percakapan',
    email: 'Email',
    phone: 'Telepon',
    office: 'Kantor',
    businessHours: 'Jam Operasional',
    mondayFriday: 'Senin - Jumat',
    saturday: 'Sabtu',
    sunday: 'Minggu',
    closed: 'Tutup',
    fullName: 'Nama Lengkap',
    emailAddress: 'Alamat Email',
    subject: 'Subjek',
    message: 'Pesan',
    yourFullName: 'Nama lengkap Anda',
    yourEmail: 'email@anda.com',
    whatsThis: 'Tentang apa ini?',
    tellUs: 'Ceritakan tentang proyek Anda...',
    sendMessage: 'Kirim Pesan',
    // Footer
    footerDesc: 'Solusi pengembangan web profesional untuk bisnis modern',
    quickLinks: 'Tautan Cepat',
    followUs: 'Ikuti Kami',
    subscribeNewsletter: 'Berlangganan Newsletter',
    yourEmail: 'Email Anda',
    allRightsReserved: 'Hak cipta dilindungi.',
    privacyPolicy: 'Kebijakan Privasi',
    termsOfService: 'Syarat Layanan',
    sitemap: 'Peta Situs',
    // Common
    readMore: 'Selengkapnya',
    viewAll: 'Lihat Semua',
    sendMessage: 'Kirim Pesan',
    // Marketplace
    marketplaceTitle: 'Marketplace',
    marketplaceSubtitle: 'Temukan dan beli solusi digital premium untuk bisnis Anda.',
    marketplaceComingSoon: 'Marketplace Segera Hadir',
    marketplaceDesc: 'Kami sedang membangun marketplace yang luar biasa dimana Anda dapat menemukan dan membeli template premium, plugin, dan solusi digital. Nantikan!',
    // Affiliate
    affiliateTitle: 'Program Afiliasi',
    affiliateSubtitle: 'Bergabunglah dengan program afiliasi kami dan dapatkan komisi dengan merekomendasikan layanan kami.',
    affiliateComingSoon: 'Program Afiliasi Segera Hadir',
    affiliateDesc: 'Kami akan meluncurkan program afiliasi yang menarik dimana Anda dapat memperoleh komisi menarik dengan merekomendasikan layanan pengembangan web kami. Nantikan!',
    // Blog
    blogTitle: 'Blog',
    blogSubtitle: 'Tetap update dengan tren terbaru dalam pengembangan web dan teknologi.',
    blogComingSoon: 'Blog Segera Hadir',
    blogDesc: 'Kami sedang menyiapkan artikel-artikel menarik tentang pengembangan web, tren desain, dan insight teknologi. Nantikan!',
  }
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en')
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'id')) {
      setLanguageState(savedLanguage)
    }
    setIsLoaded(true)
  }, [])

  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage)
    localStorage.setItem('language', newLanguage)
  }

  const t = (key: string): string => {
    if (!isLoaded) return key
    const typedKey = key as keyof typeof translations.en
    return translations[language][typedKey] || translations.en[typedKey] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isLoaded }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}