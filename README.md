# BikinCode

A comprehensive company management system built with Next.js, TypeScript, Tailwind CSS, Prisma, and NextAuth.js.

## Features

### 🏢 Complete Company Management
- **Employee Management**: Full CRUD operations, role-based access, department assignments
- **Department Management**: Create and manage departments with budgets and managers
- **User Authentication**: Secure login with role-based permissions
- **Activity Tracking**: Real-time activity feed for all system actions
- **Dashboard Analytics**: Live statistics and performance metrics

### 🔐 Security & Authentication
- **NextAuth.js Integration**: Secure authentication with credentials provider
- **Role-Based Access Control**: Super Admin, Admin, HR, Manager, Employee roles
- **Protected Routes**: Middleware-based route protection
- **Password Hashing**: Secure password storage with bcrypt

### 📊 Data Management
- **Prisma ORM**: Type-safe database operations
- **SQLite Database**: Easy setup for development (easily switchable to PostgreSQL/MySQL)
- **Database Seeding**: Pre-populated demo data
- **Real-time Updates**: Live data synchronization

### 🎨 Modern UI/UX
- **Tailwind CSS**: Responsive, modern design system
- **Framer Motion**: Smooth animations and transitions
- **React Hook Form**: Efficient form handling with validation
- **Toast Notifications**: User feedback system
- **Loading States**: Skeleton loaders and loading indicators

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Database**: Prisma ORM with SQLite (production-ready for PostgreSQL/MySQL)
- **Authentication**: NextAuth.js with credentials provider
- **Forms**: React Hook Form with Zod validation
- **UI Components**: Headless UI, Lucide React icons
- **Charts**: Recharts for data visualization
- **File Handling**: Sharp for image processing, Multer for uploads
- **Email**: Nodemailer for notifications
- **Export**: XLSX and jsPDF for data export

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Set up Environment Variables
Copy `.env.local` and update the values:
```bash
# Database
DATABASE_URL="file:./dev.db"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here-change-in-production"

# Email (optional)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"

# Company Settings
COMPANY_NAME="Your Company Name"
COMPANY_EMAIL="admin@yourcompany.com"
```

### 3. Set up Database
```bash
# Generate Prisma client
npm run db:generate

# Push database schema
npm run db:push

# Seed with demo data
npm run db:seed
```

### 4. Start Development Server
```bash
npm run dev
```

Visit `http://localhost:3000` to see your application.

## Demo Accounts

After seeding, you can use these accounts:

- **Super Admin**: admin@company.com / admin123
- **Manager**: john.smith@company.com / password123
- **HR**: sarah.johnson@company.com / password123
- **Employee**: mike.davis@company.com / password123

## Project Structure

```
src/
├── app/                    # Next.js app router
│   ├── admin/             # Admin dashboard pages
│   ├── employee/          # Employee portal pages
│   ├── auth/              # Authentication pages
│   ├── api/               # API routes
│   └── globals.css        # Global styles
├── components/            # Reusable components
│   ├── admin/            # Admin-specific components
│   ├── employee/         # Employee-specific components
│   └── ui/               # Shared UI components
├── lib/                  # Utility functions
│   ├── auth.ts           # NextAuth configuration
│   ├── prisma.ts         # Prisma client
│   └── utils.ts          # Helper functions
├── types/                # TypeScript definitions
└── middleware.ts         # Route protection
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript compiler
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema to database
- `npm run db:migrate` - Run database migrations
- `npm run db:studio` - Open Prisma Studio
- `npm run db:seed` - Seed database with demo data

## Key Features Implementation

### Employee Management
- Complete CRUD operations
- Advanced search and filtering
- Bulk operations and export
- Role and department assignment
- Performance tracking

### Department Management
- Budget tracking
- Manager assignment
- Employee count monitoring
- Department analytics

### Authentication & Authorization
- Secure login system
- Role-based permissions
- Protected API routes
- Session management

### Dashboard Analytics
- Real-time statistics
- Activity monitoring
- Performance metrics
- Data visualization

### Responsive Design
- Mobile-first approach
- Tablet and desktop optimized
- Touch-friendly interfaces
- Accessibility compliant

## Production Deployment

### Database Migration
For production, switch to PostgreSQL or MySQL:

1. Update `DATABASE_URL` in `.env`
2. Change provider in `prisma/schema.prisma`
3. Run migrations: `npm run db:migrate`

### Environment Setup
- Set strong `NEXTAUTH_SECRET`
- Configure SMTP for email notifications
- Set up file upload storage
- Configure monitoring and logging

### Security Considerations
- Enable HTTPS
- Set up CORS policies
- Configure rate limiting
- Implement audit logging
- Regular security updates

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

---

Built with ❤️ using modern web technologies for scalable company management.