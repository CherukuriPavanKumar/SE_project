import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { mockDeals } from '@/lib/mock-data';
import { type Deal } from '@/lib/types';


interface DealState {
  items: Deal[];
}

const initialState: DealState = {
  items: mockDeals,
};

const dealSlice = createSlice({
  name: 'deals',
  initialState,
  reducers: {
    addDeal: (state, action: PayloadAction<Deal>) => {
      state.items.unshift(action.payload);
    },
    updateDeal: (state, action: PayloadAction<{ id: string; data: Partial<Deal> }>) => {
      const index = state.items.findIndex(deal => deal.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = { ...state.items[index], ...action.payload.data };
      }
    },
    deleteDeal: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(deal => deal.id !== action.payload);
    },
  },
});

export const { addDeal, updateDeal, deleteDeal } = dealSlice.actions;
export default dealSlice.reducer;