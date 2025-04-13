import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Fallback quotes
const FALLBACK_QUOTES = [
  {
    text: "The best way to predict the future is to create it",
    author: "Peter Drucker"
  },
  {
    text: "Data is the new oil",
    author: "Clive Humby"
  },
  {
    text: "Success is not final, failure is not fatal: It is the courage to continue that counts",
    author: "Winston Churchill"
  }
];

// Async thunk for fetching quotes
export const fetchQuote = createAsyncThunk(
  'quote/fetchQuote',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('https://api.quotable.io/random?tags=technology|business|success', {
        timeout: 3000 // 3 second timeout
      });
      return {
        text: response.data.content,
        author: response.data.author
      };
    } catch (error) {
      // Return random fallback quote if API fails
      const randomIndex = Math.floor(Math.random() * FALLBACK_QUOTES.length);
      return rejectWithValue(FALLBACK_QUOTES[randomIndex]);
    }
  }
);

const quoteSlice = createSlice({
  name: 'quote',
  initialState: {
    data: null,
    loading: false,
    error: null,
    isFallback: false
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuote.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQuote.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.isFallback = false;
      })
      .addCase(fetchQuote.rejected, (state, action) => {
        state.loading = false;
        state.data = action.payload; // This will be our fallback quote
        state.error = 'Failed to fetch quote from API';
        state.isFallback = true;
      });
  }
});

export default quoteSlice.reducer;