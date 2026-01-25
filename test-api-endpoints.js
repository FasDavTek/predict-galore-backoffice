/**
 * API Endpoints Test Script
 *
 * This script tests all GET endpoints to understand their response structures
 * Run with: node test-api-endpoints.js
 */

const API_BASE_URL = 'https://apidev.predictgalore.com';

// Replace with your actual auth token
const AUTH_TOKEN = process.env.AUTH_TOKEN || '';

const endpoints = {
  // Auth endpoints (some require different auth)
  'GET /api/v1/auth/user/me': '/api/v1/auth/user/me',

  // Dashboard
  'GET /api/v1/dashboard/summary': '/api/v1/dashboard/summary',
  'GET /api/v1/dashboard/activity': '/api/v1/dashboard/activity',
  'GET /api/v1/dashboard/traffic': '/api/v1/dashboard/traffic',

  // Sports Data
  'GET /api/v1/sports': '/api/v1/sports',

  // Leagues Data
  'GET /api/v1/leagues': '/api/v1/leagues',

  // Fixtures Data
  'GET /api/v1/fixtures/upcoming': '/api/v1/fixtures/upcoming',

  // Markets Data
  'GET /api/v1/prediction/markets': '/api/v1/prediction/markets',

  // Predictions
  'GET /api/v1/prediction': '/api/v1/prediction',
  'GET /api/v1/prediction/analytics': '/api/v1/prediction/analytics',

  // Users (Admin)
  'GET /api/v1/admin/users': '/api/v1/admin/users',
  'GET /api/v1/admin/users/summary': '/api/v1/admin/users/summary',

  // Transactions
  'GET /api/v1/transactions': '/api/v1/transactions',
  'GET /api/v1/transactions/summary': '/api/v1/transactions/summary',
};

async function makeRequest(endpoint, url) {
  try {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(AUTH_TOKEN && { 'Authorization': `Bearer ${AUTH_TOKEN}` }),
      },
    });

    const data = await response.json();

    console.log(`\n${'='.repeat(80)}`);
    console.log(`${endpoint}`);
    console.log(`${'='.repeat(80)}`);
    console.log(`Status: ${response.status} ${response.statusText}`);
    console.log(`URL: ${API_BASE_URL}${url}`);

    if (response.ok) {
      console.log('\n✅ SUCCESS RESPONSE:');
      console.log(JSON.stringify(data, null, 2));
    } else {
      console.log('\n❌ ERROR RESPONSE:');
      console.log(JSON.stringify(data, null, 2));
    }

    return { endpoint, status: response.status, data };
  } catch (error) {
    console.log(`\n${'='.repeat(80)}`);
    console.log(`${endpoint}`);
    console.log(`${'='.repeat(80)}`);
    console.log(`❌ NETWORK ERROR: ${error.message}`);
    return { endpoint, error: error.message };
  }
}

async function testEndpointsWithParams() {
  console.log('\n🔍 Testing endpoints that require parameters...\n');

  // Test leagues with sportId
  await makeRequest('GET /api/v1/leagues?sportId=1', '/api/v1/leagues?sportId=1');

  // Test fixtures with leagueId and date
  await makeRequest('GET /api/v1/fixtures/upcoming?leagueId=1&fromDate=2024-01-01', '/api/v1/fixtures/upcoming?leagueId=1&fromDate=2024-01-01');

  // Test market selections (if we can get market IDs from previous response)
  // This would need to be done dynamically based on markets response
}

async function testAllEndpoints() {
  console.log('🚀 Starting API Endpoint Testing...\n');
  console.log(`Base URL: ${API_BASE_URL}`);
  console.log(`Auth Token: ${AUTH_TOKEN ? '✅ Provided' : '❌ Not provided'}\n`);

  const results = [];

  // Test basic endpoints first
  for (const [name, url] of Object.entries(endpoints)) {
    const result = await makeRequest(name, url);
    results.push(result);

    // Add small delay to avoid overwhelming the API
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  // Test parameterized endpoints
  await testEndpointsWithParams();

  console.log('\n📊 SUMMARY:');
  console.log(`${'='.repeat(80)}`);
  const successful = results.filter(r => r.status === 200).length;
  const failed = results.filter(r => r.status && r.status !== 200).length;
  const errors = results.filter(r => r.error).length;

  console.log(`✅ Successful: ${successful}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`🔥 Errors: ${errors}`);
  console.log(`📝 Total Tested: ${results.length}`);
}

// Handle command line arguments for auth token
if (process.argv[2] && process.argv[2].startsWith('--token=')) {
  process.env.AUTH_TOKEN = process.argv[2].split('=')[1];
}

testAllEndpoints().catch(console.error);
