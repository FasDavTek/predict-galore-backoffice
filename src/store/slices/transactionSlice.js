// store/slices/transactionsSlice.js
import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';
import axios from 'axios';

/**
 * Mock data fallbacks - Used when API calls fail
 * Provides default data structure for transaction statistics
 */
const mockTransactionStats = [
  {
    title: "Total Transactions",
    value: "2,456",
    change: "+18.5",
    bgColor: "#F0FDF4",
    icon: "transactions"
  },
  {
    title: "Completed",
    value: "1,876",
    change: "+5.3",
    bgColor: "#FEF2F2",
    icon: "transactions"
  },
  {
    title: "Pending",
    value: "342",
    change: "-2.8",
    bgColor: "#EFF8FF",
    icon: "transactions"
  },
  {
    title: "Failed",
    value: "138",
    change: "+1.2",
    bgColor: "#F5F3FF",
    icon: "transactions"
  },
  {
    title: "Revenue",
    value: "$24,560",
    change: "+22.8",
    bgColor: "#ECFDF5",
    icon: "dollar"
  }
];

/**
 * Mock transactions list - Fallback data when transactions fetch fails
 * Contains sample transaction data with all required fields
 */
const mockTransactionsList = [
  {
    id: "TXN-001",
    user: "John Doe",
    amount: "$125.00",
    paymentMethod: "Credit Card",
    status: "completed",
    date: "2023-05-15T10:30:00Z", // ISO format date
    invoice: "INV-2023-001",
    plan: "Premium"
  },
  {
    id: "TXN-002",
    user: "Jane Smith",
    amount: "$85.00",
    paymentMethod: "PayPal",
    status: "pending",
    date: "2023-06-20T14:45:00Z",
    invoice: "INV-2023-002",
    plan: "Basic"
  }
];

// ==================== ASYNC THUNKS ==================== //

/**
 * Marks a transaction as paid by ID
 * Refreshes transactions list after successful update
 */
export const markAsPaid = createAsyncThunk(
  'transactions/markAsPaid',
  async (transactionId, { rejectWithValue, dispatch }) => {
    try {
      await axios.patch(`/api/transactions/${transactionId}/mark-paid`);
      dispatch(fetchTransactionsList()); // Refresh list after update
      return transactionId;
    } catch (error) {
      console.error('Failed to mark transaction as paid:', error.message);
      return rejectWithValue(error.response?.data);
    }
  }
);

/**
 * Retries a failed charge for a transaction
 * Refreshes transactions list after successful retry
 */
export const retryCharge = createAsyncThunk(
  'transactions/retryCharge',
  async (transactionId, { rejectWithValue, dispatch }) => {
    try {
      await axios.post(`/api/transactions/${transactionId}/retry`);
      dispatch(fetchTransactionsList()); // Refresh list after retry
      return transactionId;
    } catch (error) {
      console.error('Failed to retry transaction charge:', error.message);
      return rejectWithValue(error.response?.data);
    }
  }
);

/**
 * Fetches transaction statistics from API
 * Falls back to mock data if API call fails
 */
export const fetchTransactionStats = createAsyncThunk(
  'transactions/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/transactions/stats');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch transaction stats, using mock data. Error:', error.message);
      return rejectWithValue(mockTransactionStats);
    }
  }
);

/**
 * Fetches transactions list with optional filtering
 * @param {Object} params - Contains searchQuery, timeRange, status, and plan
 */
export const fetchTransactionsList = createAsyncThunk(
  'transactions/fetchList',
  async (params, { rejectWithValue }) => {
    try {
      const { searchQuery, timeRange, status, plan } = params;
      const response = await axios.get('/api/transactions', {
        params: { 
          search: searchQuery, 
          range: timeRange,
          status: status !== 'all' ? status : undefined,
          plan: plan !== 'all' ? plan : undefined
        }
      });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch transactions list, using mock data. Error:', error.message);
      return rejectWithValue(mockTransactionsList);
    }
  }
);

