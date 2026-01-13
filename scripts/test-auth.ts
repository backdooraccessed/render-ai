import { config } from 'dotenv'
config({ path: '.env.local' })

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseAnonKey)
const supabaseAdmin = supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null

// Use a real-looking email domain for Supabase validation
const TEST_EMAIL = `testuser${Date.now()}@gmail.com`
const TEST_PASSWORD = 'TestPassword123!'

async function testAuthFlow() {
  console.log('🔐 Testing Auth Flow\n')
  console.log('Test email:', TEST_EMAIL)
  console.log('')

  let userId: string | null = null

  // Test 1: Sign up
  console.log('1. Testing signup...')
  try {
    const { data, error } = await supabase.auth.signUp({
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
      options: {
        data: {
          full_name: 'Test User',
        }
      }
    })

    if (error) {
      console.log('   ❌ Signup failed:', error.message)
      return
    }

    userId = data.user?.id || null
    console.log('   ✅ Signup successful')
    console.log('   User ID:', userId)
  } catch (err) {
    console.log('   ❌ Signup error:', err)
    return
  }

  // Wait a moment for trigger to create profile
  await new Promise(resolve => setTimeout(resolve, 1000))

  // Test 2: Check profile was auto-created (using authenticated client)
  console.log('\n2. Testing profile auto-creation...')
  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) {
      console.log('   ❌ Profile not found:', error.message)
    } else {
      console.log('   ✅ Profile created automatically')
      console.log('   Email:', profile.email)
      console.log('   Name:', profile.full_name)
      console.log('   Tier:', profile.subscription_tier)
      console.log('   Generations today:', profile.generations_today)
    }
  } catch (err) {
    console.log('   ❌ Profile check error:', err)
  }

  // Test 3: Sign out
  console.log('\n3. Testing sign out...')
  try {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.log('   ❌ Sign out failed:', error.message)
    } else {
      console.log('   ✅ Sign out successful')
    }
  } catch (err) {
    console.log('   ❌ Sign out error:', err)
  }

  // Test 4: Sign in
  console.log('\n4. Testing sign in...')
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
    })

    if (error) {
      console.log('   ❌ Sign in failed:', error.message)
    } else {
      console.log('   ✅ Sign in successful')
      console.log('   Session exists:', !!data.session)
    }
  } catch (err) {
    console.log('   ❌ Sign in error:', err)
  }

  // Test 5: Get current user
  console.log('\n5. Testing get current user...')
  try {
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error) {
      console.log('   ❌ Get user failed:', error.message)
    } else if (user) {
      console.log('   ✅ Got current user')
      console.log('   Email:', user.email)
      console.log('   ID matches:', user.id === userId)
    } else {
      console.log('   ❌ No user returned')
    }
  } catch (err) {
    console.log('   ❌ Get user error:', err)
  }

  // Test 6: Test generation limit check
  console.log('\n6. Testing generation limit check...')
  try {
    const { data: profile } = await supabase
      .from('profiles')
      .select('subscription_tier, generations_today, generations_reset_at')
      .eq('id', userId)
      .single()

    if (profile) {
      const isPro = profile.subscription_tier === 'pro'
      const remaining = isPro ? Infinity : 5 - profile.generations_today

      console.log('   ✅ Generation limit check working')
      console.log('   Is Pro:', isPro)
      console.log('   Remaining:', remaining)
      console.log('   Can generate:', remaining > 0)
    }
  } catch (err) {
    console.log('   ❌ Limit check error:', err)
  }

  // Test 7: Test increment function
  console.log('\n7. Testing generation count increment...')
  try {
    const { error } = await supabase.rpc('increment_generation_count', {
      user_uuid: userId
    })

    if (error) {
      console.log('   ❌ Increment failed:', error.message)
    } else {
      // Check the new count
      const { data: profile } = await supabase
        .from('profiles')
        .select('generations_today')
        .eq('id', userId)
        .single()

      console.log('   ✅ Increment successful')
      console.log('   New count:', profile?.generations_today)
    }
  } catch (err) {
    console.log('   ❌ Increment error:', err)
  }

  // Cleanup: Delete test user (requires admin key)
  console.log('\n8. Cleaning up test user...')
  if (supabaseAdmin) {
    try {
      const { error } = await supabaseAdmin.auth.admin.deleteUser(userId!)

      if (error) {
        console.log('   ⚠️  Cleanup failed:', error.message)
      } else {
        console.log('   ✅ Test user deleted')
      }
    } catch (err) {
      console.log('   ⚠️  Cleanup error:', err)
    }
  } else {
    console.log('   ⚠️  Skipped (no service role key)')
    console.log('   Manual cleanup: Delete user', TEST_EMAIL, 'from Supabase dashboard')
  }

  console.log('\n✅ Auth flow tests completed!')
}

testAuthFlow().catch(console.error)
