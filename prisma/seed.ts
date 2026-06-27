import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create departments
  const engineering = await prisma.department.create({
    data: {
      name: 'Engineering',
      description: 'Software development and technical operations',
      budget: 500000,
    },
  })

  const hr = await prisma.department.create({
    data: {
      name: 'Human Resources',
      description: 'People operations and talent management',
      budget: 200000,
    },
  })

  const marketing = await prisma.department.create({
    data: {
      name: 'Marketing',
      description: 'Brand management and customer acquisition',
      budget: 300000,
    },
  })

  const sales = await prisma.department.create({
    data: {
      name: 'Sales',
      description: 'Revenue generation and client relationships',
      budget: 400000,
    },
  })

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 12)
  
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@company.com',
      firstName: 'Admin',
      lastName: 'User',
      password: hashedPassword,
      role: 'SUPER_ADMIN',
      status: 'ACTIVE',
      phone: '+1-555-0100',
    },
  })

  // Create department managers
  const engManager = await prisma.user.create({
    data: {
      email: 'john.smith@company.com',
      firstName: 'John',
      lastName: 'Smith',
      password: await bcrypt.hash('password123', 12),
      role: 'MANAGER',
      status: 'ACTIVE',
      departmentId: engineering.id,
      phone: '+1-555-0101',
    },
  })

  const hrManager = await prisma.user.create({
    data: {
      email: 'sarah.johnson@company.com',
      firstName: 'Sarah',
      lastName: 'Johnson',
      password: await bcrypt.hash('password123', 12),
      role: 'HR',
      status: 'ACTIVE',
      departmentId: hr.id,
      phone: '+1-555-0102',
    },
  })

  // Update departments with managers
  await prisma.department.update({
    where: { id: engineering.id },
    data: { managerId: engManager.id },
  })

  await prisma.department.update({
    where: { id: hr.id },
    data: { managerId: hrManager.id },
  })

  // Create employees
  const employees = [
    {
      email: 'mike.davis@company.com',
      firstName: 'Mike',
      lastName: 'Davis',
      departmentId: engineering.id,
      role: 'EMPLOYEE',
    },
    {
      email: 'emily.brown@company.com',
      firstName: 'Emily',
      lastName: 'Brown',
      departmentId: engineering.id,
      role: 'EMPLOYEE',
    },
    {
      email: 'david.wilson@company.com',
      firstName: 'David',
      lastName: 'Wilson',
      departmentId: marketing.id,
      role: 'EMPLOYEE',
    },
    {
      email: 'lisa.garcia@company.com',
      firstName: 'Lisa',
      lastName: 'Garcia',
      departmentId: sales.id,
      role: 'EMPLOYEE',
    },
    {
      email: 'james.martinez@company.com',
      firstName: 'James',
      lastName: 'Martinez',
      departmentId: sales.id,
      role: 'EMPLOYEE',
    },
  ]

  for (const employee of employees) {
    await prisma.user.create({
      data: {
        ...employee,
        password: await bcrypt.hash('password123', 12),
        status: 'ACTIVE',
        phone: `+1-555-${Math.floor(Math.random() * 9000) + 1000}`,
      },
    })
  }

  // Create some activities
  const activities = [
    {
      type: 'USER_CREATED',
      title: 'New employee joined',
      description: 'Mike Davis joined the Engineering department',
      createdById: adminUser.id,
    },
    {
      type: 'DEPARTMENT_CREATED',
      title: 'Department created',
      description: 'Engineering department was established',
      createdById: adminUser.id,
    },
    {
      type: 'SYSTEM_UPDATE',
      title: 'System maintenance',
      description: 'Scheduled system maintenance completed',
      createdById: adminUser.id,
    },
  ]

  for (const activity of activities) {
    await prisma.activity.create({
      data: activity,
    })
  }

  // Create company settings
  const settings = [
    {
      key: 'company_name',
      value: 'TechCorp Solutions',
      description: 'Official company name',
    },
    {
      key: 'working_hours_start',
      value: '09:00',
      description: 'Standard working hours start time',
    },
    {
      key: 'working_hours_end',
      value: '17:00',
      description: 'Standard working hours end time',
    },
    {
      key: 'annual_leave_days',
      value: '25',
      description: 'Annual leave entitlement in days',
    },
    {
      key: 'probation_period_months',
      value: '3',
      description: 'Probation period duration in months',
    },
    // Website branding settings
    {
      key: 'companyName',
      value: 'BikinCode',
      description: 'Company name displayed in navbar',
    },
    {
      key: 'companyLogo',
      value: '',
      description: 'Company logo URL',
    },
    {
      key: 'brandColor',
      value: '#2563eb',
      description: 'Primary brand color',
    },
    {
      key: 'adminName',
      value: 'Administrator',
      description: 'Administrator name',
    },
    {
      key: 'adminEmail',
      value: 'admin@bikincode.com',
      description: 'Administrator email',
    },
    {
      key: 'adminAvatar',
      value: '',
      description: 'Administrator profile picture URL',
    },
    {
      key: 'websiteTitle',
      value: 'BikinCode - Web Development Solutions',
      description: 'Website title for SEO',
    },
    {
      key: 'websiteDescription',
      value: 'Professional web development solutions for modern businesses',
      description: 'Website description for SEO',
    },
    {
      key: 'contactEmail',
      value: 'hello@bikincode.com',
      description: 'Contact email address',
    },
    {
      key: 'contactPhone',
      value: '+62 822 8188 3489',
      description: 'Contact phone number',
    },
  ]

  for (const setting of settings) {
    await prisma.companySettings.create({
      data: setting,
    })
  }

  console.log('✅ Database seeded successfully!')
  console.log('👤 Admin user: admin@company.com / admin123')
  console.log('👤 Manager user: john.smith@company.com / password123')
  console.log('👤 HR user: sarah.johnson@company.com / password123')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })