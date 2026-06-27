#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const os = require('os');

console.log('🌐 Setting up BikinCode for Network Access...\n');

// Get local IP address
function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const interface of interfaces[name]) {
      if (interface.family === 'IPv4' && !interface.internal) {
        return interface.address;
      }
    }
  }
  return 'localhost';
}

const localIP = getLocalIP();
console.log(`📍 Detected local IP address: ${localIP}`);

// Update .env.local with network configuration
if (fs.existsSync('.env.local')) {
  let envContent = fs.readFileSync('.env.local', 'utf8');
  
  // Update NEXTAUTH_URL to use the local IP
  envContent = envContent.replace(
    /NEXTAUTH_URL="http:\/\/localhost:3000"/,
    `NEXTAUTH_URL="http://${localIP}:3000"`
  );
  
  fs.writeFileSync('.env.local', envContent);
  console.log('✅ Updated .env.local with network configuration');
} else {
  console.log('⚠️  .env.local not found. Run setup first: npm run setup');
  process.exit(1);
}

console.log('\n🚀 Network setup complete!');
console.log('\nTo start the server with network access:');
console.log('  npm run dev:network');
console.log('\nAccess URLs:');
console.log(`  Local:    http://localhost:3000`);
console.log(`  Network:  http://${localIP}:3000`);
console.log('\n📱 Other devices on the same network can access:');
console.log(`  http://${localIP}:3000`);
console.log('\n🔐 Demo accounts:');
console.log('  Admin: admin@company.com / admin123');
console.log('  Manager: john.smith@company.com / password123');
console.log('  HR: sarah.johnson@company.com / password123');

console.log('\n⚠️  Security Note:');
console.log('  This exposes your development server to your local network.');
console.log('  Only use this in trusted network environments.');
console.log('  For production, use proper security measures.');