// lib/types.ts

// ============================================
// CORE ENTITY TYPES
// ============================================

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  source: string;
  budget: string;
  stage: string;
  assignedTo: string;
  lastContact: string;
  nextFollowUp: string;
  notes: string;
  createdAt: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  totalPurchases: number;
  totalValue: string;
  propertiesOwned: string[];
  status: "Active" | "Inactive" | "VIP";
  joinedDate: string;
  lastInteraction: string;
  preferredAgent: string;
  tags: string[];
  notes: string;
}

export interface Property {
  id: string;
  title: string;
  location: string;
  price: string;
  type: string;
  status: "Available" | "Sold" | "Under Negotiation";
  bedrooms: number;
  bathrooms: number;
  area: string;
  image: string;
  description: string;
  listedBy: string;
  listedDate: string;
}

// ✅ FIXED Deal interface to match component usage
export interface Deal {
  id: string;
  leadName: string;
  leadPhone: string;
  leadEmail: string;
  propertyTitle: string;
  propertyAddress: string;
  propertyPrice: string;
  dealValue: string;
  dealStage: string;
  probability: number;
  assignedAgent: string;
  closingDate: string;
  commission: string;
  paymentStatus: string;
  notes: string;
  createdAt: string;
}

export interface SiteVisit {
  id: string;
  leadName: string;
  leadPhone: string;
  propertyTitle: string;
  propertyAddress: string;
  visitDate: string;
  visitTime: string;
  status: string;
  assignedAgent: string;
  notes: string;
  createdAt: string;
}

export interface Document {
  id: string;
  documentName: string;
  documentType: string;
  relatedTo: string;
  relatedEntity: string;
  uploadedBy: string;
  uploadDate: string;
  fileSize: string;
  status: string;
  expiryDate?: string;
  tags: string[];
}

export interface Agent {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "Employee" | "Broker";
  department: string;
  status: "Active" | "Inactive";
  joinedDate: string;
  totalLeads: number;
  totalDeals: number;
  totalRevenue: string;
  commission: string;
  address?: string;
  specialization?: string;
  licenseNumber?: string;
  avatar?: string;
}

// ============================================
// REPORT & ANALYTICS TYPES
// ============================================

export interface MonthlyRevenue {
  month: string;
  revenue: number;
}

export interface MonthlyDeals {
  month: string;
  deals: number;
}

export interface LeadByStage {
  stage: string;
  count: number;
}

export interface DealByStage {
  stage: string;
  count: number;
  value: number;
}

export interface PropertyByStatus {
  status: string;
  count: number;
}

export interface PropertyByType {
  type: string;
  count: number;
}

export interface VisitByStatus {
  status: string;
  count: number;
}

export interface DocumentByType {
  type: string;
  count: number;
}

export interface DocumentByStatus {
  status: string;
  count: number;
}

export interface AgentPerformance {
  name: string;
  leads: number;
  deals: number;
  revenue: number;
  conversionRate: number;
}

export interface ReportMetrics {
  totalRevenue: number;
  totalDeals: number;
  activeClients: number;
  conversionRate: number;
  totalLeads: number;
  leadsByStage: LeadByStage[];
  leadConversionRate: number;
  totalProperties: number;
  propertiesByStatus: PropertyByStatus[];
  propertiesByType: PropertyByType[];
  averagePropertyValue: number;
  dealsByStage: DealByStage[];
  totalDealValue: number;
  averageDealSize: number;
  wonDeals: number;
  lostDeals: number;
  totalSiteVisits: number;
  visitsByStatus: VisitByStatus[];
  upcomingVisits: number;
  completedVisits: number;
  totalDocuments: number;
  documentsByType: DocumentByType[];
  documentsByStatus: DocumentByStatus[];
  agentPerformance: AgentPerformance[];
  monthlyRevenue: MonthlyRevenue[];
  monthlyDeals: MonthlyDeals[];
}

// Settings
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  avatar?: string;
  department: string;
  joinedDate: string;
}

export interface CompanySettings {
  companyName: string;
  companyEmail: string;
  companyPhone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  website?: string;
  logo?: string;
  taxId?: string;
}

export interface NotificationSettings {
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  leadAssignmentNotification: boolean;
  dealUpdateNotification: boolean;
  siteVisitReminderNotification: boolean;
  documentUploadNotification: boolean;
  weeklyReportEmail: boolean;
  monthlyReportEmail: boolean;
}

export interface SecuritySettings {
  twoFactorAuth: boolean;
  sessionTimeout: number;
  passwordLastChanged: string;
  loginAlerts: boolean;
}

export interface AppSettings {
  userProfile: UserProfile;
  companySettings: CompanySettings;
  notificationSettings: NotificationSettings;
  securitySettings: SecuritySettings;
  theme: "light" | "dark" | "system";
  language: string;
  currency: string;
  dateFormat: string;
  timezone: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  read: boolean;
  timestamp: string;
  link?: string;
}

//Support/help desk
export interface SupportTicket {
  id: string;
  ticketNumber: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  category: "Technical" | "Sales" | "General" | "Property Inquiry" | "Complaint" | "Other";
  priority: "Low" | "Medium" | "High" | "Urgent";
  status: "New" | "Open" | "In Progress" | "Pending" | "Resolved" | "Closed";
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  responses: TicketResponse[];
  tags: string[];
  source: "Website" | "Email" | "Phone" | "Chat" | "Dashboard";
}

export interface TicketResponse {
  id: string;
  ticketId: string;
  message: string;
  author: string;
  authorType: "Agent" | "Customer";
  timestamp: string;
  attachments?: string[];
}