/**
 * Exports transaction data as CSV
 * Returns null if export fails
 */
export const exportTransactionsCSV = createAsyncThunk(
  'transactions/exportCSV',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/transactions/export');
      return response.data;
    } catch (error) {
      console.error('Failed to export transactions CSV. Error:', error.message);
      return rejectWithValue(null);
    }
  }
);

/**
 * Refunds a transaction by ID
 * Refreshes transactions list after successful refund
 */
export const refundTransaction = createAsyncThunk(
  'transactions/refundTransaction',
  async (transactionId, { rejectWithValue, dispatch }) => {
    try {
      await axios.post(`/api/transactions/${transactionId}/refund`);
      dispatch(fetchTransactionsList()); // Refresh list after refund
      return transactionId;
    } catch (error) {
      console.error('Failed to refund transaction:', error.message);
      return rejectWithValue(error.response?.data);
    }
  }
);

// ==================== INITIAL STATE ==================== //

/**
 * Initial Redux state structure
 * Contains:
 * - Data arrays for stats and transactions
 * - Loading states for different operations
 * - Error states
 * - Filter and pagination settings
 */
const initialState = {
  stats: [],
  transactions: [],
  loading: {
    stats: false,
    transactions: false,
    export: false,
    markAsPaid: false,
    retryCharge: false
  },
  error: {
    stats: null,
    transactions: null,
    export: null,
    markAsPaid: null,
    retryCharge: null
  },
  filters: {
    timeRange: 'This Month',
    searchQuery: '',
    statusFilter: 'all',
    planFilter: 'all'
  }
};

// ==================== SLICE DEFINITION ==================== //

const transactionSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    // Action to set time range filter
    setTimeRange: (state, action) => {
      state.filters.timeRange = action.payload;
    },
    // Action to set search query
    setSearchQuery: (state, action) => {
      state.filters.searchQuery = action.payload;
    },
    // Action to set status filter
    setStatusFilter: (state, action) => {
      state.filters.statusFilter = action.payload;
    },
    // Action to set plan filter
    setPlanFilter: (state, action) => {
      state.filters.planFilter = action.payload;
    },
    // Clears transaction-related errors
    clearTransactionsError: (state) => {
      state.error.transactions = null;
    },
    // Clears stats-related errors
    clearStatsError: (state) => {
      state.error.stats = null;
    },
    // Clears mark as paid error
    clearMarkAsPaidError: (state) => {
      state.error.markAsPaid = null;
    },
    // Clears retry charge error
    clearRetryChargeError: (state) => {
      state.error.retryCharge = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Handles Next.js hydration (SSR state merging)
      .addCase(HYDRATE, (state, action) => {
        if (action.payload.transactions) {
          return {
            ...state,
            ...action.payload.transactions,
          };
        }
      })
      
      // ========== MARK AS PAID REDUCERS ========== //
      .addCase(markAsPaid.pending, (state) => {
        state.loading.markAsPaid = true;
        state.error.markAsPaid = null;
      })
      .addCase(markAsPaid.fulfilled, (state) => {
        state.loading.markAsPaid = false;
      })
      .addCase(markAsPaid.rejected, (state, action) => {
        state.loading.markAsPaid = false;
        state.error.markAsPaid = action.error;
      })
      
      // ========== RETRY CHARGE REDUCERS ========== //
      .addCase(retryCharge.pending, (state) => {
        state.loading.retryCharge = true;
        state.error.retryCharge = null;
      })
      .addCase(retryCharge.fulfilled, (state) => {
        state.loading.retryCharge = false;
      })
      .addCase(retryCharge.rejected, (state, action) => {
        state.loading.retryCharge = false;
        state.error.retryCharge = action.error;
      })
      
      // ========== FETCH TRANSACTION STATS REDUCERS ========== //
      .addCase(fetchTransactionStats.pending, (state) => {
        state.loading.stats = true;
        state.error.stats = null;
      })
      .addCase(fetchTransactionStats.fulfilled, (state, action) => {
        state.loading.stats = false;
        state.stats = action.payload;
      })
      .addCase(fetchTransactionStats.rejected, (state, action) => {
        state.loading.stats = false;
        state.error.stats = action.error;
        state.stats = action.payload || mockTransactionStats; // Fallback to mock data
      })
      
      // ========== FETCH TRANSACTIONS LIST REDUCERS ========== //
      .addCase(fetchTransactionsList.pending, (state) => {
        state.loading.transactions = true;
        state.error.transactions = null;
      })
      .addCase(fetchTransactionsList.fulfilled, (state, action) => {
        state.loading.transactions = false;
        state.transactions = action.payload;
      })
      .addCase(fetchTransactionsList.rejected, (state, action) => {
        state.loading.transactions = false;
        state.error.transactions = action.error;
        state.transactions = action.payload || mockTransactionsList; // Fallback to mock data
      })
      
      // ========== EXPORT CSV REDUCERS ========== //
      .addCase(exportTransactionsCSV.pending, (state) => {
        state.loading.export = true;
        state.error.export = null;
      })
      .addCase(exportTransactionsCSV.fulfilled, (state) => {
        state.loading.export = false;
      })
      .addCase(exportTransactionsCSV.rejected, (state, action) => {
        state.loading.export = false;
        state.error.export = action.error;
      })
      
      // ========== REFUND TRANSACTION REDUCERS ========== //
      .addCase(refundTransaction.pending, (state) => {
        state.loading.transactions = true;
      })
      .addCase(refundTransaction.fulfilled, (state) => {
        state.loading.transactions = false;
        // List refresh handled by fetchTransactionsList in thunk
      })
      .addCase(refundTransaction.rejected, (state, action) => {
        state.loading.transactions = false;
        state.error.transactions = action.error;
      });
  }
});

