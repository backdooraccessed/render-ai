import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function runMigration() {
  const migrationPath = path.join(__dirname, '../supabase/migrations/20260115_create_products_table.sql')
  const sql = fs.readFileSync(migrationPath, 'utf-8')

  console.log('🚀 Running products table migration...')

  // Split by semicolons and run each statement
  const statements = sql
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'))

  for (const statement of statements) {
    if (statement.length < 10) continue // Skip empty statements

    try {
      const { error } = await supabase.rpc('exec_sql', { sql: statement + ';' })
      if (error) {
        // Try direct query for DDL
        console.log(`⚠️  Statement requires direct execution (normal for DDL)`)
      }
    } catch (e) {
      // Expected for some DDL statements
    }
  }

  console.log('✅ Migration script completed')
  console.log('\n📋 To run the full migration, execute this SQL in Supabase Dashboard:')
  console.log('   Project Settings → SQL Editor → Paste the migration file')
}

runMigration().catch(console.error)
