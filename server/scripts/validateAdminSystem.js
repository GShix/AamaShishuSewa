/**
 * Route and Function Validation Script
 * Tests all admin routes and controller functions
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

console.log('🔍 ADMIN SYSTEM VALIDATION REPORT\n');
console.log('='.repeat(60));

// Check environment variables
console.log('\n📋 1. ENVIRONMENT VARIABLES CHECK');
console.log('-'.repeat(60));
const requiredEnvVars = [
  'SUPABASE_URL',
  'SUPABASE_SERVICE_ROLE_KEY',
  'JWT_SECRET',
  'ADMIN_REGISTRATION_SECRET'
];

requiredEnvVars.forEach(envVar => {
  const exists = !!process.env[envVar];
  console.log(`${exists ? '✅' : '❌'} ${envVar}: ${exists ? 'Set' : 'Missing'}`);
});

// Import and validate controllers
console.log('\n📦 2. CONTROLLER IMPORTS CHECK');
console.log('-'.repeat(60));

let adminControllerExports = [];
let adminAuthControllerExports = [];

try {
  const adminController = await import('../src/controllers/admin/adminController.js');
  adminControllerExports = Object.keys(adminController);
  console.log(`✅ AdminController: ${adminControllerExports.length} functions exported`);
  console.log(`   Functions: ${adminControllerExports.join(', ')}`);
} catch (error) {
  console.log(`❌ AdminController: Import failed - ${error.message}`);
}

try {
  const adminAuthController = await import('../src/controllers/admin/adminAuthController.js');
  adminAuthControllerExports = Object.keys(adminAuthController);
  console.log(`✅ AdminAuthController: ${adminAuthControllerExports.length} functions exported`);
  console.log(`   Functions: ${adminAuthControllerExports.join(', ')}`);
} catch (error) {
  console.log(`❌ AdminAuthController: Import failed - ${error.message}`);
}

// Validate routes
console.log('\n🛣️  3. ROUTES VALIDATION');
console.log('-'.repeat(60));

try {
  const adminRoutes = await import('../src/routes/admin/admin.js');
  console.log('✅ Admin routes (/api/admin) loaded successfully');
} catch (error) {
  console.log(`❌ Admin routes failed: ${error.message}`);
}

try {
  const adminAuthRoutes = await import('../src/routes/admin/adminAuth.js');
  console.log('✅ AdminAuth routes (/api/admin/auth) loaded successfully');
} catch (error) {
  console.log(`❌ AdminAuth routes failed: ${error.message}`);
}

// Validate middleware
console.log('\n🛡️  4. MIDDLEWARE VALIDATION');
console.log('-'.repeat(60));

try {
  const authMiddleware = await import('../src/middleware/auth.js');
  const middlewareExports = Object.keys(authMiddleware);
  console.log(`✅ Auth Middleware: ${middlewareExports.length} exports`);
  console.log(`   Exports: ${middlewareExports.join(', ')}`);
  
  const requiredMiddleware = ['authenticate', 'requireAdmin', 'requireSuperAdmin'];
  requiredMiddleware.forEach(mw => {
    const exists = middlewareExports.includes(mw);
    console.log(`   ${exists ? '✅' : '❌'} ${mw}`);
  });
} catch (error) {
  console.log(`❌ Auth Middleware failed: ${error.message}`);
}

// Check database connection
console.log('\n🗄️  5. DATABASE CONNECTION CHECK');
console.log('-'.repeat(60));

try {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
  
  // Test connection by querying admins table
  const { data, error } = await supabase
    .from('admins')
    .select('count')
    .limit(1);
  
  if (error) {
    console.log(`⚠️  Admins table query: ${error.message}`);
    console.log('   Note: Run migration if table doesn\'t exist');
  } else {
    console.log('✅ Database connection successful');
    console.log('✅ Admins table is accessible');
  }
} catch (error) {
  console.log(`❌ Database connection failed: ${error.message}`);
}

// Validate expected route-controller mappings
console.log('\n🔗 6. ROUTE-CONTROLLER MAPPING VALIDATION');
console.log('-'.repeat(60));

const expectedMappings = {
  'Admin Management': [
    'getAllAdmins',
    'getAdminById',
    'createAdmin',
    'updateAdmin',
    'updateAdminPassword',
    'deleteAdmin',
    'getAdminStats'
  ],
  'User Management': [
    'getAllUsers',
    'getUserById',
    'updateUserStatus',
    'deleteUser'
  ],
  'Booking Management': [
    'getAllBookings',
    'updateBookingStatus',
    'deleteBooking'
  ],
  'Professional Management': [
    'getAllProfessionals',
    'createProfessional',
    'updateProfessional',
    'deleteProfessional'
  ],
  'Services Management': [
    'getAllServices',
    'createService',
    'updateService',
    'deleteService'
  ],
  'Notices Management': [
    'getAllNotices',
    'createNotice',
    'updateNotice',
    'deleteNotice'
  ],
  'Dashboard': [
    'getDashboardStats'
  ],
  'Authentication': [
    'adminLogin',
    'adminRegister',
    'getAdminProfile',
    'updateAdminProfile',
    'changeAdminPassword'
  ]
};

let totalExpected = 0;
let totalFound = 0;

Object.entries(expectedMappings).forEach(([category, functions]) => {
  console.log(`\n${category}:`);
  functions.forEach(func => {
    totalExpected++;
    const inAdminController = adminControllerExports.includes(func);
    const inAuthController = adminAuthControllerExports.includes(func);
    const found = inAdminController || inAuthController;
    if (found) totalFound++;
    
    console.log(`  ${found ? '✅' : '❌'} ${func} ${found ? '' : '(MISSING)'}`);
  });
});

// Summary
console.log('\n' + '='.repeat(60));
console.log('📊 VALIDATION SUMMARY');
console.log('='.repeat(60));
console.log(`Total Expected Functions: ${totalExpected}`);
console.log(`Total Found Functions: ${totalFound}`);
console.log(`Status: ${totalFound === totalExpected ? '✅ ALL FUNCTIONS PRESENT' : '⚠️  SOME FUNCTIONS MISSING'}`);

// API Endpoints Summary
console.log('\n📡 API ENDPOINTS AVAILABLE');
console.log('='.repeat(60));
console.log('\nAuthentication Routes (POST /api/admin/auth/...):');
console.log('  • /login - Admin login');
console.log('  • /register - Admin registration (requires secret key)');
console.log('  • /profile - Get admin profile (GET)');
console.log('  • /profile - Update admin profile (PUT)');
console.log('  • /change-password - Change password (PUT)');

console.log('\nAdmin Management Routes (SuperAdmin - /api/admin/admins/...):');
console.log('  • GET /stats - Get admin statistics');
console.log('  • GET / - Get all admins (with pagination)');
console.log('  • GET /:id - Get admin by ID');
console.log('  • POST / - Create new admin');
console.log('  • PUT /:id - Update admin');
console.log('  • PUT /:id/password - Reset admin password');
console.log('  • DELETE /:id - Delete admin');

console.log('\nContent Management Routes (All Admins - /api/admin/...):');
console.log('  • /dashboard/stats - Dashboard statistics');
console.log('  • /users - User management');
console.log('  • /bookings - Booking management');
console.log('  • /professionals - Professional management');
console.log('  • /services - Services management');
console.log('  • /notices - Notices management');

console.log('\n' + '='.repeat(60));
console.log('✨ VALIDATION COMPLETE');
console.log('='.repeat(60));
console.log('\n💡 Next Steps:');
console.log('  1. Run migration: Execute scripts/migrations/001_create_admins_table.sql');
console.log('  2. Insert admins: npm run admin:insert');
console.log('  3. Start server: npm run dev');
console.log('  4. Test endpoints using the examples in ADMIN_SETUP_README.md\n');

process.exit(0);
