// server/scripts/createNotificationsTable.js
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables');
  console.error('   SUPABASE_URL:', supabaseUrl ? '✓' : '✗');
  console.error('   SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? '✓' : '✗');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createNotificationsTable() {
  try {
    console.log('🚀 Starting notifications table migration...\n');

    // Read the SQL migration file
    const sqlPath = join(__dirname, 'migrations', '002_create_notifications_table.sql');
    const sql = readFileSync(sqlPath, 'utf8');

    console.log('📄 SQL Migration file loaded');
    console.log('━'.repeat(60));

    // Execute the SQL
    const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql });

    if (error) {
      // If exec_sql doesn't exist, we need to run it differently
      console.log('⚠️  exec_sql function not available, using direct query...\n');
      
      // Split SQL into individual statements and execute
      const statements = sql
        .split(';')
        .map(s => s.trim())
        .filter(s => s && !s.startsWith('--') && !s.startsWith('/*'));

      for (let i = 0; i < statements.length; i++) {
        const statement = statements[i];
        if (!statement) continue;

        console.log(`Executing statement ${i + 1}/${statements.length}...`);
        
        try {
          const { error: stmtError } = await supabase.from('_sql').select('*').limit(0);
          // This will fail, but we'll use the direct SQL approach below
          
          // Note: Supabase client doesn't support direct SQL execution
          // You'll need to run this in Supabase SQL Editor
          console.log('⚠️  Cannot execute SQL directly via client');
          console.log('📋 Please copy and paste the migration file into Supabase SQL Editor\n');
          console.log('Steps:');
          console.log('1. Go to: https://supabase.com/dashboard/project/' + supabaseUrl.split('.')[0].split('//')[1] + '/sql');
          console.log('2. Paste the content from: server/scripts/migrations/002_create_notifications_table.sql');
          console.log('3. Click "Run"\n');
          break;
        } catch (err) {
          // Expected
        }
      }
    } else {
      console.log('✅ Migration executed successfully!');
      console.log(data);
    }

    // Verify table exists
    console.log('\n🔍 Verifying notifications table...');
    const { data: tableData, error: tableError } = await supabase
      .from('notifications')
      .select('*')
      .limit(1);

    if (tableError) {
      if (tableError.code === '42P01') {
        console.log('\n⚠️  Table does not exist yet.');
        console.log('📋 Please run the SQL migration manually in Supabase SQL Editor:');
        console.log('   File: server/scripts/migrations/002_create_notifications_table.sql\n');
        console.log('🔗 Supabase SQL Editor:');
        const projectRef = supabaseUrl.split('.')[0].replace('https://', '');
        console.log(`   https://supabase.com/dashboard/project/${projectRef}/sql\n`);
      } else {
        console.log('❌ Error verifying table:', tableError.message);
      }
    } else {
      console.log('✅ Notifications table exists and is accessible!');
      console.log(`   Current records: ${tableData?.length || 0}\n`);
    }

    console.log('━'.repeat(60));
    console.log('✨ Migration process complete!\n');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run the migration
createNotificationsTable();
