import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  read: boolean;
  timestamp: string;
  link?: string;
}

interface NotificationState {
  items: Notification[];
  unreadCount: number;
}

const initialState: NotificationState = {
  items: [
    {
      id: "NOT001",
      title: "New Lead Assigned",
      message: "You have been assigned a new lead: John Smith",
      type: "info",
      read: false,
      timestamp: new Date().toISOString(),
      link: "/dashboard/leads",
    },
    {
      id: "NOT002",
      title: "Site Visit Reminder",
      message: "Site visit scheduled for tomorrow at 10:00 AM",
      type: "warning",
      read: false,
      timestamp: new Date().toISOString(),
      link: "/dashboard/site-visits",
    },
    {
      id: "NOT003",
      title: "Deal Closed",
      message: "Congratulations! Deal #DEL045 has been closed",
      type: "success",
      read: false,
      timestamp: new Date().toISOString(),
      link: "/dashboard/deals",
    },
  ],
  unreadCount: 3,
};

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<Notification>) => {
      state.items.unshift(action.payload);
      if (!action.payload.read) {
        state.unreadCount += 1;
      }
    },
    markAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.items.find((n) => n.id === action.payload);
      if (notification && !notification.read) {
        notification.read = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },
    markAllAsRead: (state) => {
      state.items.forEach((notification) => {
        notification.read = true;
      });
      state.unreadCount = 0;
    },
    deleteNotification: (state, action: PayloadAction<string>) => {
      const index = state.items.findIndex((n) => n.id === action.payload);
      if (index !== -1) {
        if (!state.items[index].read) {
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
        state.items.splice(index, 1);
      }
    },
  },
});

export const { addNotification, markAsRead, markAllAsRead, deleteNotification } =
  notificationSlice.actions;

export const selectNotifications = (state: RootState) => state.notifications.items;
export const selectUnreadCount = (state: RootState) => state.notifications.unreadCount;

export default notificationSlice.reducer;
