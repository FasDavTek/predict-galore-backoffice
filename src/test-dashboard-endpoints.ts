/**
 * Dashboard Endpoints Test Script
 *
 * This script tests all dashboard-related endpoints to understand their response structures
 * Run with: npx tsx src/test-dashboard-endpoints.ts
 */

import { API_CONFIG } from './shared/api/config';

interface EndpointTest {
  name: string;
  path: string;
  description: string;
}

const dashboardEndpointsToTest: EndpointTest[] = [
  {
    name: 'GET Dashboard Summary',
    path: API_CONFIG.endpoints.dashboard.summary,
    description: 'Get dashboard summary metrics'
  },
  {
    name: 'GET Dashboard Analytics',
    path: API_CONFIG.endpoints.dashboard.analytics,
    description: 'Get dashboard analytics data'
  },
  {
    name: 'GET Dashboard Activity',
    path: API_CONFIG.endpoints.dashboard.activity,
    description: 'Get recent activity log'
  },
  {
    name: 'GET Dashboard Traffic',
    path: API_CONFIG.endpoints.dashboard.traffic,
    description: 'Get traffic analytics data'
  },
  {
    name: 'GET Dashboard Engagement',
    path: API_CONFIG.endpoints.dashboard.engagement,
    description: 'Get user engagement metrics'
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

  try {
    const startTime = Date.now();

    // Make direct fetch call with auth token
    const authToken = 'eyJhbGciOiJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNobWFjLXNoYTI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJzdXBlci5hZG1pbkBwcmVkaWN0Z2Fsb3JlLmNvbSIsImp0aSI6IjNjZjc2NmNjLTdiNjgtNDQyOC05ZmQ3LWUwYmU2YzE3ZTEwMiIsImlzQWRtaW4iOiJUcnVlIiwiaWQiOiJhODFmZWNhZi04NTQ1LTQ3OGMtYmQ2Yi03ZGM5YTViODNhMDciLCJwZXJtaXNzaW9ucyI6IjAwMDAwMDAxIiwiZW1haWwiOiJzdXBlci5hZG1pbkBwcmVkaWN0Z2Fsb3JlLmNvbSIsInJvbGVzIjoiU3VwZXJBZG1pbiIsImV4cCI6MTc2ODQyNTk1OCwiaXNzIjoiQmV0UHJlZGljdCIsImF1ZCI6IkJldFByZWRpY3QifQ.fihGlMVytYsso5Jr69p_SJORdy1a-ewraoDre17Lz_Y';

    const response = await fetch(`${API_CONFIG.baseURL}${test.path}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
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

function analyzeResponseStructure(response: Record<string, unknown>, endpointName: string): void {
  console.log('\n🔍 Response Analysis:');

  if (typeof response !== 'object' || response === null) {
    console.log('⚠️  Response is not an object');
    return;
  }

  // Check for common API response patterns
  if (response.data !== undefined) {
    console.log('📊 Has "data" property - standard API response');
    if (Array.isArray(response.data)) {
      console.log(`📋 Data is array with ${response.data.length} items`);
      if (response.data.length > 0) {
        console.log('📋 First item structure:');
        console.log(JSON.stringify(response.data[0], null, 2));
      }
    } else if (typeof response.data === 'object' && response.data !== null) {
      console.log('📋 Data is object');
      console.log('📋 Data properties:', Object.keys(response.data));

      // Specific analysis for different endpoints
      const data = response.data as Record<string, unknown>;
      if (endpointName.includes('Summary')) {
        console.log('🏠 Summary metrics:', Object.keys(data));
      } else if (endpointName.includes('Analytics')) {
        console.log('📈 Analytics structure:', Object.keys(data));
        if (data.users && typeof data.users === 'object' && data.users !== null) console.log('👥 Users section:', Object.keys(data.users));
        if (data.revenue && typeof data.revenue === 'object' && data.revenue !== null) console.log('💰 Revenue section:', Object.keys(data.revenue));
        if (data.predictions && typeof data.predictions === 'object' && data.predictions !== null) console.log('🎯 Predictions section:', Object.keys(data.predictions));
      } else if (endpointName.includes('Activity')) {
        if (Array.isArray(data.activities) && data.activities.length > 0) {
          console.log(`📋 Activities array with ${data.activities.length} items`);
          const firstActivity = data.activities[0];
          if (typeof firstActivity === 'object' && firstActivity !== null) {
            console.log('📋 First activity:', Object.keys(firstActivity));
          }
        }
      } else if (endpointName.includes('Traffic') || endpointName.includes('Engagement')) {
        if (Array.isArray(data)) {
          console.log(`📊 Time-series data with ${data.length} data points`);
          if (data.length > 0) {
            const firstPoint = data[0];
            if (typeof firstPoint === 'object' && firstPoint !== null) {
              console.log('📊 First data point:', Object.keys(firstPoint));
            }
          }
        }
      }
    }
  }

  console.log('🔑 Top-level properties:', Object.keys(response));
}

async function main(): Promise<void> {
  console.log('🚀 Dashboard Endpoints Response Structure Test');
  console.log(`📡 Base URL: ${API_CONFIG.baseURL}`);
  console.log(`⏰ Started at: ${new Date().toISOString()}`);
  console.log(`${'='.repeat(80)}\n`);

  // Test all dashboard endpoints
  for (const endpoint of dashboardEndpointsToTest) {
    await testEndpoint(endpoint);

    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log(`\n${'='.repeat(80)}`);
  console.log('✅ Dashboard Testing Complete!');
  console.log(`🏁 Finished at: ${new Date().toISOString()}`);
  console.log(`${'='.repeat(80)}`);
}

// Run the tests
main().catch((error) => {
  console.error('💥 Test script failed:', error);
  process.exit(1);
});
