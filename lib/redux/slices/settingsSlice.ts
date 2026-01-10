import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { AppSettings, UserProfile, CompanySettings, NotificationSettings, SecuritySettings } from "@/lib/types";
import type { RootState } from "../store";

const initialState: AppSettings = {
  userProfile: {
    id: "USR001",
    name: "Admin User",
    email: "admin@realestate.com",
    phone: "+91 98765 43210",
    role: "Administrator",
    department: "Management",
    joinedDate: "2024-01-15",
  },
  companySettings: {
    companyName: "Prime Real Estate Solutions",
    companyEmail: "info@primerealestate.com",
    companyPhone: "+91 11 4567 8900",
    address: "123 Business Park, Tower A",
    city: "Mumbai",
    state: "Maharashtra",
    country: "India",
    zipCode: "400001",
    website: "www.primerealestate.com",
  },
  notificationSettings: {
    emailNotifications: true,
    smsNotifications: true,
    pushNotifications: true,
    leadAssignmentNotification: true,
    dealUpdateNotification: true,
    siteVisitReminderNotification: true,
    documentUploadNotification: false,
    weeklyReportEmail: true,
    monthlyReportEmail: true,
  },
  securitySettings: {
    twoFactorAuth: false,
    sessionTimeout: 30,
    passwordLastChanged: "2025-12-01",
    loginAlerts: true,
  },
  theme: "light",
  language: "en",
  currency: "INR",
  dateFormat: "DD/MM/YYYY",
  timezone: "Asia/Kolkata",
};

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    updateUserProfile: (state, action: PayloadAction<Partial<UserProfile>>) => {
      state.userProfile = { ...state.userProfile, ...action.payload };
    },
    updateCompanySettings: (state, action: PayloadAction<Partial<CompanySettings>>) => {
      state.companySettings = { ...state.companySettings, ...action.payload };
    },
    updateNotificationSettings: (state, action: PayloadAction<Partial<NotificationSettings>>) => {
      state.notificationSettings = { ...state.notificationSettings, ...action.payload };
    },
    updateSecuritySettings: (state, action: PayloadAction<Partial<SecuritySettings>>) => {
      state.securitySettings = { ...state.securitySettings, ...action.payload };
    },
    updateTheme: (state, action: PayloadAction<"light" | "dark" | "system">) => {
      state.theme = action.payload;
    },
    updateLanguage: (state, action: PayloadAction<string>) => {
      state.language = action.payload;
    },
    updateCurrency: (state, action: PayloadAction<string>) => {
      state.currency = action.payload;
    },
    updateDateFormat: (state, action: PayloadAction<string>) => {
      state.dateFormat = action.payload;
    },
    updateTimezone: (state, action: PayloadAction<string>) => {
      state.timezone = action.payload;
    },
    resetSettings: () => initialState,
  },
});

export const {
  updateUserProfile,
  updateCompanySettings,
  updateNotificationSettings,
  updateSecuritySettings,
  updateTheme,
  updateLanguage,
  updateCurrency,
  updateDateFormat,
  updateTimezone,
  resetSettings,
} = settingsSlice.actions;

export const selectSettings = (state: RootState) => state.settings;
export const selectUserProfile = (state: RootState) => state.settings.userProfile;
export const selectCompanySettings = (state: RootState) => state.settings.companySettings;
export const selectNotificationSettings = (state: RootState) => state.settings.notificationSettings;
export const selectSecuritySettings = (state: RootState) => state.settings.securitySettings;

export default settingsSlice.reducer;
