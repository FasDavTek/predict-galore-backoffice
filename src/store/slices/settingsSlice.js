// store/slices/settingsSlice.js
import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';
import axios from 'axios';

/**
 * Mock data fallbacks - Used when API calls fail
 * Provides default data structure for settings
 */

// Mock profile data
const mockProfileData = {
  firstName: "Andrew",
  lastName: "Smith",
  email: "andrewsmith@gmail.com",
  role: "Super Admin",
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
};

// Mock team members data
const mockTeamMembers = [
  { id: 1, name: "Andrew Smith", email: "andrewsmith@email.com", date: "Apr 12, 2023 09:32AM", role: "Super Admin" },
  { id: 2, name: "Jane Doe", email: "janedoe@email.com", date: "Apr 11, 2023 10:15AM", role: "Admin" },
  { id: 3, name: "John Johnson", email: "johnjohnson@email.com", date: "Apr 10, 2023 02:45PM", role: "Admin" },
  { id: 4, name: "Sarah Williams", email: "sarahw@email.com", date: "Apr 9, 2023 11:20AM", role: "Editor" },
  { id: 5, name: "Michael Brown", email: "michaelb@email.com", date: "Apr 8, 2023 04:30PM", role: "Viewer" }
];

// Mock roles data
const mockRoles = [
  {
    id: 1,
    name: "Super Administrator",
    description: "The Super Admin has unrestricted access to the entire system, including security...",
    permissions: "All permissions"
  },
  {
    id: 2,
    name: "Administrator",
    description: "The Admin manages day-to-day operations, including posting content, moderating...",
    permissions: "Content management, User management"
  }
];

// Mock notification settings
const mockNotificationSettings = {
  userActivity: { inApp: true, push: true, email: true },
  predictionsPosts: { inApp: true, push: true, email: true },
  paymentsTransactions: { inApp: true, push: true, email: true },
  securityAlerts: { inApp: true, push: true, email: true }
};


// Mock integration data
const mockIntegrations = [
  {
    id: 1,
    name: "Paystack",
    description: "Payments integration for subscription",
    status: "connected",
    publicKey: "",
    secretKey: "",
    enabled: true
  },
  {
    id: 2,
    name: "Paystack",
    description: "Payments integration",
    status: "connected",
    publicKey: "",
    secretKey: "",
    enabled: false
  }
];


// ==================== ASYNC THUNKS ==================== //

/**
 * Fetches user profile data from API
 * Falls back to mock data if API call fails
 */
export const fetchProfile = createAsyncThunk(
  'settings/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/settings/profile');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch profile, using mock data. Error:', error.message);
      return rejectWithValue(mockProfileData);
    }
  }
);

/**
 * Updates user profile data
 * @param {Object} profileData - Updated profile data
 */
export const updateProfile = createAsyncThunk(
  'settings/updateProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await axios.put('/api/settings/profile', profileData);
      return response.data;
    } catch (error) {
      console.error('Failed to update profile:', error.message);
      return rejectWithValue(error.response?.data);
    }
  }
);

/**
 * Changes user password
 * @param {Object} passwordData - Contains currentPassword and newPassword
 */
export const changePassword = createAsyncThunk(
  'settings/changePassword',
  async (passwordData, { rejectWithValue }) => {
    try {
      await axios.put('/api/settings/password', passwordData);
      return true;
    } catch (error) {
      console.error('Failed to change password:', error.message);
      return rejectWithValue(error.response?.data);
    }
  }
);

/**
 * Fetches team members list
 */
export const fetchTeamMembers = createAsyncThunk(
  'settings/fetchTeamMembers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/settings/team');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch team members, using mock data. Error:', error.message);
      return rejectWithValue(mockTeamMembers);
    }
  }
);

/**
 * Invites new team members
 * @param {Array} emails - Array of email addresses to invite
 */
export const inviteTeamMembers = createAsyncThunk(
  'settings/inviteTeamMembers',
  async (emails, { rejectWithValue }) => {
    try {
      await axios.post('/api/settings/team/invite', { emails });
      return emails;
    } catch (error) {
      console.error('Failed to invite team members:', error.message);
      return rejectWithValue(error.response?.data);
    }
  }
);

/**
 * Updates team member role
 * @param {Object} params - Contains memberId and newRole
 */
