/**
 * Settings Endpoints Test Script
 *
 * This script tests all settings-related endpoints to understand their response structures
 * Run with: npx tsx src/test-settings-endpoints.ts
 */

import { api } from './shared/api/client';
import { API_CONFIG } from './shared/api/config';

interface EndpointTest {
  name: string;
  path: string | ((id: string) => string);
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  description: string;
  requiresAuth?: boolean;
  skipTest?: boolean; // Skip testing if it requires existing data
}

const settingsEndpointsToTest: EndpointTest[] = [
  {
    name: 'GET Profile Settings',
    path: API_CONFIG.endpoints.settings.profile,
    method: 'GET',
    description: 'Get user profile information',
    requiresAuth: true,
  },
  {
    name: 'GET Notification Settings',
    path: API_CONFIG.endpoints.settings.notifications,
    method: 'GET',
    description: 'Get notification preferences',
    requiresAuth: true,
  },
  {
    name: 'GET Integrations',
    path: API_CONFIG.endpoints.settings.integrations,
    method: 'GET',
    description: 'Get available integrations',
    requiresAuth: true,
  },
  {
    name: 'GET Team Members',
    path: API_CONFIG.endpoints.settings.teams,
    method: 'GET',
    description: 'Get team members',
    requiresAuth: true,
  },
  {
    name: 'GET Security Settings',
    path: API_CONFIG.endpoints.settings.security,
    method: 'GET',
    description: 'Get security settings',
    requiresAuth: true,
  },
  // Mutation endpoints that require specific data are marked to skip testing
  {
    name: 'PUT Update Profile',
    path: API_CONFIG.endpoints.settings.profile,
    method: 'PUT',
    description: 'Update user profile (requires data)',
    requiresAuth: true,
    skipTest: true,
  },
  {
    name: 'PUT Update Notifications',
    path: API_CONFIG.endpoints.settings.notifications,
    method: 'PUT',
    description: 'Update notification settings (requires data)',
    requiresAuth: true,
    skipTest: true,
  },
  {
    name: 'POST Change Password',
    path: API_CONFIG.endpoints.auth.changePassword,
    method: 'POST',
    description: 'Change password (requires data)',
    requiresAuth: true,
    skipTest: true,
  },
  {
    name: 'POST Toggle 2FA',
    path: API_CONFIG.endpoints.settings.twoFactor,
    method: 'POST',
    description: 'Toggle two-factor authentication (requires data)',
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

  // Handle dynamic endpoints that require IDs
  let actualPath: string = typeof test.path === 'string' ? test.path : '';
  if (typeof test.path === 'function') {
    // For settings endpoints that require user ID, use the ID from the JWT token
    const userId = 'a81fecaf-8545-478c-bd6b-7dc9a5b83a07'; // From the JWT token
    actualPath = test.path(userId);
  }

  console.log(`🔗 URL: ${API_CONFIG.baseURL}${actualPath}`);
  console.log(`🔐 Requires Auth: ${test.requiresAuth ? 'Yes' : 'No'}`);
  console.log(`📡 Method: ${test.method || 'GET'}`);

  try {
    const startTime = Date.now();

    // Make direct fetch call with auth token
    const authToken = 'eyJhbGciOiJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNobWFjLXNoYTI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJzdXBlci5hZG1pbkBwcmVkaWN0Z2Fsb3JlLmNvbSIsImp0aSI6IjNjZjc2NmNjLTdiNjgtNDQyOC05ZmQ3LWUwYmU2YzE3ZTEwMiIsImlzQWRtaW4iOiJUcnVlIiwiaWQiOiJhODFmZWNhZi04NTQ1LTQ3OGMtYmQ2Yi03ZGM5YTViODNhMDciLCJwZXJtaXNzaW9ucyI6IjAwMDAwMDAxIiwiZW1haWwiOiJzdXBlci5hZG1pbkBwcmVkaWN0Z2Fsb3JlLmNvbSIsInJvbGVzIjoiU3VwZXJBZG1pbiIsImV4cCI6MTc2ODQyNTk1OCwiaXNzIjoiQmV0UHJlZGljdCIsImF1ZCI6IkJldFByZWRpY3QifQ.fihGlMVytYsso5Jr69p_SJORdy1a-ewraoDre17Lz_Y';

    const response = await fetch(`${API_CONFIG.baseURL}${actualPath}`, {
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

function analyzeResponseStructure(response: Record<string, unknown>, endpointName: string): void {
  console.log('\n🔍 Response Analysis:');

  if (typeof response !== 'object' || response === null) {
    console.log('⚠️  Response is not an object');
    return;
  }

  // Check for common API response patterns
  if (response.data !== undefined) {
    console.log('📊 Has "data" property - standard API response');

    if (endpointName.includes('Profile')) {
      console.log('👤 Profile data structure:');
      if (typeof response.data === 'object' && response.data !== null) {
        console.log('   User fields:', Object.keys(response.data));
      }
    } else if (endpointName.includes('Notification')) {
      console.log('🔔 Notification settings structure:');
      if (typeof response.data === 'object' && response.data !== null) {
        console.log('   Settings fields:', Object.keys(response.data));
        console.log('   Total settings:', Object.keys(response.data).length);
      }
    } else if (endpointName.includes('Integrations')) {
      console.log('🔗 Integrations data structure:');
      if (Array.isArray(response.data)) {
        console.log(`📋 Array with ${response.data.length} integrations`);
        if (response.data.length > 0) {
          const firstItem = response.data[0];
          if (typeof firstItem === 'object' && firstItem !== null) {
            console.log('📋 First integration:', Object.keys(firstItem));
          }
        }
      }
    } else if (endpointName.includes('Team')) {
      console.log('👥 Team members data structure:');
        if (Array.isArray(response.data)) {
          console.log(`📋 Array with ${response.data.length} team members`);
          if (response.data.length > 0) {
            const firstMember = response.data[0];
            if (typeof firstMember === 'object' && firstMember !== null) {
              console.log('📋 First member:', Object.keys(firstMember));
            }
          }
        }
    } else if (endpointName.includes('Security')) {
      console.log('🔒 Security settings structure:');
      if (typeof response.data === 'object' && response.data !== null) {
        console.log('   Security fields:', Object.keys(response.data));
      }
    }
  } else {
    console.log('📋 Direct response (no data wrapper)');
    console.log('📋 Properties:', Object.keys(response));
  }

  console.log('🔑 Top-level properties:', Object.keys(response));
}

async function main(): Promise<void> {
  console.log('🚀 Settings Endpoints Response Structure Test');
  console.log(`📡 Base URL: ${API_CONFIG.baseURL}`);
  console.log(`⏰ Started at: ${new Date().toISOString()}`);
  console.log(`${'='.repeat(80)}\n`);

  // Test all settings endpoints
  for (const endpoint of settingsEndpointsToTest) {
    await testEndpoint(endpoint);

    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log(`\n${'='.repeat(80)}`);
  console.log('✅ Settings Testing Complete!');
  console.log(`🏁 Finished at: ${new Date().toISOString()}`);
  console.log(`${'='.repeat(80)}`);
}

// Run the tests
main().catch((error) => {
  console.error('💥 Test script failed:', error);
  process.exit(1);
});