// ==================== ACTION EXPORTS ==================== //
export const {
  setTimeRange,
  setSearchQuery,
  setStatusFilter,
  setPlanFilter,
  clearTransactionsError,
  clearStatsError,
  clearMarkAsPaidError,
  clearRetryChargeError
} = transactionSlice.actions;

// ==================== SELECTORS ==================== //

// Base selector for transactions state
export const selectTransactionsState = (state) => state.transactions;

// Memoized selector for transaction stats
export const selectTransactionStats = createSelector(
  [selectTransactionsState],
  (transactions) => transactions.stats
);

// Memoized selector for transactions list
export const selectTransactionsList = createSelector(
  [selectTransactionsState],
  (transactions) => transactions.transactions
);

// Memoized selector for mark as paid loading state
export const selectMarkAsPaidLoading = createSelector(
  [selectTransactionsState],
  (transactions) => transactions.loading.markAsPaid
);

// Memoized selector for retry charge loading state
export const selectRetryChargeLoading = createSelector(
  [selectTransactionsState],
  (transactions) => transactions.loading.retryCharge
);

// Memoized selector for loading states
export const selectTransactionsLoading = createSelector(
  [selectTransactionsState],
  (transactions) => transactions.loading
);

// Memoized selector for error states
export const selectTransactionsErrors = createSelector(
  [selectTransactionsState],
  (transactions) => transactions.error
);

// Memoized selector for filters
export const selectTransactionsFilters = createSelector(
  [selectTransactionsState],
  (transactions) => transactions.filters
);

// Derived selectors for specific filter values
export const selectTimeRange = createSelector(
  [selectTransactionsFilters],
  (filters) => filters.timeRange
);

export const selectSearchQuery = createSelector(
  [selectTransactionsFilters],
  (filters) => filters.searchQuery
);

export const selectStatusFilter = createSelector(
  [selectTransactionsFilters],
  (filters) => filters.statusFilter
);

export const selectPlanFilter = createSelector(
  [selectTransactionsFilters],
  (filters) => filters.planFilter
);

export default transactionSlice.reducer;