/**
 * Notification Endpoints Test Script
 *
 * This script tests all notification-related endpoints to understand their response structures
 * Run with: npx tsx src/test-notification-endpoints.ts
 */

import { api } from './shared/api/client';
import { API_CONFIG } from './shared/api/config';

interface EndpointTest {
  name: string;
  path: string;
  method?: 'GET' | 'POST' | 'DELETE';
  description: string;
  requiresAuth?: boolean;
}

const notificationEndpointsToTest: EndpointTest[] = [
  {
    name: 'GET Notifications List',
    path: API_CONFIG.endpoints.notifications.list,
    method: 'GET',
    description: 'Get all notifications for the user',
    requiresAuth: true,
  },
  {
    name: 'GET Unread Count',
    path: API_CONFIG.endpoints.notifications.unreadCount,
    method: 'GET',
    description: 'Get count of unread notifications',
    requiresAuth: true,
  },
  // Note: Mark as read, mark all as read, and delete require specific IDs or existing data
  // We'll test these if we get notification data from the list endpoint
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
      body: ['POST', 'DELETE'].includes(test.method || 'GET') ? JSON.stringify({}) : undefined,
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

    if (endpointName.includes('List')) {
      if (Array.isArray(response.data)) {
        console.log(`📋 Data is array with ${response.data.length} items`);
        if (response.data.length > 0) {
          console.log('📋 First item structure:');
          console.log(JSON.stringify(response.data[0], null, 2));
        }
      } else if (typeof response.data === 'object' && response.data !== null) {
        console.log('📋 Data is object');
        const data = response.data as Record<string, unknown>;
        console.log('📋 Data properties:', Object.keys(data));

        if (Array.isArray(data.notifications)) {
          console.log(`📋 Notifications array with ${data.notifications.length} items`);
          if (data.notifications.length > 0) {
            console.log('📋 First notification structure:');
            console.log(JSON.stringify(data.notifications[0], null, 2));
          }
        }

        if ('total' in data) {
          console.log(`📊 Total count: ${data.total}`);
        }

        if ('unread' in data) {
          console.log(`📬 Unread count: ${data.unread}`);
        }
      }
    } else if (endpointName.includes('Unread Count')) {
      if (typeof response.data === 'number') {
        console.log(`🔢 Direct number response: ${response.data}`);
      } else if (typeof response.data === 'object' && response.data !== null) {
        console.log('📋 Count in object structure');
        console.log('📋 Data properties:', Object.keys(response.data));
        if ('count' in response.data) {
          console.log(`🔢 Count value: ${response.data.count}`);
        }
      }
    }
  } else {
    // Check if it's a direct response
    if (typeof response === 'number') {
      console.log(`🔢 Direct number response: ${response}`);
    } else {
      console.log('📋 Direct object response');
      console.log('📋 Properties:', Object.keys(response));
    }
  }

  console.log('🔑 Top-level properties:', Object.keys(response));
}

async function testMutationEndpoints(notifications: unknown[]): Promise<void> {
  if (!notifications || notifications.length === 0) {
    console.log('\n⚠️  No notifications available for mutation testing');
    return;
  }

  console.log(`\n${'='.repeat(80)}`);
  console.log('🔧 Testing Mutation Endpoints');
  console.log(`${'='.repeat(80)}`);

  const firstNotification = notifications[0];
  const firstNotificationId = firstNotification && typeof firstNotification === 'object' && 'id' in firstNotification 
    ? String(firstNotification.id) 
    : '1';

  // Test mark as read (but don't actually modify data)
  console.log('\n📝 Would test: POST Mark as Read');
  console.log(`🔗 URL: ${API_CONFIG.baseURL}${API_CONFIG.endpoints.notifications.markRead(firstNotificationId)}`);

  console.log('\n📝 Would test: POST Mark All as Read');
  console.log(`🔗 URL: ${API_CONFIG.baseURL}${API_CONFIG.endpoints.notifications.markAllRead}`);

  console.log('\n📝 Would test: DELETE Notification');
  console.log(`🔗 URL: ${API_CONFIG.baseURL}${API_CONFIG.endpoints.notifications.delete(firstNotificationId)}`);
}

async function main(): Promise<void> {
  console.log('🚀 Notification Endpoints Response Structure Test');
  console.log(`📡 Base URL: ${API_CONFIG.baseURL}`);
  console.log(`⏰ Started at: ${new Date().toISOString()}`);
  console.log(`${'='.repeat(80)}\n`);

  // Test basic endpoints
  for (const endpoint of notificationEndpointsToTest) {
    await testEndpoint(endpoint);

    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  // Try to get notification data for mutation testing
  try {
    console.log('\n🔍 Attempting to get notifications for mutation endpoint testing...');
    const notificationsResponse = await api.get(API_CONFIG.endpoints.notifications.list) as { data?: Record<string, unknown>[] | { notifications?: Record<string, unknown>[] }; notifications?: Record<string, unknown>[] };

    if (notificationsResponse.data && typeof notificationsResponse.data === 'object' && !Array.isArray(notificationsResponse.data) && 'notifications' in notificationsResponse.data && Array.isArray(notificationsResponse.data.notifications)) {
      await testMutationEndpoints(notificationsResponse.data.notifications);
    } else if (Array.isArray(notificationsResponse.data)) {
      await testMutationEndpoints(notificationsResponse.data);
    }
  } catch {
    console.log('❌ Could not fetch notifications for mutation testing');
  }

  console.log(`\n${'='.repeat(80)}`);
  console.log('✅ Notification Testing Complete!');
  console.log(`🏁 Finished at: ${new Date().toISOString()}`);
  console.log(`${'='.repeat(80)}`);
}

// Run the tests
main().catch((error) => {
  console.error('💥 Test script failed:', error);
  process.exit(1);
});
