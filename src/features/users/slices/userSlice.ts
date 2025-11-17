import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, UsersFilter } from '../types/user.types';

// Define the shape of the users state in Redux store
interface UsersState {
  selectedUser: User | null;      // Currently selected user for viewing/editing
  currentFilters: UsersFilter;    // Active filters for user list
  selectedUserIds: string[];      // IDs of users selected for bulk actions
  bulkAction: string | null;      // Current bulk action being performed
}

// Initial state when the app loads
const initialState: UsersState = {
  selectedUser: null,             // No user selected initially
  currentFilters: {
    page: 1,                      // Start on page 1
    limit: 10,                    // Show 10 users per page
  },
  selectedUserIds: [],            // No users selected initially
  bulkAction: null,               // No bulk action in progress
};

// Create Redux slice for user management
// A slice contains reducers and actions for a specific feature
const usersSlice = createSlice({
  name: 'users',                  // Name used in Redux DevTools
  initialState,                   // Starting state
  reducers: {
    // Action to set the currently selected user
    setSelectedUser: (state, action: PayloadAction<User | null>) => {
      state.selectedUser = action.payload;
    },

    // Action to clear the selected user
    clearSelectedUser: (state) => {
      state.selectedUser = null;
    },

    // Action to update filters (merges with existing filters)
    setFilters: (state, action: PayloadAction<Partial<UsersFilter>>) => {

      // Spread existing filters and override with new ones
      state.currentFilters = { ...state.currentFilters, ...action.payload };
    },

    // Action to reset all filters to default
    clearFilters: (state) => {
      state.currentFilters = { page: 1, limit: 10 };
    },

    // Action to set multiple selected user IDs (for bulk operations)
    setSelectedUserIds: (state, action: PayloadAction<string[]>) => {
      state.selectedUserIds = action.payload;
    },

    // Action to toggle selection of a single user
    toggleUserSelection: (state, action: PayloadAction<string>) => {
      const userId = action.payload;
      const index = state.selectedUserIds.indexOf(userId);
      
      // If user is not selected, add them; if selected, remove them
      if (index === -1) {
        state.selectedUserIds.push(userId);
      } else {
        state.selectedUserIds.splice(index, 1);
      }
    },

    // Action to clear all selected users
    clearSelectedUsers: (state) => {
      state.selectedUserIds = [];
    },

    // Action to set the current bulk action
    setBulkAction: (state, action: PayloadAction<string | null>) => {
      state.bulkAction = action.payload;
    },
  },
});

// Export actions to be used in React components
export const {
  setSelectedUser,
  clearSelectedUser,
  setFilters,
  clearFilters,
  setSelectedUserIds,
  toggleUserSelection,
  clearSelectedUsers,
  setBulkAction,
} = usersSlice.actions;



// Selectors - functions to extract data from the Redux state

// Get the currently selected user
export const selectSelectedUser = (state: { users: UsersState }) => state.users.selectedUser;

// Get the current filter settings
export const selectCurrentFilters = (state: { users: UsersState }) => state.users.currentFilters;

// Get the list of selected user IDs
export const selectSelectedUserIds = (state: { users: UsersState }) => state.users.selectedUserIds;

// Get the current bulk action
export const selectBulkAction = (state: { users: UsersState }) => state.users.bulkAction;


// Export the reducer to be added to the Redux store
export const usersReducer = usersSlice.reducer;