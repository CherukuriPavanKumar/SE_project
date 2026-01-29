'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

// --- Validation Schemas ---

// 1. Schema for Creating an Agent
const AgentSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number is too short"),
  role: z.enum(["Employee", "Broker"]),
  department: z.string(),
  status: z.enum(["Active", "Inactive"]),
  specialization: z.string(),
  licenseNumber: z.string().optional(),
  address: z.string().optional(),
})

type AddAgentInput = z.infer<typeof AgentSchema>;

// 2. Schema for Updating (Partial)
const UpdateAgentSchema = AgentSchema.partial().omit({}); 

// Helper: Format DB numbers to Frontend Strings
function formatCurrency(amount: number | null): string {
  if (!amount) return "₹0";
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)} Cr`;
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(2)} L`;
  return `₹${amount.toLocaleString('en-IN')}`;
}

// --- ACTIONS ---

// 1. CREATE
export async function addAgent(rawAgentData: AddAgentInput) {
  try {
    const validation = AgentSchema.safeParse(rawAgentData);
    if (!validation.success) {
      return { error: validation.error.issues[0].message };
    }

    const agentData = validation.data;
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: "Unauthorized" }

    const { data: profile } = await supabase
      .from('profiles')
      .select('organization_id')
      .eq('id', user.id)
      .single()

    if (!profile?.organization_id) return { error: "Organization not found" }

    const dbData = {
      organization_id: profile.organization_id,
      name: agentData.name,
      email: agentData.email,
      phone: agentData.phone,
      role: agentData.role,
      department: agentData.department,
      status: agentData.status,
      specialization: agentData.specialization,
      license_number: agentData.role === 'Broker' ? agentData.licenseNumber : null,
      address: agentData.address || null,
      total_leads: 0,
      total_deals: 0,
      total_revenue: 0,
      commission: 0,
      joined_date: new Date().toISOString()
    }

    const { data, error } = await supabase
      .from('agents')
      .insert(dbData)
      .select()
      .single()

    if (error) {
      console.error('Insert Agent Error:', error);
      return { error: error.message }
    }

    revalidatePath('/dashboard/agents')

    return { 
      success: true, 
      newAgent: {
        id: data.id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        role: data.role,
        department: data.department,
        status: data.status,
        joinedDate: data.joined_date,
        totalLeads: 0,
        totalDeals: 0,
        totalRevenue: "₹0",
        commission: "₹0",
        specialization: data.specialization,
        address: data.address || '',
        licenseNumber: data.license_number || undefined
      }
    }
  } catch (error) {
    console.error('Add Agent Exception:', error);
    return { error: 'An unexpected error occurred' }
  }
}

// 2. READ
export async function getAgents() {
  try {
    const supabase = await createClient()
    
    const { data, error } = await supabase
      .from('agents')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Get Agents Error:', error);
      return []
    }

    return data.map(agent => ({
      id: agent.id,
      name: agent.name,
      email: agent.email,
      phone: agent.phone,
      role: agent.role,
      department: agent.department || "Sales",
      status: agent.status,
      joinedDate: agent.joined_date,
      totalLeads: agent.total_leads || 0,
      totalDeals: agent.total_deals || 0,
      totalRevenue: formatCurrency(agent.total_revenue),
      commission: formatCurrency(agent.commission),
      specialization: agent.specialization || "General",
      address: agent.address || "",
      licenseNumber: agent.license_number || undefined
    }))
  } catch (error) {
    console.error('Get Agents Exception:', error);
    return []
  }
}

// 3. UPDATE
// Define strict interface for DB update to avoid 'any'
interface AgentUpdatePayload {
  updated_at: string;
  name?: string;
  email?: string;
  phone?: string;
  role?: "Employee" | "Broker";
  department?: string;
  status?: "Active" | "Inactive";
  specialization?: string;
  address?: string | null;
  license_number?: string | null;
}

export async function updateAgent(agentId: string, rawData: Partial<AddAgentInput>) {
  try {
    const supabase = await createClient()

    const validation = UpdateAgentSchema.safeParse(rawData);
    if (!validation.success) {
      return { error: validation.error.issues[0].message };
    }
    
    const data = validation.data;

    // Use specific type instead of 'any'
    const dbData: AgentUpdatePayload = {
      updated_at: new Date().toISOString(),
    };
    
    if (data.name) dbData.name = data.name;
    if (data.email) dbData.email = data.email;
    if (data.phone) dbData.phone = data.phone;
    if (data.role) dbData.role = data.role;
    if (data.department) dbData.department = data.department;
    if (data.status) dbData.status = data.status;
    if (data.specialization) dbData.specialization = data.specialization;
    if (data.address) dbData.address = data.address;
    
    if (data.role === 'Employee') {
       dbData.license_number = null; 
    } else if (data.licenseNumber !== undefined) {
       dbData.license_number = data.licenseNumber;
    }

    const { error } = await supabase
      .from('agents')
      .update(dbData)
      .eq('id', agentId);

    if (error) {
      console.error('Update Agent Error:', error);
      return { error: error.message };
    }

    revalidatePath('/dashboard/agents');
    return { success: true };

  } catch (error) {
    console.error('Update Agent Exception:', error);
    return { error: 'Failed to update agent' };
  }
}

// 4. DELETE
export async function deleteAgent(agentId: string) {
  try {
    const supabase = await createClient()
    const { error } = await supabase.from('agents').delete().eq('id', agentId)
    
    if (error) {
      console.error('Delete Agent Error:', error);
      return { error: error.message }
    }

    revalidatePath('/dashboard/agents')
    return { success: true }
  } catch (error) {
    console.error('Delete Agent Exception:', error);
    return { error: 'Failed to delete agent' }
  }
}