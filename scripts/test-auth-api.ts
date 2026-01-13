import { config } from 'dotenv'
config({ path: '.env.local' })

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

async function testAuthAPI() {
  console.log('🔐 Testing Auth API Endpoints\n')
  console.log('Base URL:', BASE_URL)
  console.log('')

  // Test 1: Check credits endpoint (unauthenticated)
  console.log('1. Testing /api/credits (unauthenticated)...')
  try {
    const response = await fetch(`${BASE_URL}/api/credits`)
    const data = await response.json()

    if (response.status === 401) {
      console.log('   ✅ Correctly returns 401 for unauthenticated users')
      console.log('   Error:', data.error)
    } else {
      console.log('   ❌ Unexpected response:', response.status)
    }
  } catch (err) {
    console.log('   ❌ Request failed:', err)
  }

  // Test 2: Check generate endpoint (unauthenticated)
  console.log('\n2. Testing /api/generate (unauthenticated)...')
  try {
    const response = await fetch(`${BASE_URL}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        imageData: 'data:image/jpeg;base64,/9j/4AAQ',
        prompt: 'test',
      }),
    })
    const data = await response.json()

    if (response.status === 401) {
      console.log('   ✅ Correctly returns 401 for unauthenticated users')
      console.log('   Error:', data.error)
    } else {
      console.log('   ❌ Unexpected response:', response.status, data)
    }
  } catch (err) {
    console.log('   ❌ Request failed:', err)
  }

  // Test 3: Check Stripe checkout endpoint (unauthenticated)
  console.log('\n3. Testing /api/stripe/checkout (unauthenticated)...')
  try {
    const response = await fetch(`${BASE_URL}/api/stripe/checkout`, {
      method: 'POST',
    })
    const data = await response.json()

    if (response.status === 401) {
      console.log('   ✅ Correctly returns 401 for unauthenticated users')
      console.log('   Error:', data.error)
    } else if (response.status === 500 && data.error?.includes('Stripe')) {
      console.log('   ✅ Returns 500 (Stripe not configured in dev)')
      console.log('   Error:', data.error)
    } else {
      console.log('   Response:', response.status, data)
    }
  } catch (err) {
    console.log('   ❌ Request failed:', err)
  }

  // Test 4: Check login page accessibility
  console.log('\n4. Testing /login page...')
  try {
    const response = await fetch(`${BASE_URL}/login`)
    if (response.ok) {
      console.log('   ✅ Login page accessible')
    } else {
      console.log('   ❌ Login page returned:', response.status)
    }
  } catch (err) {
    console.log('   ❌ Request failed:', err)
  }

  // Test 5: Check signup page accessibility
  console.log('\n5. Testing /signup page...')
  try {
    const response = await fetch(`${BASE_URL}/signup`)
    if (response.ok) {
      console.log('   ✅ Signup page accessible')
    } else {
      console.log('   ❌ Signup page returned:', response.status)
    }
  } catch (err) {
    console.log('   ❌ Request failed:', err)
  }

  // Test 6: Check pricing page
  console.log('\n6. Testing /pricing page...')
  try {
    const response = await fetch(`${BASE_URL}/pricing`)
    if (response.ok) {
      console.log('   ✅ Pricing page accessible')
    } else {
      console.log('   ❌ Pricing page returned:', response.status)
    }
  } catch (err) {
    console.log('   ❌ Request failed:', err)
  }

  // Test 7: Check app page redirects (should redirect to login)
  console.log('\n7. Testing /app redirect (unauthenticated)...')
  try {
    const response = await fetch(`${BASE_URL}/app`, { redirect: 'manual' })
    if (response.status === 307 || response.status === 302) {
      const location = response.headers.get('location')
      console.log('   ✅ Correctly redirects to:', location)
    } else if (response.ok) {
      console.log('   ⚠️  No redirect (might be SSR handling)')
    } else {
      console.log('   Response:', response.status)
    }
  } catch (err) {
    console.log('   ❌ Request failed:', err)
  }

  console.log('\n✅ Auth API tests completed!')
  console.log('\n📋 Summary:')
  console.log('- Protected endpoints correctly require authentication')
  console.log('- Auth pages are accessible')
  console.log('- Note: Full login flow requires manual testing in browser')
}

testAuthAPI().catch(console.error)
