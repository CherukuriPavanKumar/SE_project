import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { type Client } from '@/lib/types';

interface ClientState {
  items: Client[];
  loading: boolean;
  error: string | null;
}

const initialState: ClientState = {
  items: [], // Start empty, remove mock data if present
  loading: false,
  error: null,
};

const clientSlice = createSlice({
  name: 'clients',
  initialState,
  reducers: {
    // NEW: Set all clients (from DB)
    setClients: (state, action: PayloadAction<Client[]>) => {
      state.items = action.payload;
      state.loading = false;
      state.error = null;
    },
    addClient: (state, action: PayloadAction<Client>) => {
      state.items.unshift(action.payload);
    },
    updateClient: (state, action: PayloadAction<{ id: string; data: Partial<Client> }>) => {
      const index = state.items.findIndex(client => client.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = { ...state.items[index], ...action.payload.data };
      }
    },
    deleteClient: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(client => client.id !== action.payload);
    },
    // NEW: Loading states
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setClients, addClient, updateClient, deleteClient, setLoading, setError } = clientSlice.actions;
export default clientSlice.reducer;