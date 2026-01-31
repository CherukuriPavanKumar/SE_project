import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { type Property } from '@/lib/types';

interface PropertyState {
  items: Property[];
  loading: boolean;
  error: string | null;
}

const initialState: PropertyState = {
  items: [], // Start empty
  loading: false,
  error: null,
};

const propertySlice = createSlice({
  name: 'properties',
  initialState,
  reducers: {
    // NEW: Set from DB
    setProperties: (state, action: PayloadAction<Property[]>) => {
      state.items = action.payload;
      state.loading = false;
      state.error = null;
    },
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
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setProperties, addProperty, updateProperty, deleteProperty, setLoading, setError } = propertySlice.actions;
export default propertySlice.reducer;