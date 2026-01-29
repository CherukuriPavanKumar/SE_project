'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

// --- VALIDATION SCHEMAS ---

// 1. Base Schema
const LeadSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address").optional().or(z.literal('')),
  phone: z.string().min(10, "Phone number is too short"),
  source: z.string(),
  budget: z.string(),
  stage: z.string(),
  assignedTo: z.string().optional(),
  propertyInterest: z.array(z.string()).optional(),
  nextFollowUp: z.string().optional().nullable(),
  notes: z.string().optional(),
})

type AddLeadInput = z.infer<typeof LeadSchema>;

// 2. Partial Schema for Updates
const UpdateLeadSchema = LeadSchema.partial();

// 3. Strict Interface for DB Updates (Fixes 'any' error)
interface LeadUpdatePayload {
  updated_at: string;
  name?: string;
  email?: string;
  phone?: string;
  source?: string;
  budget_display?: string;
  notes?: string;
}

// --- ACTIONS ---

// 1. CREATE LEAD
export async function addLead(rawLeadData: AddLeadInput) {
  try {
    const validation = LeadSchema.safeParse(rawLeadData);
    if (!validation.success) {
      return { error: validation.error.issues[0].message };
    }

    const leadData = validation.data;
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
      name: leadData.name,
      email: leadData.email || null,
      phone: leadData.phone,
      source: leadData.source,
      budget_display: leadData.budget,
      stage: leadData.stage,
      metadata: {
        legacy_assigned_agent: leadData.assignedTo,
        legacy_property_interest: leadData.propertyInterest
      },
      next_follow_up: leadData.nextFollowUp || null,
      notes: leadData.notes || null,
    }

    const { data, error } = await supabase
      .from('leads')
      .insert(dbData)
      .select()
      .single()

    if (error) {
      console.error('Supabase Insert Error:', error);
      return { error: error.message }
    }

    revalidatePath('/dashboard/leads')

    return { 
      success: true, 
      newLead: {
        id: data.id,
        name: data.name,
        email: data.email || '',
        phone: data.phone,
        source: data.source,
        budget: data.budget_display || '',
        stage: data.stage,
        propertyInterest: data.metadata?.legacy_property_interest || [],
        assignedTo: data.metadata?.legacy_assigned_agent || "Unassigned",
        nextFollowUp: data.next_follow_up,
        notes: data.notes || '',
        createdAt: data.created_at,
        lastContact: data.created_at
      }
    }
  } catch (error) {
    console.error('Add Lead Error:', error);
    return { error: 'An unexpected error occurred' }
  }
}

// 2. GET LEADS
export async function getLeads() {
  try {
    const supabase = await createClient()
    
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Get Leads Error:', error);
      return []
    }

    return data.map(lead => ({
      id: lead.id,
      name: lead.name,
      email: lead.email || '',
      phone: lead.phone,
      source: lead.source,
      budget: lead.budget_display || '',
      stage: lead.stage,
      propertyInterest: lead.metadata?.legacy_property_interest || [],
      assignedTo: lead.metadata?.legacy_assigned_agent || "Unassigned",
      nextFollowUp: lead.next_follow_up,
      notes: lead.notes || '',
      createdAt: lead.created_at,
      lastContact: lead.created_at
    }))
  } catch (error) {
    console.error('Get Leads Exception:', error);
    return []
  }
}

// 3. UPDATE LEAD DETAILS
export async function updateLead(leadId: string, rawData: Partial<AddLeadInput>) {
  try {
    const supabase = await createClient()

    const validation = UpdateLeadSchema.safeParse(rawData);
    if (!validation.success) {
      return { error: validation.error.issues[0].message };
    }
    
    const data = validation.data;

    // Use strict interface instead of 'any'
    const dbData: LeadUpdatePayload = {
      updated_at: new Date().toISOString(),
    };

    if (data.name) dbData.name = data.name;
    if (data.email) dbData.email = data.email;
    if (data.phone) dbData.phone = data.phone;
    if (data.source) dbData.source = data.source;
    if (data.budget) dbData.budget_display = data.budget;
    if (data.notes) dbData.notes = data.notes;

    const { error } = await supabase
      .from('leads')
      .update(dbData)
      .eq('id', leadId);

    if (error) {
      console.error('Update Lead Error:', error);
      return { error: error.message };
    }

    revalidatePath('/dashboard/leads');
    return { success: true };

  } catch (error) {
    console.error('Update Lead Exception:', error);
    return { error: 'Failed to update lead details' };
  }
}

// 4. UPDATE STAGE
export async function updateLeadStage(leadId: string, newStage: string) {
  try {
    const supabase = await createClient()

    if (newStage === 'Closed') {
      const { data: leadData, error: fetchError } = await supabase
        .from('leads')
        .select('*')
        .eq('id', leadId)
        .single()

      if (fetchError || !leadData) return { error: "Lead not found" }

      const clientData = {
        organization_id: leadData.organization_id,
        name: leadData.name,
        email: leadData.email,
        phone: leadData.phone,
        status: 'Active',
        company: '', 
        notes: `Converted from Lead on ${new Date().toLocaleDateString()}. \n${leadData.notes || ''}`,
        metadata: {
          legacy_preferred_agent_name: leadData.metadata?.legacy_assigned_agent,
          converted_from_lead_id: leadData.id
        }
      }

      const { error: insertError } = await supabase.from('clients').insert(clientData)

      if (insertError) {
        console.error('Conversion Failed:', insertError)
        return { error: "Failed to create client profile." }
      }

      const { error: deleteError } = await supabase.from('leads').delete().eq('id', leadId)

      if (deleteError) {
        console.error('Delete Lead Failed:', deleteError)
        return { error: "Client created, but failed to remove lead." }
      }

      revalidatePath('/dashboard/leads')
      revalidatePath('/dashboard/clients')
      return { success: true }
    }

    const { error } = await supabase
      .from('leads')
      .update({ stage: newStage })
      .eq('id', leadId)

    if (error) return { error: error.message }
    
    revalidatePath('/dashboard/leads')
    return { success: true }

  } catch (error) {
    console.error('Update Stage Error:', error);
    return { error: 'Failed to update stage' }
  }
}

// 5. DELETE LEAD
export async function deleteLead(leadId: string) {
  try {
    const supabase = await createClient()
    const { error } = await supabase.from('leads').delete().eq('id', leadId)
    
    if (error) {
      console.error('Delete Lead Error:', error);
      return { error: error.message }
    }
    
    revalidatePath('/dashboard/leads')
    return { success: true }
  } catch (error) {
    console.error('Delete Lead Unexpected Error:', error);
    return { error: 'Failed to delete lead' }
  }
}