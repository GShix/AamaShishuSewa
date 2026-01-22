/**
 * Script: Insert Initial Admin Users
 * Description: Creates initial superAdmin and admin users in the admins table
 * Usage: node scripts/insertAdmins.js
 */

import { supabaseAdmin } from '../src/config/supabase.js';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

// Initial admin users
const adminsToInsert = [
  {
    email: 'dambarsinggharti@gmail.com',
    password: 'SuperAdmin@123456',
    full_name: 'Dambar Gharti',
    phone: '9749778495',
    role: 'superAdmin',
    status: 'active'
  },
  {
    email: 'aamasisiusewa@gmail.com',
    password: 'Admin@123456',
    full_name: 'Dilip Bhattarai',
    phone: '9764651355',
    role: 'admin',
    status: 'active'
  }
];

const insertAdmins = async () => {
  try {
    console.log('🚀 Starting admin insertion into admins table...\n');

    for (const adminData of adminsToInsert) {
      console.log(`📝 Processing: ${adminData.full_name} (${adminData.email})`);

      // Check if admin already exists by email
      const { data: existingAdmin } = await supabaseAdmin
        .from('admins')
        .select('id, email, role')
        .eq('email', adminData.email)
        .single();

      if (existingAdmin) {
        console.log(`⚠️  Admin already exists: ${adminData.email}`);
        console.log(`   ID: ${existingAdmin.id}`);
        console.log(`   Role: ${existingAdmin.role}\n`);
        continue;
      }

      // Hash password
      const passwordHash = await bcrypt.hash(adminData.password, 12);

      // Insert admin into admins table
      const { data: newAdmin, error } = await supabaseAdmin
        .from('admins')
        .insert({
          email: adminData.email,
          password_hash: passwordHash,
          full_name: adminData.full_name,
          phone: adminData.phone,
          role: adminData.role,
          status: adminData.status,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        console.error(`❌ Error inserting ${adminData.email}:`, error.message);
        continue;
      }

      console.log(`✅ Successfully created: ${adminData.full_name}`);
      console.log(`   ID: ${newAdmin.id}`);
      console.log(`   Email: ${newAdmin.email}`);
      console.log(`   Phone: ${newAdmin.phone}`);
      console.log(`   Role: ${newAdmin.role}`);
      console.log(`   Status: ${newAdmin.status}`);
      console.log(`   Password: ${adminData.password}`);
      console.log(`   ⚠️  Please change password after first login!\n`);
    }

    console.log('✨ Admin insertion completed!\n');
    console.log('📋 Summary:');
    console.log('='.repeat(60));

    // Fetch all admins for summary
    const { data: allAdmins, error: fetchError } = await supabaseAdmin
      .from('admins')
      .select('id, email, full_name, role, status, created_at')
      .order('created_at', { ascending: true });

    if (fetchError) {
      console.error('❌ Error fetching admins:', fetchError.message);
    } else {
      console.log(`\nTotal Admins in Database: ${allAdmins.length}\n`);

      allAdmins.forEach((admin, index) => {
        console.log(`${index + 1}. ${admin.full_name}`);
        console.log(`   Email: ${admin.email}`);
        console.log(`   Role: ${admin.role}`);
        console.log(`   Status: ${admin.status}`);
        console.log(`   Created: ${new Date(admin.created_at).toLocaleString()}\n`);
      });
    }

    console.log('='.repeat(60));
    console.log('\n🔐 Default Login Credentials:');
    console.log('='.repeat(60));
    adminsToInsert.forEach(admin => {
      console.log(`\n${admin.role === 'superAdmin' ? '👑 SUPER ADMIN' : '👤 ADMIN'}: ${admin.full_name}`);
      console.log(`  Email: ${admin.email}`);
      console.log(`  Password: ${admin.password}`);
    });
    console.log('\n⚠️  IMPORTANT: Change these passwords after first login!');
    console.log('🔗 Login URL: http://localhost:5173/admin/login\n');

  } catch (error) {
    console.error('❌ Fatal error:', error);
  } finally {
    process.exit(0);
  }
};

// Run the script
insertAdmins();
