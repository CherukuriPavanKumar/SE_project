import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { type Agent } from '@/lib/types';
import type { RootState } from '../store';

interface AgentState {
  items: Agent[];
  loading: boolean;
  error: string | null;
}

const initialState: AgentState = {
  items: [], // Initialize empty
  loading: false,
  error: null,
};

const agentSlice = createSlice({
  name: 'agents',
  initialState,
  reducers: {
    // NEW: Set from DB
    setAgents: (state, action: PayloadAction<Agent[]>) => {
      state.items = action.payload;
      state.loading = false;
      state.error = null;
    },
    addAgent: (state, action: PayloadAction<Agent>) => {
      state.items.unshift(action.payload);
    },
    updateAgent: (state, action: PayloadAction<{ id: string; data: Partial<Agent> }>) => {
      const index = state.items.findIndex(agent => agent.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = { ...state.items[index], ...action.payload.data };
      }
    },
    deleteAgent: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(agent => agent.id !== action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setAgents, addAgent, updateAgent, deleteAgent, setLoading, setError } = agentSlice.actions;

// Selectors
export const selectAllAgents = (state: RootState) => state.agents.items;

export default agentSlice.reducer;