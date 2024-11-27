import { createSlice } from '@reduxjs/toolkit';
import { fetchData } from './actions'; // Import the async thunk


interface TransItem {
    T_id: string;
    Tname: string;
    Tpayername: string;
    Temail: string;
    Tamount: number;
    Tdescription: string;
    status: string;
    Timedate: string;
  }

// Define the initial state for the data slice
const initialState = {
    data: [] as TransItem[], // Define the type for data
    loading: false,
    error: null as string | null,
  };

// Create a slice of the state with createSlice
const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {
    // Reducer to set the data
    setData: (state, action) => {
      state.data = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? null;
      });
  },
});

// Export the setData action created by createSlice
export const { setData } = dataSlice.actions;

// Export the reducer to be used in the store
export default dataSlice.reducer;