# 🚀 Quick Start Guide

## Your BikinCode is Ready!

The development server is now running and accessible from other devices on your network.

## 🌐 Access URLs

- **Local Access**: http://localhost:3000
- **Network Access**: http://192.168.56.1:3000
- **Mobile/Other Devices**: http://192.168.56.1:3000

## 🔐 Demo Accounts

Use these accounts to test the system:

### Admin Dashboard Access
- **Super Admin**: admin@company.com / admin123
- **Manager**: john.smith@company.com / password123  
- **HR**: sarah.johnson@company.com / password123

### Employee Portal Access
- **Employee**: mike.davis@company.com / password123

## 📱 Testing on Mobile Devices

1. Make sure your mobile device is on the same WiFi network
2. Open your mobile browser
3. Go to: http://192.168.56.1:3000
4. Sign in with any of the demo accounts above

## 🎯 What to Test

### Admin Dashboard Features
- **Dashboard Overview**: Real-time statistics and activity feed
- **Employee Management**: Add, edit, search, and filter employees
- **Department Management**: Create and manage departments with budgets
- **Responsive Design**: Test on different screen sizes

### Employee Portal Features
- **Employee Dashboard**: Personal information and quick actions
- **Leave Requests**: Submit time-off requests (coming soon)
- **Expense Reports**: Submit business expenses (coming soon)

## 🛠️ Development Commands

```bash
# Stop the server
Ctrl+C (in the terminal)

# Restart with network access
npm run dev:network

# Restart locally only
npm run dev

# View database
npx prisma studio

# Reset database
rm prisma/dev.db
set DATABASE_URL=file:./dev.db && npx prisma db push
set DATABASE_URL=file:./dev.db && npx tsx prisma/seed.ts
```

## 🔧 Troubleshooting

### Can't Access from Other Devices?
1. Check that devices are on the same network
2. Verify firewall isn't blocking port 3000
3. Try restarting the server: `npm run dev:network`

### Database Issues?
1. Make sure DATABASE_URL is set: `set DATABASE_URL=file:./dev.db`
2. Regenerate database: `npx prisma db push`
3. Reseed data: `npx tsx prisma/seed.ts`

### Authentication Problems?
1. Clear browser cache and cookies
2. Try incognito/private browsing mode
3. Check that NEXTAUTH_URL matches your access URL

## 🎨 Customization

- **Styling**: Edit `src/app/globals.css` and `tailwind.config.js`
- **Components**: Modify files in `src/components/`
- **Database**: Update `prisma/schema.prisma`
- **API Routes**: Add new endpoints in `src/app/api/`

## 📊 Features Included

✅ **Complete Authentication System**
✅ **Role-Based Access Control**  
✅ **Employee Management**
✅ **Department Management**
✅ **Real-time Dashboard**
✅ **Responsive Design**
✅ **Network Access Ready**
✅ **Database with Demo Data**

## 🚀 Next Steps

1. **Test all features** on different devices
2. **Customize the design** to match your brand
3. **Add new features** like payroll, time tracking, etc.
4. **Deploy to production** when ready

---

**🎉 Enjoy your new BikinCode!**

The system is production-ready and can be easily deployed to platforms like Vercel, Netlify, or your own servers.