export interface Service {
  id: string
  slug: string
  title: {
    en: string
    id: string
  }
  subtitle: {
    en: string
    id: string
  }
  description: {
    en: string
    id: string
  }
  price: {
    en: string
    id: string
  }
  features: {
    en: string[]
    id: string[]
  }
  process: {
    en: string[]
    id: string[]
  }
  packages: {
    en: string[]
    id: string[]
  }
}

export const services: Service[] = [
  {
    id: '1',
    slug: 'company-profile-website',
    title: {
      en: 'Company Profile Website',
      id: 'Website Company Profile'
    },
    subtitle: {
      en: 'Professional appearance for your business',
      id: 'Tampilan profesional untuk bisnis Anda'
    },
    description: {
      en: 'Elegant and responsive company profile website to enhance your business credibility in the digital era.',
      id: 'Website company profile yang elegan dan responsif untuk meningkatkan kredibilitas bisnis Anda di era digital.'
    },
    price: {
      en: 'Starting from Rp 15 million',
      id: 'Mulai dari Rp 15 juta'
    },
    features: {
      en: ['Responsive Design', 'SEO Optimized', 'Fast Loading', 'Modern UI/UX'],
      id: ['Desain Responsif', 'SEO Optimized', 'Loading Cepat', 'UI/UX Modern']
    },
    process: {
      en: ['Consultation', 'Design', 'Development', 'Testing', 'Launch'],
      id: ['Konsultasi', 'Desain', 'Pengembangan', 'Testing', 'Peluncuran']
    },
    packages: {
      en: ['Basic Package', 'Professional Package', 'Enterprise Package'],
      id: ['Paket Basic', 'Paket Professional', 'Paket Enterprise']
    }
  },
  {
    id: '2',
    slug: 'ecommerce-website',
    title: {
      en: 'E-Commerce Website',
      id: 'Website E-Commerce'
    },
    subtitle: {
      en: 'E-commerce solution for online sales',
      id: 'Solusi e-commerce untuk penjualan online'
    },
    description: {
      en: 'Complete e-commerce platform with payment gateway integration and inventory management.',
      id: 'Platform e-commerce lengkap dengan integrasi payment gateway dan manajemen inventori.'
    },
    price: {
      en: 'Starting from Rp 25 million',
      id: 'Mulai dari Rp 25 juta'
    },
    features: {
      en: ['Payment Gateway', 'Product Management', 'Order Tracking', 'Admin Dashboard'],
      id: ['Payment Gateway', 'Manajemen Produk', 'Tracking Pesanan', 'Dashboard Admin']
    },
    process: {
      en: ['Requirement Analysis', 'Design', 'Development', 'Integration', 'Launch'],
      id: ['Analisis Kebutuhan', 'Desain', 'Pengembangan', 'Integrasi', 'Peluncuran']
    },
    packages: {
      en: ['Starter Package', 'Business Package', 'Premium Package'],
      id: ['Paket Starter', 'Paket Business', 'Paket Premium']
    }
  },
  {
    id: '3',
    slug: 'custom-website-system',
    title: {
      en: 'Custom Website & System',
      id: 'Website & Sistem Custom'
    },
    subtitle: {
      en: 'Custom solution for business needs',
      id: 'Solusi custom untuk kebutuhan bisnis'
    },
    description: {
      en: 'Tailored web application and system development to match your specific business requirements.',
      id: 'Pengembangan aplikasi web dan sistem yang disesuaikan dengan kebutuhan bisnis spesifik Anda.'
    },
    price: {
      en: 'Starting from Rp 30 million',
      id: 'Mulai dari Rp 30 juta'
    },
    features: {
      en: ['Custom Features', 'Scalable Architecture', 'API Integration', 'Database Design'],
      id: ['Fitur Custom', 'Arsitektur Scalable', 'Integrasi API', 'Desain Database']
    },
    process: {
      en: ['Discovery', 'Planning', 'Development', 'Testing', 'Deployment'],
      id: ['Discovery', 'Perencanaan', 'Pengembangan', 'Testing', 'Deployment']
    },
    packages: {
      en: ['Custom Quote Based on Requirements'],
      id: ['Penawaran Custom Sesuai Kebutuhan']
    }
  },
  {
    id: '4',
    slug: 'mobile-application',
    title: {
      en: 'Mobile Application',
      id: 'Aplikasi Mobile'
    },
    subtitle: {
      en: 'Android & iOS apps for your business',
      id: 'Aplikasi Android & iOS untuk bisnis Anda'
    },
    description: {
      en: 'Native and cross-platform mobile application development for Android and iOS.',
      id: 'Pengembangan aplikasi mobile native dan cross-platform untuk Android dan iOS.'
    },
    price: {
      en: 'Starting from Rp 40 million',
      id: 'Mulai dari Rp 40 juta'
    },
    features: {
      en: ['Cross-Platform', 'Push Notifications', 'Offline Mode', 'App Store Ready'],
      id: ['Cross-Platform', 'Push Notifications', 'Mode Offline', 'Siap App Store']
    },
    process: {
      en: ['Concept', 'UI/UX Design', 'Development', 'Testing', 'Publishing'],
      id: ['Konsep', 'Desain UI/UX', 'Pengembangan', 'Testing', 'Publishing']
    },
    packages: {
      en: ['Android Only', 'iOS Only', 'Both Platforms'],
      id: ['Android Saja', 'iOS Saja', 'Kedua Platform']
    }
  },
  {
    id: '5',
    slug: 'landing-page',
    title: {
      en: 'Landing Page',
      id: 'Landing Page'
    },
    subtitle: {
      en: 'Special page for marketing campaigns',
      id: 'Halaman khusus untuk kampanye marketing'
    },
    description: {
      en: 'High-converting landing page designed specifically for your marketing campaigns.',
      id: 'Landing page dengan konversi tinggi yang dirancang khusus untuk kampanye marketing Anda.'
    },
    price: {
      en: 'Starting from Rp 5 million',
      id: 'Mulai dari Rp 5 juta'
    },
    features: {
      en: ['Conversion Optimized', 'Fast Loading', 'Mobile Responsive', 'Analytics Integration'],
      id: ['Optimasi Konversi', 'Loading Cepat', 'Mobile Responsive', 'Integrasi Analytics']
    },
    process: {
      en: ['Brief', 'Design', 'Development', 'Launch'],
      id: ['Brief', 'Desain', 'Pengembangan', 'Peluncuran']
    },
    packages: {
      en: ['Single Page', 'Multi-Section', 'With A/B Testing'],
      id: ['Single Page', 'Multi-Section', 'Dengan A/B Testing']
    }
  },
  {
    id: '6',
    slug: 'news-portal-website',
    title: {
      en: 'News Portal Website',
      id: 'Website Portal Berita'
    },
    subtitle: {
      en: 'News platform with complete CMS',
      id: 'Platform berita dengan CMS lengkap'
    },
    description: {
      en: 'Complete news portal with content management system, categories, and user management.',
      id: 'Portal berita lengkap dengan sistem manajemen konten, kategori, dan manajemen pengguna.'
    },
    price: {
      en: 'Starting from Rp 20 million',
      id: 'Mulai dari Rp 20 juta'
    },
    features: {
      en: ['CMS', 'Multi-Author', 'Categories & Tags', 'Comment System'],
      id: ['CMS', 'Multi-Author', 'Kategori & Tag', 'Sistem Komentar']
    },
    process: {
      en: ['Planning', 'Design', 'Development', 'Content Migration', 'Launch'],
      id: ['Perencanaan', 'Desain', 'Pengembangan', 'Migrasi Konten', 'Peluncuran']
    },
    packages: {
      en: ['Basic CMS', 'Advanced CMS', 'Enterprise CMS'],
      id: ['CMS Basic', 'CMS Advanced', 'CMS Enterprise']
    }
  }
]
