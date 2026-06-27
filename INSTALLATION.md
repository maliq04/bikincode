# Installation Guide

## Quick Setup (Recommended)

Run the automated setup script:

```bash
npm run setup
```

This will:
- Install all dependencies
- Set up environment variables
- Initialize the database
- Seed with demo data
- Generate Prisma client

## Manual Setup

If you prefer to set up manually or the automated script fails:

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Setup

Create `.env.local` file in the root directory:

```env
# Database
DATABASE_URL="file:./dev.db"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-change-in-production"

# Email (optional)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"

# Company Settings
COMPANY_NAME="Your Company Name"
COMPANY_EMAIL="admin@yourcompany.com"
COMPANY_PHONE="+1-555-0123"
```

### 3. Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Create database and tables
npx prisma db push

# Seed with demo data
npx tsx prisma/seed.ts
```

### 4. Start Development Server

```bash
npm run dev
```

Visit `http://localhost:3000`

## Demo Accounts

After seeding, use these accounts to test:

- **Super Admin**: admin@company.com / admin123
- **Manager**: john.smith@company.com / password123
- **HR**: sarah.johnson@company.com / password123
- **Employee**: mike.davis@company.com / password123

## Troubleshooting

### Common Issues

1. **"Cannot find module" errors**
   - Run `npm install` to ensure all dependencies are installed
   - Delete `node_modules` and `package-lock.json`, then run `npm install`

2. **Database connection errors**
   - Check that `DATABASE_URL` is set correctly in `.env.local`
   - Run `npx prisma db push` to create the database

3. **Authentication errors**
   - Ensure `NEXTAUTH_SECRET` is set in `.env.local`
   - Check that `NEXTAUTH_URL` matches your development URL

4. **TypeScript errors**
   - Run `npx prisma generate` to generate types
   - Run `npm run type-check` to see all TypeScript issues

### Reset Database

To start fresh:

```bash
# Delete database
rm prisma/dev.db

# Recreate and seed
npx prisma db push
npx tsx prisma/seed.ts
```

### Production Setup

For production deployment:

1. **Database**: Switch to PostgreSQL or MySQL
2. **Environment**: Set production environment variables
3. **Build**: Run `npm run build`
4. **Deploy**: Use platforms like Vercel, Netlify, or Docker

## Next Steps

After installation:

1. Explore the admin dashboard at `/admin`
2. Test employee portal at `/employee`
3. Check out the API routes in `src/app/api/`
4. Customize the design in `src/app/globals.css`
5. Add new features in the respective directories

## Support

If you encounter issues:

1. Check this troubleshooting guide
2. Review the main README.md
3. Check the console for error messages
4. Ensure all dependencies are properly installed