/**
 * Transactions Endpoints Test Script
 *
 * This script tests all transactions-related endpoints to understand their response structures
 * Run with: npx tsx src/test-transactions-endpoints.ts
 */

import { API_CONFIG } from './shared/api/config';

interface EndpointTest {
  name: string;
  path: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  description: string;
  requiresAuth?: boolean;
  skipTest?: boolean; // Skip testing if it requires existing data
}

const transactionsEndpointsToTest: EndpointTest[] = [
  {
    name: 'GET Transactions List',
    path: API_CONFIG.endpoints.transactions.list,
    method: 'GET',
    description: 'Get paginated list of transactions',
    requiresAuth: true,
  },
  {
    name: 'GET Transaction Analytics',
    path: API_CONFIG.endpoints.transactions.analytics,
    method: 'GET',
    description: 'Get transaction analytics and summary',
    requiresAuth: true,
  },
  // Mutation endpoints that require specific data are marked to skip testing
  {
    name: 'GET Transaction Detail',
    path: API_CONFIG.endpoints.transactions.detail('sample-id'),
    method: 'GET',
    description: 'Get specific transaction details (requires valid ID)',
    requiresAuth: true,
    skipTest: true,
  },
  {
    name: 'PUT Update Transaction',
    path: API_CONFIG.endpoints.transactions.update('sample-id'),
    method: 'PUT',
    description: 'Update transaction status (requires data)',
    requiresAuth: true,
    skipTest: true,
  },
  {
    name: 'POST Export Transactions',
    path: API_CONFIG.endpoints.transactions.export,
    method: 'POST',
    description: 'Export transactions data (requires data)',
    requiresAuth: true,
    skipTest: true,
  },
];

async function testEndpoint(test: EndpointTest): Promise<void> {
  if (test.skipTest) {
    console.log(`\n${'='.repeat(80)}`);
    console.log(`⏭️  SKIPPING: ${test.name}`);
    console.log(`${'='.repeat(80)}`);
    console.log(`📝 Reason: ${test.description}`);
    return;
  }

  console.log(`\n${'='.repeat(80)}`);
  console.log(`🧪 Testing: ${test.name}`);
  console.log(`${'='.repeat(80)}`);

  if (test.description) {
    console.log(`📝 Description: ${test.description}`);
  }

  console.log(`🔗 URL: ${API_CONFIG.baseURL}${test.path}`);
  console.log(`🔐 Requires Auth: ${test.requiresAuth ? 'Yes' : 'No'}`);
  console.log(`📡 Method: ${test.method || 'GET'}`);

  try {
    const startTime = Date.now();

    // Make direct fetch call with auth token
    const authToken = 'eyJhbGciOiJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNobWFjLXNoYTI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJzdXBlci5hZG1pbkBwcmVkaWN0Z2Fsb3JlLmNvbSIsImp0aSI6IjNjZjc2NmNjLTdiNjgtNDQyOC05ZmQ3LWUwYmU2YzE3ZTEwMiIsImlzQWRtaW4iOiJUcnVlIiwiaWQiOiJhODFmZWNhZi04NTQ1LTQ3OGMtYmQ2Yi03ZGM5YTViODNhMDciLCJwZXJtaXNzaW9ucyI6IjAwMDAwMDAxIiwiZW1haWwiOiJzdXBlci5hZG1pbkBwcmVkaWN0Z2Fsb3JlLmNvbSIsInJvbGVzIjoiU3VwZXJBZG1pbiIsImV4cCI6MTc2ODQyNTk1OCwiaXNzIjoiQmV0UHJlZGljdCIsImF1ZCI6IkJldFByZWRpY3QifQ.fihGlMVytYsso5Jr69p_SJORdy1a-ewraoDre17Lz_Y';

    const response = await fetch(`${API_CONFIG.baseURL}${test.path}`, {
      method: test.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
      body: ['POST', 'PUT'].includes(test.method || 'GET') ? JSON.stringify({}) : undefined,
    });

    let responseData;
    const contentType = response.headers.get('content-type');

    if (contentType?.includes('application/json')) {
      responseData = await response.json();
    } else {
      responseData = await response.text();
    }

    const duration = Date.now() - startTime;

    console.log(`\n📊 Status: ${response.status} ${response.statusText} (${duration}ms)`);

    if (response.ok) {
      console.log('\n✅ SUCCESS RESPONSE:');
      if (typeof responseData === 'string') {
        console.log(responseData);
      } else {
        console.log(JSON.stringify(responseData, null, 2));
      }

      // Analyze response structure
      if (typeof responseData !== 'string') {
        analyzeResponseStructure(responseData as Record<string, unknown>, test.name);
      }
    } else {
      console.log('\n❌ ERROR RESPONSE:');
      if (typeof responseData === 'string') {
        console.log(responseData);
      } else {
        console.log(JSON.stringify(responseData, null, 2));
      }
    }

  } catch (error) {
    console.log('\n❌ NETWORK ERROR:');
    console.log(error);
  }
}

function analyzeResponseStructure(response: Record<string, unknown>, _endpointName: string): void {
  console.log('\n🔍 Response Analysis:');

  if (typeof response !== 'object' || response === null) {
    console.log('⚠️  Response is not an object');
    return;
  }

  const hasData = 'data' in response;
  console.log(`📊 Has "data" property - ${hasData ? 'standard API response' : 'direct response'}`);

  if (hasData) {
    const data = response.data;
    if (Array.isArray(data)) {
      console.log(`📋 Data is array with ${data.length} items`);
      if (data.length > 0) {
        console.log(`📋 First item keys: [ ${Object.keys(data[0]).join(', ')} ]`);
      }
    } else if (typeof data === 'object' && data !== null) {
      console.log(`📋 Data is object`);
      console.log(`📋 Data properties: [ ${Object.keys(data).join(', ')} ]`);
    } else {
      console.log(`📋 Data type: ${typeof data}`);
    }
  } else {
    // Direct response
    if (Array.isArray(response)) {
      console.log(`📋 Response is array with ${response.length} items`);
      if (response.length > 0) {
        console.log(`📋 First item keys: [ ${Object.keys(response[0]).join(', ')} ]`);
      }
    } else {
      console.log(`📋 Response is object with keys: [ ${Object.keys(response).join(', ')} ]`);
    }
  }

  console.log(`🔑 Top-level properties: [ ${Object.keys(response).join(', ')} ]`);
}

async function main() {
  console.log('🚀 Transactions Endpoints Response Structure Test');
  console.log(`📡 Base URL: ${API_CONFIG.baseURL}`);
  console.log(`⏰ Started at: ${new Date().toISOString()}`);
  console.log(`${'='.repeat(80)}\n`);

  for (const test of transactionsEndpointsToTest) {
    await testEndpoint(test);
  }

  console.log(`\n${'='.repeat(80)}`);
  console.log('✅ Transactions Testing Complete!');
  console.log(`🏁 Finished at: ${new Date().toISOString()}`);
  console.log(`${'='.repeat(80)}`);
}

main().catch(console.error);
