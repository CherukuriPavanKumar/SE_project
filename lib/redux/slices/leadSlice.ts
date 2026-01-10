import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { mockLeads } from '@/lib/mock-data';
import { type Lead } from '@/lib/types';


interface LeadState {
  items: Lead[];
  loading: boolean;
  error: string | null;
}

const initialState: LeadState = {
  items: mockLeads,
  loading: false,
  error: null,
};

const leadSlice = createSlice({
  name: 'leads',
  initialState,
  reducers: {
    addLead: (state, action: PayloadAction<Lead>) => {
      state.items.unshift(action.payload);
    },
    updateLead: (state, action: PayloadAction<{ id: string; data: Partial<Lead> }>) => {
      const index = state.items.findIndex(lead => lead.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = { ...state.items[index], ...action.payload.data };
      }
    },
    deleteLead: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(lead => lead.id !== action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { addLead, updateLead, deleteLead, setLoading, setError } = leadSlice.actions;
export default leadSlice.reducer;