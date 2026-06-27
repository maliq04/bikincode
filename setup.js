#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up BikinCode...\n');

// Check if package.json exists
if (!fs.existsSync('package.json')) {
  console.error('❌ package.json not found. Please run this script from the project root.');
  process.exit(1);
}

try {
  // Install dependencies
  console.log('📦 Installing dependencies...');
  execSync('npm install', { stdio: 'inherit' });

  // Check if .env.local exists, if not create it
  if (!fs.existsSync('.env.local')) {
    console.log('⚙️  Creating .env.local file...');
    const envContent = `# Database
DATABASE_URL="file:./dev.db"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-change-in-production-${Math.random().toString(36).substring(2)}"

# Email (optional)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"

# Company Settings
COMPANY_NAME="Your Company Name"
COMPANY_EMAIL="admin@yourcompany.com"
COMPANY_PHONE="+1-555-0123"
`;
    fs.writeFileSync('.env.local', envContent);
  }

  // Generate Prisma client
  console.log('🗄️  Setting up database...');
  execSync('npx prisma generate', { stdio: 'inherit' });

  // Push database schema
  execSync('npx prisma db push', { stdio: 'inherit' });

  // Seed database
  console.log('🌱 Seeding database with demo data...');
  execSync('npx tsx prisma/seed.ts', { stdio: 'inherit' });

  console.log('\n✅ Setup complete!');
  console.log('\n🎉 Your BikinCode is ready!');
  console.log('\nTo start the development server:');
  console.log('  npm run dev');
  console.log('\nThen visit: http://localhost:3000');
  console.log('\nDemo accounts:');
  console.log('  Admin: admin@company.com / admin123');
  console.log('  Manager: john.smith@company.com / password123');
  console.log('  HR: sarah.johnson@company.com / password123');

} catch (error) {
  console.error('\n❌ Setup failed:', error.message);
  console.log('\nTry running the commands manually:');
  console.log('  npm install');
  console.log('  npx prisma generate');
  console.log('  npx prisma db push');
  console.log('  npx tsx prisma/seed.ts');
  process.exit(1);
}