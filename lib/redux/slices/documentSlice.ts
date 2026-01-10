import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { mockDocuments } from '@/lib/mock-data';
import { type Document } from '@/lib/types';


interface DocumentState {
  items: Document[];
}

const initialState: DocumentState = {
  items: mockDocuments,
};

const documentSlice = createSlice({
  name: 'documents',
  initialState,
  reducers: {
    addDocument: (state, action: PayloadAction<Document>) => {
      state.items.unshift(action.payload);
    },
    updateDocument: (state, action: PayloadAction<{ id: string; data: Partial<Document> }>) => {
      const index = state.items.findIndex(doc => doc.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = { ...state.items[index], ...action.payload.data };
      }
    },
    deleteDocument: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(doc => doc.id !== action.payload);
    },
  },
});

export const { addDocument, updateDocument, deleteDocument } = documentSlice.actions;
export default documentSlice.reducer;