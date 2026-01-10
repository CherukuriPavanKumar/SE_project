import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { mockSiteVisits } from '@/lib/mock-data';
import { type SiteVisit } from '@/lib/types';


interface SiteVisitState {
  items: SiteVisit[];
}

const initialState: SiteVisitState = {
  items: mockSiteVisits,
};

const siteVisitSlice = createSlice({
  name: 'siteVisits',
  initialState,
  reducers: {
    addSiteVisit: (state, action: PayloadAction<SiteVisit>) => {
      state.items.unshift(action.payload);
    },
    updateSiteVisit: (state, action: PayloadAction<{ id: string; data: Partial<SiteVisit> }>) => {
      const index = state.items.findIndex(visit => visit.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = { ...state.items[index], ...action.payload.data };
      }
    },
    deleteSiteVisit: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(visit => visit.id !== action.payload);
    },
  },
});

export const { addSiteVisit, updateSiteVisit, deleteSiteVisit } = siteVisitSlice.actions;
export default siteVisitSlice.reducer;