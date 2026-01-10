import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { mockProperties } from '@/lib/mock-data';
import { type Property } from '@/lib/types';


interface PropertyState {
  items: Property[];
  loading: boolean;
  error: string | null;
}

const initialState: PropertyState = {
  items: mockProperties,
  loading: false,
  error: null,
};

const propertySlice = createSlice({
  name: 'properties',
  initialState,
  reducers: {
    addProperty: (state, action: PayloadAction<Property>) => {
      state.items.unshift(action.payload);
    },
    updateProperty: (state, action: PayloadAction<{ id: string; data: Partial<Property> }>) => {
      const index = state.items.findIndex(prop => prop.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = { ...state.items[index], ...action.payload.data };
      }
    },
    deleteProperty: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(prop => prop.id !== action.payload);
    },
  },
});

export const { addProperty, updateProperty, deleteProperty } = propertySlice.actions;
export default propertySlice.reducer;