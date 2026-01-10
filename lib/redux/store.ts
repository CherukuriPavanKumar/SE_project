import { configureStore } from "@reduxjs/toolkit";
import leadReducer from "./slices/leadSlice";
import clientReducer from "./slices/clientSlice";
import propertyReducer from "./slices/propertySlice";
import dealReducer from "./slices/dealSlice";
import siteVisitReducer from "./slices/siteVisitSlice";
import documentReducer from "./slices/documentSlice";
import agentReducer from "./slices/agentSlice";
import reportReducer from "./slices/reportSlice";
import settingsReducer from "./slices/settingsSlice";
import notificationReducer from "./slices/notificationSlice";
import supportReducer from "./slices/supportSlice";

export const store = configureStore({
  reducer: {
    leads: leadReducer,
    clients: clientReducer,
    properties: propertyReducer,
    deals: dealReducer,
    siteVisits: siteVisitReducer,
    documents: documentReducer,
    agents: agentReducer,
    reports: reportReducer,
    settings: settingsReducer,
    notifications: notificationReducer,
    support: supportReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
