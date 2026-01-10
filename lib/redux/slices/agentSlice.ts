// lib/redux/slices/agentSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { mockAgents } from '@/lib/mock-data';
import { type Agent } from '@/lib/types';
import type { RootState } from '../store';

interface AgentState {
  items: Agent[];
  loading: boolean;
  error: string | null;
}

const initialState: AgentState = {
  items: mockAgents,
  loading: false,
  error: null,
};

const agentSlice = createSlice({
  name: 'agents',
  initialState,
  reducers: {
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

export const { addAgent, updateAgent, deleteAgent, setLoading, setError } = agentSlice.actions;

// Selectors
export const selectAllAgents = (state: RootState) => state.agents.items;
export const selectAgentsLoading = (state: RootState) => state.agents.loading;
export const selectAgentsError = (state: RootState) => state.agents.error;

export default agentSlice.reducer;