export const updateTeamMemberRole = createAsyncThunk(
  'settings/updateTeamMemberRole',
  async ({ memberId, newRole }, { rejectWithValue, dispatch }) => {
    try {
      await axios.put(`/api/settings/team/${memberId}/role`, { role: newRole });
      dispatch(fetchTeamMembers()); // Refresh team members list
      return { memberId, newRole };
    } catch (error) {
      console.error('Failed to update team member role:', error.message);
      return rejectWithValue(error.response?.data);
    }
  }
);

/**
 * Removes team member
 * @param {String} memberId - ID of member to remove
 */
export const removeTeamMember = createAsyncThunk(
  'settings/removeTeamMember',
  async (memberId, { rejectWithValue, dispatch }) => {
    try {
      await axios.delete(`/api/settings/team/${memberId}`);
      dispatch(fetchTeamMembers()); // Refresh team members list
      return memberId;
    } catch (error) {
      console.error('Failed to remove team member:', error.message);
      return rejectWithValue(error.response?.data);
    }
  }
);

/**
 * Fetches roles and permissions
 */
export const fetchRoles = createAsyncThunk(
  'settings/fetchRoles',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/settings/roles');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch roles, using mock data. Error:', error.message);
      return rejectWithValue(mockRoles);
    }
  }
);

/**
 * Creates new role
 * @param {Object} roleData - Contains name and description of new role
 */
export const createRole = createAsyncThunk(
  'settings/createRole',
  async (roleData, { rejectWithValue, dispatch }) => {
    try {
      const response = await axios.post('/api/settings/roles', roleData);
      dispatch(fetchRoles()); // Refresh roles list
      return response.data;
    } catch (error) {
      console.error('Failed to create role:', error.message);
      return rejectWithValue(error.response?.data);
    }
  }
);

/**
 * Updates role
 * @param {Object} params - Contains roleId and updated role data
 */
export const updateRole = createAsyncThunk(
  'settings/updateRole',
  async ({ roleId, roleData }, { rejectWithValue, dispatch }) => {
    try {
      const response = await axios.put(`/api/settings/roles/${roleId}`, roleData);
      dispatch(fetchRoles()); // Refresh roles list
      return response.data;
    } catch (error) {
      console.error('Failed to update role:', error.message);
      return rejectWithValue(error.response?.data);
    }
  }
);

/**
 * Deletes role
 * @param {String} roleId - ID of role to delete
 */
export const deleteRole = createAsyncThunk(
  'settings/deleteRole',
  async (roleId, { rejectWithValue, dispatch }) => {
    try {
      await axios.delete(`/api/settings/roles/${roleId}`);
      dispatch(fetchRoles()); // Refresh roles list
      return roleId;
    } catch (error) {
      console.error('Failed to delete role:', error.message);
      return rejectWithValue(error.response?.data);
    }
  }
);

/**
 * Fetches notification settings
 */
export const fetchNotificationSettings = createAsyncThunk(
  'settings/fetchNotificationSettings',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/settings/notifications');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch notification settings, using mock data. Error:', error.message);
      return rejectWithValue(mockNotificationSettings);
    }
  }
);

/**
 * Updates notification settings
 * @param {Object} settings - Updated notification settings
 */
export const updateNotificationSettings = createAsyncThunk(
  'settings/updateNotificationSettings',
  async (settings, { rejectWithValue }) => {
    try {
      const response = await axios.put('/api/settings/notifications', settings);
      return response.data;
    } catch (error) {
      console.error('Failed to update notification settings:', error.message);
      return rejectWithValue(error.response?.data);
    }
  }
);


/**
 * Fetches integrations
 */
export const fetchIntegrations = createAsyncThunk(
  'settings/fetchIntegrations',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/settings/integrations');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch integrations, using mock data. Error:', error.message);
      return rejectWithValue(mockIntegrations);
    }
  }
);

/**
 * Updates integration settings
 */
