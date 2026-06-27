import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function initializeDefaultSettings() {
  const defaultSettings = [
    { key: 'companyName', value: 'BikinCode', description: 'Company name displayed in navbar' },
    { key: 'companyLogo', value: '', description: 'Company logo URL' },
    { key: 'brandColor', value: '#2563eb', description: 'Primary brand color' },
    { key: 'adminName', value: 'Administrator', description: 'Administrator name' },
    { key: 'adminEmail', value: 'admin@bikincode.com', description: 'Administrator email' },
    { key: 'adminAvatar', value: '', description: 'Administrator profile picture URL' },
    { key: 'websiteTitle', value: 'BikinCode - Web Development Solutions', description: 'Website title for SEO' },
    { key: 'websiteDescription', value: 'Professional web development solutions for modern businesses', description: 'Website description for SEO' },
    { key: 'contactEmail', value: 'hello@bikincode.com', description: 'Contact email address' },
    { key: 'contactPhone', value: '+62 822 8188 3489', description: 'Contact phone number' }
  ]

  try {
    for (const setting of defaultSettings) {
      await prisma.companySettings.upsert({
        where: { key: setting.key },
        update: {},
        create: setting
      })
    }
    console.log('✅ Default settings initialized')
  } catch (error) {
    console.error('❌ Error initializing settings:', error)
  } finally {
    await prisma.$disconnect()
  }
}