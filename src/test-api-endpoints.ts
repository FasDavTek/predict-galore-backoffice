/**
 * API Endpoints Test Script
 *
 * This script tests all GET endpoints to understand their response structures
 * Run with: npx tsx src/test-api-endpoints.ts
 */

import { api } from './shared/api/client';
import { API_CONFIG } from './shared/api/config';

interface EndpointTest {
  name: string;
  path: string;
  params?: Record<string, unknown>;
  requiresAuth?: boolean;
  description?: string;
}

const endpointsToTest: EndpointTest[] = [
  // Sports Data
  {
    name: 'GET Sports',
    path: API_CONFIG.endpoints.sports.list,
    requiresAuth: false,
    description: 'Get all available sports'
  },

  // Leagues Data (basic call first, then with params)
  {
    name: 'GET Leagues (no params)',
    path: API_CONFIG.endpoints.leagues.list,
    requiresAuth: false,
    description: 'Get all leagues without filters'
  },

  // Fixtures Data
  {
    name: 'GET Upcoming Fixtures (no params)',
    path: API_CONFIG.endpoints.fixtures.upcoming,
    requiresAuth: false,
    description: 'Get upcoming fixtures without filters'
  },

  // Markets Data
  {
    name: 'GET Markets',
    path: API_CONFIG.endpoints.markets.list,
    requiresAuth: false,
    description: 'Get all available prediction markets'
  },

  // Predictions
  {
    name: 'GET Predictions',
    path: API_CONFIG.endpoints.predictions.list,
    requiresAuth: true,
    description: 'Get user predictions'
  },

  {
    name: 'GET Prediction Analytics',
    path: API_CONFIG.endpoints.predictions.analytics,
    requiresAuth: true,
    description: 'Get prediction analytics'
  },

  // Users (Admin)
  {
    name: 'GET Users',
    path: API_CONFIG.endpoints.users.list,
    requiresAuth: true,
    description: 'Get users list (admin)'
  },

  {
    name: 'GET Users Analytics',
    path: API_CONFIG.endpoints.users.analytics,
    requiresAuth: true,
    description: 'Get users analytics (admin)'
  },

  // Transactions
  {
    name: 'GET Transactions',
    path: API_CONFIG.endpoints.transactions.list,
    requiresAuth: true,
    description: 'Get transactions list'
  },

  {
    name: 'GET Transactions Analytics',
    path: API_CONFIG.endpoints.transactions.analytics,
    requiresAuth: true,
    description: 'Get transactions analytics'
  },

  // Dashboard
  {
    name: 'GET Dashboard Summary',
    path: API_CONFIG.endpoints.dashboard.summary,
    requiresAuth: true,
    description: 'Get dashboard summary'
  },

  {
    name: 'GET Dashboard Activity',
    path: API_CONFIG.endpoints.dashboard.activity,
    requiresAuth: true,
    description: 'Get dashboard activity'
  },

  {
    name: 'GET Dashboard Traffic',
    path: API_CONFIG.endpoints.dashboard.traffic,
    requiresAuth: true,
    description: 'Get dashboard traffic data'
  },
];

async function testEndpoint(test: EndpointTest): Promise<void> {
  console.log(`\n${'='.repeat(80)}`);
  console.log(`🧪 Testing: ${test.name}`);
  console.log(`${'='.repeat(80)}`);

  if (test.description) {
    console.log(`📝 Description: ${test.description}`);
  }

  console.log(`🔗 URL: ${API_CONFIG.baseURL}${test.path}`);
  console.log(`🔐 Requires Auth: ${test.requiresAuth ? 'Yes' : 'No'}`);
  console.log(`📊 Params: ${test.params ? JSON.stringify(test.params) : 'None'}`);

  try {
    const startTime = Date.now();
    const response = await api.get(test.path, test.params);
    const duration = Date.now() - startTime;

    console.log(`\n✅ SUCCESS (${duration}ms)`);
    console.log('\n📦 Response Structure:');
    console.log(JSON.stringify(response, null, 2));

    // Analyze response structure
    analyzeResponseStructure(response as Record<string, unknown>);

  } catch (error) {
    console.log('\n❌ ERROR:');
    console.log(error);
  }
}

