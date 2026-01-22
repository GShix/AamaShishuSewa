/**
 * Script: Insert Sample Users
 * Description: Creates 5 sample Nepali users in the users table
 * Usage: node scripts/insertUsers.js
 */

import { supabaseAdmin } from '../src/config/supabase.js';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

// Sample Nepali users
const usersToInsert = [
  {
    email: 'ram.sharma@gmail.com',
    password: 'User@123456',
    full_name: 'Ram Sharma',
    phone: '9841234567',
    role: 'user',
    status: 'active',
    gender: 'male',
    address: 'Kathmandu, Nepal'
  },
  {
    email: 'sita.tamang@gmail.com',
    password: 'User@123456',
    full_name: 'Sita Tamang',
    phone: '9851234568',
    role: 'user',
    status: 'active',
    gender: 'female',
    address: 'Pokhara, Nepal'
  },
  {
    email: 'hari.gurung@gmail.com',
    password: 'User@123456',
    full_name: 'Hari Gurung',
    phone: '9861234569',
    role: 'user',
    status: 'active',
    gender: 'male',
    address: 'Chitwan, Nepal'
  },
  {
    email: 'maya.thapa@gmail.com',
    password: 'User@123456',
    full_name: 'Maya Thapa',
    phone: '9871234570',
    role: 'user',
    status: 'active',
    gender: 'female',
    address: 'Lalitpur, Nepal'
  },
  {
    email: 'krishna.rai@gmail.com',
    password: 'User@123456',
    full_name: 'Krishna Rai',
    phone: '9881234571',
    role: 'user',
    status: 'active',
    gender: 'male',
    address: 'Bhaktapur, Nepal'
  }
];

const insertUsers = async () => {
  try {
    console.log('🚀 Starting user insertion into users table...\n');

    for (const userData of usersToInsert) {
      console.log(`📝 Processing: ${userData.full_name} (${userData.email})`);

      // Check if user already exists by email
      const { data: existingUser } = await supabaseAdmin
        .from('users')
        .select('id, email')
        .eq('email', userData.email)
        .single();

      if (existingUser) {
        console.log(`⚠️  User already exists: ${userData.email}`);
        console.log(`   ID: ${existingUser.id}\n`);
        continue;
      }

      // Hash password
      const passwordHash = await bcrypt.hash(userData.password, 12);

      // Insert user into users table
      const { data: newUser, error } = await supabaseAdmin
        .from('users')
        .insert({
          email: userData.email,
          password_hash: passwordHash,
          full_name: userData.full_name,
          phone: userData.phone,
          role: userData.role,
          status: userData.status,
          gender: userData.gender,
          address: userData.address,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        console.error(`❌ Error inserting ${userData.email}:`, error.message);
        continue;
      }

      console.log(`✅ Successfully created: ${userData.full_name}`);
      console.log(`   ID: ${newUser.id}`);
      console.log(`   Email: ${newUser.email}`);
      console.log(`   Phone: ${newUser.phone}`);
      console.log(`   Role: ${newUser.role}`);
      console.log(`   Status: ${newUser.status}\n`);
    }

    console.log('✨ User insertion completed!\n');
    console.log('📋 Summary:');
    console.log('='.repeat(60));

    // Fetch all users for summary
    const { data: allUsers, error: fetchError } = await supabaseAdmin
      .from('users')
      .select('id, email, full_name, role, status, phone, created_at')
      .order('created_at', { ascending: true });

    if (fetchError) {
      console.error('❌ Error fetching users:', fetchError.message);
    } else {
      console.log(`\nTotal Users in Database: ${allUsers.length}\n`);

      allUsers.forEach((user, index) => {
        console.log(`${index + 1}. ${user.full_name}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Phone: ${user.phone}`);
        console.log(`   Role: ${user.role}`);
        console.log(`   Status: ${user.status}`);
        console.log(`   Created: ${new Date(user.created_at).toLocaleString()}\n`);
      });
    }

    console.log('='.repeat(60));
    console.log('\n🔐 Sample User Credentials:');
    console.log('='.repeat(60));
    usersToInsert.forEach(user => {
      console.log(`\n👤 ${user.full_name}`);
      console.log(`  Email: ${user.email}`);
      console.log(`  Password: ${user.password}`);
      console.log(`  Phone: ${user.phone}`);
    });
    console.log('\n🔗 Login URL: http://localhost:5173/login\n');

  } catch (error) {
    console.error('❌ Fatal error:', error);
  } finally {
    process.exit(0);
  }
};

// Run the script
insertUsers();
