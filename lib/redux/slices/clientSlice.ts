import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { mockClients } from '@/lib/mock-data';
import { type Client } from '@/lib/types';

interface ClientState {
  items: Client[];
  loading: boolean;
  error: string | null;
}

const initialState: ClientState = {
  items: mockClients,
  loading: false,
  error: null,
};

const clientSlice = createSlice({
  name: 'clients',
  initialState,
  reducers: {
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
  },
});

export const { addClient, updateClient, deleteClient } = clientSlice.actions;
export default clientSlice.reducer;