function analyzeResponseStructure(response: Record<string, unknown>): void {
  console.log('\n🔍 Response Analysis:');

  if (typeof response !== 'object' || response === null) {
    console.log('⚠️  Response is not an object');
    return;
  }

  // Check for common API response patterns
  if (response.data !== undefined) {
    console.log('📊 Has "data" property - likely paginated response');
    if (Array.isArray(response.data)) {
      console.log(`📋 Data is array with ${response.data.length} items`);
      if (response.data.length > 0) {
        console.log('📋 First item structure:');
        console.log(JSON.stringify(response.data[0], null, 2));
      }
    } else if (typeof response.data === 'object' && response.data !== null) {
      console.log('📋 Data is object');
      console.log('📋 Data properties:', Object.keys(response.data));
    }
  }

  if (response.pagination && typeof response.pagination === 'object' && response.pagination !== null) {
    const pagination = response.pagination as Record<string, unknown>;
    console.log('📄 Has pagination info:');
    console.log('   - Page:', pagination.page);
    console.log('   - Limit:', pagination.limit);
    console.log('   - Total:', pagination.total);
    console.log('   - Total Pages:', pagination.totalPages);
  }

  if (response.meta) {
    console.log('📋 Has meta info:', Object.keys(response.meta));
  }

  console.log('🔑 Top-level properties:', Object.keys(response));
}

async function testParameterizedEndpoints(): Promise<void> {
  console.log(`\n${'='.repeat(80)}`);
  console.log('🔧 Testing Parameterized Endpoints');
  console.log(`${'='.repeat(80)}`);

  // Test leagues with sportId if we have sports data
  try {
    console.log('\n🔍 Testing Leagues with sportId...');
    const sportsResponse = await api.get(API_CONFIG.endpoints.sports.list) as { data?: Array<{ id: number }> };
    if (sportsResponse.data && Array.isArray(sportsResponse.data) && sportsResponse.data.length > 0) {
      const firstSportId = sportsResponse.data[0].id;
      console.log(`📊 Using sportId: ${firstSportId}`);

      await testEndpoint({
        name: 'GET Leagues (with sportId)',
        path: API_CONFIG.endpoints.leagues.list,
        params: { sportId: firstSportId },
        requiresAuth: false,
        description: `Get leagues filtered by sportId: ${firstSportId}`
      });
    }
  } catch {
    console.log('❌ Could not test parameterized leagues endpoint');
  }

  // Test fixtures with leagueId if we have leagues data
  try {
    console.log('\n🔍 Testing Fixtures with leagueId...');
    const leaguesResponse = await api.get(API_CONFIG.endpoints.leagues.list) as { data?: Array<{ id: number }> };
    if (leaguesResponse.data && Array.isArray(leaguesResponse.data) && leaguesResponse.data.length > 0) {
      const firstLeagueId = leaguesResponse.data[0].id;
      console.log(`📊 Using leagueId: ${firstLeagueId}`);

      await testEndpoint({
        name: 'GET Upcoming Fixtures (with leagueId)',
        path: API_CONFIG.endpoints.fixtures.upcoming,
        params: {
          leagueId: firstLeagueId,
          fromDate: new Date().toISOString().split('T')[0]
        },
        requiresAuth: false,
        description: `Get fixtures for leagueId: ${firstLeagueId}`
      });
    }
  } catch {
    console.log('❌ Could not test parameterized fixtures endpoint');
  }

  // Test market selections if we have markets data
  try {
    console.log('\n🔍 Testing Market Selections...');
    const marketsResponse = await api.get(API_CONFIG.endpoints.markets.list) as { data?: Array<{ id: number }> };
    if (marketsResponse.data && Array.isArray(marketsResponse.data) && marketsResponse.data.length > 0) {
      const firstMarketId = marketsResponse.data[0].id;
      console.log(`📊 Using marketId: ${firstMarketId}`);

      await testEndpoint({
        name: 'GET Market Selections',
        path: API_CONFIG.endpoints.selections.list(firstMarketId),
        requiresAuth: false,
        description: `Get selections for marketId: ${firstMarketId}`
      });
    }
  } catch {
    console.log('❌ Could not test market selections endpoint');
  }
}

async function main(): Promise<void> {
  console.log('🚀 API Endpoints Response Structure Test');
  console.log(`📡 Base URL: ${API_CONFIG.baseURL}`);
  console.log(`⏰ Started at: ${new Date().toISOString()}`);
  console.log(`${'='.repeat(80)}\n`);

  // Test basic endpoints
  for (const endpoint of endpointsToTest) {
    await testEndpoint(endpoint);

    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  // Test parameterized endpoints
  await testParameterizedEndpoints();

  console.log(`\n${'='.repeat(80)}`);
  console.log('✅ API Testing Complete!');
  console.log(`🏁 Finished at: ${new Date().toISOString()}`);
  console.log(`${'='.repeat(80)}`);
}

// Run the tests
main().catch((error) => {
  console.error('💥 Test script failed:', error);
  process.exit(1);
});
