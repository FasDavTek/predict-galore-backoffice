import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { settingsApi } from '../api/settingsApi';
import { SettingsState } from '../types';

const initialState: SettingsState = {
  profile: null,
  security: {
    twoFactorEnabled: false,
  },
  notifications: null,
  team: {
    members: [],
    loading: false,
    error: null,
    filters: {
      searchQuery: '',
      roleFilter: 'All',
    },
  },
  roles: {
    list: [],
    loading: false,
    error: null,
  },
  integrations: {
    list: [],
    loading: false,
    error: null,
    notificationsEnabled: true,
  },
  permissions: {
    list: [],
    loading: false,
    error: null,
  },
  loading: {
    profile: false,
    password: false,
    notifications: false,
    team: false,
    roles: false,
    integrations: false,
    permissions: false,
  },
  error: {
    profile: null,
    password: null,
    notifications: null,
    team: null,
    roles: null,
    integrations: null,
    permissions: null,
  },
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setTeamSearchQuery: (state, action: PayloadAction<string>) => {
      state.team.filters.searchQuery = action.payload;
    },
    setTeamRoleFilter: (state, action: PayloadAction<string>) => {
      state.team.filters.roleFilter = action.payload;
    },
    toggleTwoFactor: (state) => {
      state.security.twoFactorEnabled = !state.security.twoFactorEnabled;
    },
    clearProfileError: (state) => {
      state.error.profile = null;
    },
    clearPasswordError: (state) => {
      state.error.password = null;
    },
    clearTeamError: (state) => {
      state.error.team = null;
    },
    clearRolesError: (state) => {
      state.error.roles = null;
    },
    clearNotificationsError: (state) => {
      state.error.notifications = null;
    },
    clearIntegrationsError: (state) => {
      state.error.integrations = null;
    },
    clearPermissionsError: (state) => {
      state.error.permissions = null;
    },
    resetSettingsState: () => initialState,
  },
  extraReducers: (builder) => {
    // Profile
    builder.addMatcher(
      settingsApi.endpoints.getProfile.matchPending,
      (state) => {
        state.loading.profile = true;
        state.error.profile = null;
      }
    );
    builder.addMatcher(
      settingsApi.endpoints.getProfile.matchFulfilled,
      (state, action) => {
        state.loading.profile = false;
        state.profile = action.payload.data;
      }
    );
    builder.addMatcher(
      settingsApi.endpoints.getProfile.matchRejected,
      (state, action) => {
        state.loading.profile = false;
        state.error.profile = action.error.message || 'Failed to fetch profile';
      }
    );

    // Team Members
    builder.addMatcher(
      settingsApi.endpoints.getTeamMembers.matchPending,
      (state) => {
        state.team.loading = true;
        state.team.error = null;
      }
    );
    builder.addMatcher(
      settingsApi.endpoints.getTeamMembers.matchFulfilled,
      (state, action) => {
        state.team.loading = false;
        state.team.members = action.payload.data;
      }
    );
    builder.addMatcher(
      settingsApi.endpoints.getTeamMembers.matchRejected,
      (state, action) => {
        state.team.loading = false;
        state.team.error = action.error.message || 'Failed to fetch team members';
      }
    );

    // Notifications
    builder.addMatcher(
      settingsApi.endpoints.getNotificationSettings.matchPending,
      (state) => {
        state.loading.notifications = true;
        state.error.notifications = null;
      }
    );
    builder.addMatcher(
      settingsApi.endpoints.getNotificationSettings.matchFulfilled,
      (state, action) => {
        state.loading.notifications = false;
        state.notifications = action.payload.data;
      }
    );
    builder.addMatcher(
      settingsApi.endpoints.getNotificationSettings.matchRejected,
      (state, action) => {
        state.loading.notifications = false;
        state.error.notifications = action.error.message || 'Failed to fetch notification settings';
      }
    );

    // Roles
    builder.addMatcher(
      settingsApi.endpoints.getRoles.matchPending,
      (state) => {
        state.roles.loading = true;
        state.roles.error = null;
      }
    );
    builder.addMatcher(
      settingsApi.endpoints.getRoles.matchFulfilled,
      (state, action) => {
        state.roles.loading = false;
        state.roles.list = action.payload.data;
      }
    );
    builder.addMatcher(
      settingsApi.endpoints.getRoles.matchRejected,
      (state, action) => {
        state.roles.loading = false;
        state.roles.error = action.error.message || 'Failed to fetch roles';
      }
    );

    // Permissions
    builder.addMatcher(
      settingsApi.endpoints.getPermissions.matchPending,
      (state) => {
        state.permissions.loading = true;
        state.permissions.error = null;
      }
    );
    builder.addMatcher(
      settingsApi.endpoints.getPermissions.matchFulfilled,
      (state, action) => {
        state.permissions.loading = false;
        state.permissions.list = action.payload.data;
      }
    );
    builder.addMatcher(
      settingsApi.endpoints.getPermissions.matchRejected,
      (state, action) => {
        state.permissions.loading = false;
        state.permissions.error = action.error.message || 'Failed to fetch permissions';
      }
    );

    // Integrations
    builder.addMatcher(
      settingsApi.endpoints.getIntegrations.matchPending,
      (state) => {
        state.integrations.loading = true;
        state.integrations.error = null;
      }
    );
    builder.addMatcher(
      settingsApi.endpoints.getIntegrations.matchFulfilled,
      (state, action) => {
        state.integrations.loading = false;
        state.integrations.list = action.payload.data;
      }
    );
    builder.addMatcher(
      settingsApi.endpoints.getIntegrations.matchRejected,
      (state, action) => {
        state.integrations.loading = false;
        state.integrations.error = action.error.message || 'Failed to fetch integrations';
      }
    );
  },
});

export const {
  setTeamSearchQuery,
  setTeamRoleFilter,
  toggleTwoFactor,
  clearProfileError,
  clearPasswordError,
  clearTeamError,
  clearRolesError,
  clearNotificationsError,
  clearIntegrationsError,
  clearPermissionsError,
  resetSettingsState,
} = settingsSlice.actions;

export default settingsSlice.reducer;