/**
 * Settings Page
 * Clean, simple implementation
 */

'use client';

import { useState, useCallback, memo, Suspense } from 'react';
import { Tabs, Tab, Box } from '@mui/material';
import Stack from '@mui/material/Stack';
import toast from 'react-hot-toast';
import { PageHeader } from '@/shared/components/PageHeader';
import { designTokens } from '@/shared/styles/tokens';
import { useAuth } from '@/features/auth';
import withAuth from '@/hoc/with-auth';
import dynamic from 'next/dynamic';

// Lazy load tab components
const ProfileTab = dynamic(() => import('./features/components/ProfileTab').then(mod => ({ default: mod.ProfileTab })), {
  loading: () => <div>Loading...</div>,
  ssr: false,
});

const SecurityTab = dynamic(() => import('./features/components/SecurityTab').then(mod => ({ default: mod.SecurityTab })), {
  loading: () => <div>Loading...</div>,
  ssr: false,
});

const NotificationsTab = dynamic(() => import('./features/components/NotificationsTab').then(mod => ({ default: mod.NotificationsTab })), {
  loading: () => <div>Loading...</div>,
  ssr: false,
});

const IntegrationsTab = dynamic(() => import('./features/components/IntegrationsTab').then(mod => ({ default: mod.IntegrationsTab })), {
  loading: () => <div>Loading...</div>,
  ssr: false,
});

const TeamsTab = dynamic(() => import('./features/components/TeamsTab').then(mod => ({ default: mod.TeamsTab })), {
  loading: () => <div>Loading...</div>,
  ssr: false,
});

type TabValue = 'profile' | 'security' | 'notifications' | 'integrations' | 'teams';

function SettingsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabValue>('profile');

  const handleTabChange = useCallback((_: React.SyntheticEvent, newValue: TabValue) => {
    setActiveTab(newValue);
  }, []);

  const showNotification = useCallback((message: string, severity: 'success' | 'error' | 'warning') => {
    switch (severity) {
      case 'success':
        toast.success(message);
        break;
      case 'error':
        toast.error(message);
        break;
      case 'warning':
        toast(message, { icon: '⚠️' });
        break;
    }
  }, []);

  return (
    <Box
      sx={{
        // maxWidth: 1536, // 2xl breakpoint (96rem = 1536px)
        width: '100%',
        px: { xs: 2, sm: 3, md: 4 },
        py: designTokens.spacing.xl,
      }}
    >
      <Stack spacing={designTokens.spacing.sectionGap}>
        <PageHeader
          title="Settings"
          defaultSubtitle="Welcome {firstName}! Manage your account settings."
          user={user}
        />

        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: designTokens.spacing.sectionGap }}>
          <Tabs value={activeTab} onChange={handleTabChange}>
            <Tab label="Profile" value="profile" />
            <Tab label="Security" value="security" />
            <Tab label="Notifications" value="notifications" />
            <Tab label="Integrations" value="integrations" />
            <Tab label="Teams" value="teams" />
          </Tabs>
        </Box>

        <Box>
          <Suspense fallback={<div>Loading...</div>}>
            {activeTab === 'profile' && <ProfileTab showNotification={showNotification} />}
            {activeTab === 'security' && <SecurityTab showNotification={showNotification} />}
            {activeTab === 'notifications' && <NotificationsTab showNotification={showNotification} />}
            {activeTab === 'integrations' && <IntegrationsTab showNotification={showNotification} />}
            {activeTab === 'teams' && <TeamsTab showNotification={showNotification} />}
          </Suspense>
        </Box>
      </Stack>
    </Box>
  );
}

export default withAuth(memo(SettingsPage));
