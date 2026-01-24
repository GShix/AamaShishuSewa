// Run migration to update posts table with image storage
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  db: { schema: 'public' }
});

async function runMigration() {
  try {
    console.log('🔄 Creating Posts Table with Database Image Storage...\n');

    // Read the migration file
    const migrationPath = path.join(__dirname, 'migrations', '007_create_posts_table.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

    console.log('📋 Migration SQL for Posts Table:\n');
    console.log('─'.repeat(80));
    console.log(migrationSQL);
    console.log('─'.repeat(80));
    console.log('\n⚠️  INSTRUCTIONS:');
    console.log('1. Go to your Supabase dashboard: https://supabase.com/dashboard');
    console.log('2. Select your project');
    console.log('3. Go to SQL Editor');
    console.log('4. Copy the migration SQL above');
    console.log('5. Paste and run it in the SQL Editor\n');
    console.log('✅ This will:');
    console.log('   - Drop any existing posts table');
    console.log('   - Create new posts table with image_data (BYTEA) column');
    console.log('   - Add image_type column for MIME type storage');
    console.log('   - Create all indexes and triggers');
    console.log('   - Insert 5 sample posts\n');
    console.log('📦 Features:');
    console.log('   ✓ Binary image storage in database');
    console.log('   ✓ Multiple categories (news, update, announcement, event, notice, alert)');
    console.log('   ✓ Priority levels (normal, high, urgent)');
    console.log('   ✓ Tag support with JSONB');
    console.log('   ✓ Auto-updating timestamps');
    console.log('   ✓ Publication workflow\n');

  } catch (error) {
    console.error('❌ Error reading migration file:', error);
    process.exit(1);
  }
}

runMigration();