export const updateIntegration = createAsyncThunk(
  'settings/updateIntegration',
  async ({ id, integrationData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/api/settings/integrations/${id}`, integrationData);
      return response.data;
    } catch (error) {
      console.error('Failed to update integration:', error.message);
      return rejectWithValue(error.response?.data);
    }
  }
);

/**
 * Toggles notifications
 */
export const toggleNotifications = createAsyncThunk(
  'settings/toggleNotifications',
  async (enabled, { rejectWithValue }) => {
    try {
      const response = await axios.put('/api/settings/integrations/notifications', { enabled });
      return response.data;
    } catch (error) {
      console.error('Failed to toggle notifications:', error.message);
      return rejectWithValue(error.response?.data);
    }
  }
);


// ==================== INITIAL STATE ==================== //

/**
 * Initial Redux state structure
 * Contains:
 * - Profile, security, notifications, team, and roles data
 * - Loading states for different operations
 * - Error states
 * - Filter settings for team members
 */
const initialState = {
  profile: null,
  security: {
    twoFactorEnabled: false
  },
  notifications: null,
  team: {
    members: [],
    loading: false,
    error: null,
    filters: {
      searchQuery: '',
      roleFilter: 'All'
    }
  },
  roles: {
    list: [],
    loading: false,
    error: null
  },
  integrations: {
    list: mockIntegrations,
    loading: false,
    error: null,
    notificationsEnabled: true
  },
  loading: {
    profile: false,
    password: false,
    notifications: false,
    team: false,
    roles: false,
    integrations: false
  },
  error: {
    profile: null,
    password: null,
    notifications: null,
    team: null,
    roles: null,
    integrations: null
  }
};

// ==================== SLICE DEFINITION ==================== //

const settingsSlice = createSlice({
  name: 'settings', // Slice name used in Redux store
  initialState,
  reducers: {
    // Action to set team member search query
    setTeamSearchQuery: (state, action) => {
      state.team.filters.searchQuery = action.payload;
    },
    // Action to set team member role filter
    setTeamRoleFilter: (state, action) => {
      state.team.filters.roleFilter = action.payload;
    },
    // Action to toggle two-factor authentication
    toggleTwoFactor: (state) => {
      state.security.twoFactorEnabled = !state.security.twoFactorEnabled;
    },
    // Clears profile-related errors
    clearProfileError: (state) => {
      state.error.profile = null;
    },
    // Clears password-related errors
    clearPasswordError: (state) => {
      state.error.password = null;
    },
    // Clears team-related errors
    clearTeamError: (state) => {
      state.error.team = null;
    },
    // Clears roles-related errors
    clearRolesError: (state) => {
      state.error.roles = null;
    },
    // Clears notifications-related errors
    clearNotificationsError: (state) => {
      state.error.notifications = null;
    },
    clearIntegrationsError: (state) => {
      state.error.integrations = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Handles Next.js hydration (SSR state merging)
      .addCase(HYDRATE, (state, action) => {
        if (action.payload.settings) {
          return {
            ...state,
            ...action.payload.settings,
          };
        }
      })
      
      // ========== PROFILE REDUCERS ========== //
      .addCase(fetchProfile.pending, (state) => {
        state.loading.profile = true;
        state.error.profile = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading.profile = false;
        state.profile = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading.profile = false;
        state.error.profile = action.error;
        state.profile = action.payload || mockProfileData; // Fallback to mock data
      })
      
      .addCase(updateProfile.pending, (state) => {
        state.loading.profile = true;
        state.error.profile = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading.profile = false;
        state.profile = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading.profile = false;
        state.error.profile = action.error;
      })
      
      // ========== PASSWORD REDUCERS ========== //
      .addCase(changePassword.pending, (state) => {
        state.loading.password = true;
        state.error.password = null;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.loading.password = false;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loading.password = false;
        state.error.password = action.error;
      })
      
      // ========== TEAM MEMBERS REDUCERS ========== //
      .addCase(fetchTeamMembers.pending, (state) => {
        state.team.loading = true;
        state.team.error = null;
      })
      .addCase(fetchTeamMembers.fulfilled, (state, action) => {
        state.team.loading = false;
        state.team.members = action.payload;
      })
      .addCase(fetchTeamMembers.rejected, (state, action) => {
        state.team.loading = false;
        state.team.error = action.error;
        state.team.members = action.payload || mockTeamMembers; // Fallback to mock data
      })
      
      .addCase(inviteTeamMembers.pending, (state) => {
        state.team.loading = true;
      })
      .addCase(inviteTeamMembers.fulfilled, (state) => {
        state.team.loading = false;
      })
      .addCase(inviteTeamMembers.rejected, (state, action) => {
        state.team.loading = false;
        state.team.error = action.error;
      })
      
      .addCase(updateTeamMemberRole.pending, (state) => {
        state.team.loading = true;
      })
      .addCase(updateTeamMemberRole.fulfilled, (state, action) => {
        state.team.loading = false;
        const { memberId, newRole } = action.payload;
        const member = state.team.members.find(m => m.id === memberId);
        if (member) {
          member.role = newRole;
        }
      })
      .addCase(updateTeamMemberRole.rejected, (state, action) => {
        state.team.loading = false;
        state.team.error = action.error;
      })
      
      .addCase(removeTeamMember.pending, (state) => {
        state.team.loading = true;
      })
      .addCase(removeTeamMember.fulfilled, (state, action) => {
        state.team.loading = false;
        state.team.members = state.team.members.filter(m => m.id !== action.payload);
      })
      .addCase(removeTeamMember.rejected, (state, action) => {
        state.team.loading = false;
        state.team.error = action.error;
      })
      
      // ========== ROLES REDUCERS ========== //
      .addCase(fetchRoles.pending, (state) => {
        state.roles.loading = true;
        state.roles.error = null;
      })
      .addCase(fetchRoles.fulfilled, (state, action) => {
        state.roles.loading = false;
        state.roles.list = action.payload;
      })
      .addCase(fetchRoles.rejected, (state, action) => {
        state.roles.loading = false;
        state.roles.error = action.error;
        state.roles.list = action.payload || mockRoles; // Fallback to mock data
      })
      
      .addCase(createRole.pending, (state) => {
        state.roles.loading = true;
      })
      .addCase(createRole.fulfilled, (state) => {
        state.roles.loading = false;
      })
      .addCase(createRole.rejected, (state, action) => {
        state.roles.loading = false;
        state.roles.error = action.error;
      })
      
      .addCase(updateRole.pending, (state) => {
        state.roles.loading = true;
      })
      .addCase(updateRole.fulfilled, (state) => {
        state.roles.loading = false;
      })
      .addCase(updateRole.rejected, (state, action) => {
        state.roles.loading = false;
        state.roles.error = action.error;
      })
      
      .addCase(deleteRole.pending, (state) => {
        state.roles.loading = true;
      })
      .addCase(deleteRole.fulfilled, (state) => {
        state.roles.loading = false;
      })
      .addCase(deleteRole.rejected, (state, action) => {
        state.roles.loading = false;
        state.roles.error = action.error;
      })
      
      // ========== NOTIFICATIONS REDUCERS ========== //
      .addCase(fetchNotificationSettings.pending, (state) => {
        state.loading.notifications = true;
        state.error.notifications = null;
      })
      .addCase(fetchNotificationSettings.fulfilled, (state, action) => {
        state.loading.notifications = false;
        state.notifications = action.payload;
      })
      .addCase(fetchNotificationSettings.rejected, (state, action) => {
        state.loading.notifications = false;
        state.error.notifications = action.error;
        state.notifications = action.payload || mockNotificationSettings; // Fallback to mock data
      })
      
      .addCase(updateNotificationSettings.pending, (state) => {
        state.loading.notifications = true;
      })
      .addCase(updateNotificationSettings.fulfilled, (state, action) => {
        state.loading.notifications = false;
        state.notifications = action.payload;
      })
      .addCase(updateNotificationSettings.rejected, (state, action) => {
        state.loading.notifications = false;
        state.error.notifications = action.error;
      })

       // ========== INTEGRATIONS REDUCERS ========== //
    builder.addCase(fetchIntegrations.pending, (state) => {
      state.integrations.loading = true;
      state.integrations.error = null;
    })
    builder.addCase(fetchIntegrations.fulfilled, (state, action) => {
      state.integrations.loading = false;
      state.integrations.list = action.payload;
    })
    builder.addCase(fetchIntegrations.rejected, (state, action) => {
      state.integrations.loading = false;
      state.integrations.error = action.error;
      state.integrations.list = action.payload || mockIntegrations;
    })
    
    builder.addCase(updateIntegration.pending, (state) => {
      state.integrations.loading = true;
    })
    builder.addCase(updateIntegration.fulfilled, (state, action) => {
      state.integrations.loading = false;
      const index = state.integrations.list.findIndex(i => i.id === action.payload.id);
      if (index !== -1) {
        state.integrations.list[index] = action.payload;
      }
    })
    builder.addCase(updateIntegration.rejected, (state, action) => {
      state.integrations.loading = false;
      state.integrations.error = action.error;
    })
    
    builder.addCase(toggleNotifications.pending, (state) => {
      state.integrations.loading = true;
    })
    builder.addCase(toggleNotifications.fulfilled, (state, action) => {
      state.integrations.loading = false;
      state.integrations.notificationsEnabled = action.payload.enabled;
    })
    builder.addCase(toggleNotifications.rejected, (state, action) => {
      state.integrations.loading = false;
      state.integrations.error = action.error;
    });
  }
});
  

// ==================== ACTION EXPORTS ==================== //
export const {
  setTeamSearchQuery,
  setTeamRoleFilter,
  toggleTwoFactor,
  clearProfileError,
  clearPasswordError,
  clearTeamError,
  clearRolesError,
  clearNotificationsError,
  clearIntegrationsError
} = settingsSlice.actions;

// ==================== SELECTORS ==================== //

// Base selector for settings state
export const selectSettingsState = (state) => state.settings;

// Profile selectors
export const selectProfile = createSelector(
  [selectSettingsState],
  (settings) => settings.profile
);

export const selectProfileLoading = createSelector(
  [selectSettingsState],
  (settings) => settings.loading.profile
);

export const selectProfileError = createSelector(
  [selectSettingsState],
  (settings) => settings.error.profile
);

// Security selectors
export const selectTwoFactorEnabled = createSelector(
  [selectSettingsState],
  (settings) => settings.security.twoFactorEnabled
);

export const selectPasswordLoading = createSelector(
  [selectSettingsState],
  (settings) => settings.loading.password
);

export const selectPasswordError = createSelector(
  [selectSettingsState],
  (settings) => settings.error.password
);

// Team selectors
export const selectTeamMembers = createSelector(
  [selectSettingsState],
  (settings) => settings.team.members
);

export const selectTeamLoading = createSelector(
  [selectSettingsState],
  (settings) => settings.team.loading
);

export const selectTeamError = createSelector(
  [selectSettingsState],
  (settings) => settings.team.error
);

export const selectTeamFilters = createSelector(
  [selectSettingsState],
  (settings) => settings.team.filters
);

export const selectTeamSearchQuery = createSelector(
  [selectTeamFilters],
  (filters) => filters.searchQuery
);

export const selectTeamRoleFilter = createSelector(
  [selectTeamFilters],
  (filters) => filters.roleFilter
);

// Filtered team members selector (client-side filtering)
export const selectFilteredTeamMembers = createSelector(
  [selectTeamMembers, selectTeamSearchQuery, selectTeamRoleFilter],
  (members, searchQuery, roleFilter) => {
    let filtered = [...members];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(member => 
        member.name.toLowerCase().includes(query) || 
        member.email.toLowerCase().includes(query)
      );
    }
    
    // Apply role filter
    if (roleFilter !== 'All') {
      filtered = filtered.filter(member => member.role === roleFilter);
    }
    
    return filtered;
  }
);

// Roles selectors
export const selectRoles = createSelector(
  [selectSettingsState],
  (settings) => settings.roles.list
);

export const selectRolesLoading = createSelector(
  [selectSettingsState],
  (settings) => settings.roles.loading
);

export const selectRolesError = createSelector(
  [selectSettingsState],
  (settings) => settings.roles.error
);

// Notifications selectors
export const selectNotificationSettings = createSelector(
  [selectSettingsState],
  (settings) => settings.notifications
);

export const selectNotificationsLoading = createSelector(
  [selectSettingsState],
  (settings) => settings.loading.notifications
);

export const selectNotificationsError = createSelector(
  [selectSettingsState],
  (settings) => settings.error.notifications
);

export const selectIntegrations = createSelector(
  [selectSettingsState],
  (settings) => settings.integrations.list
);

export const selectIntegrationsLoading = createSelector(
  [selectSettingsState],
  (settings) => settings.integrations.loading
);

export const selectIntegrationsError = createSelector(
  [selectSettingsState],
  (settings) => settings.integrations.error
);

export const selectNotificationsEnabled = createSelector(
  [selectSettingsState],
  (settings) => settings.integrations.notificationsEnabled
);

export default settingsSlice.reducer;