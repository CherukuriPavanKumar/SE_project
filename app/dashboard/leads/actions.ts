'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

// 1. Define Validation Schema (Security Blueprint)
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

// Define input type from schema
type AddLeadInput = z.infer<typeof LeadSchema>;

// --- CREATE ---
export async function addLead(rawLeadData: AddLeadInput) {
  try {
    // 2. Validate Input BEFORE touching DB
    const validation = LeadSchema.safeParse(rawLeadData);
    
    if (!validation.success) {
      // FIX: Use .issues instead of .errors to satisfy TypeScript
      return { error: validation.error.issues[0].message };
    }

    const leadData = validation.data;
    const supabase = await createClient()

    // Auth & Org Check
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: "Unauthorized" }

    const { data: profile } = await supabase
      .from('profiles')
      .select('organization_id')
      .eq('id', user.id)
      .single()

    if (!profile?.organization_id) return { error: "Organization not found" }

    // 3. Prepare Data
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

    // 4. Insert
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

    // Return sanitized data to Frontend
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
    // FIX: Log the error to satisfy 'defined but never used' linter rule
    console.error('Add Lead Unexpected Error:', error);
    return { 
      error: error instanceof Error ? error.message : 'An unexpected error occurred' 
    }
  }
}

// --- READ ---
export async function getLeads() {
  try {
    const supabase = await createClient()
    
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Get Leads Supabase Error:', error);
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
    console.error('Get Leads Unexpected Error:', error);
    return [];
  }
}

// --- UPDATE ---
export async function updateLeadStage(leadId: string, newStage: string) {
  try {
    const supabase = await createClient()

    const { error } = await supabase
      .from('leads')
      .update({ stage: newStage })
      .eq('id', leadId)

    if (error) {
      console.error('Update Stage Error:', error);
      return { error: error.message }
    }
    
    revalidatePath('/dashboard/leads')
    return { success: true }
  } catch (error) {
    console.error('Update Stage Unexpected Error:', error);
    return { error: 'Failed to update stage' }
  }
}

// --- DELETE ---
export async function deleteLead(leadId: string) {
  try {
    const supabase = await createClient()

    const { error } = await supabase
      .from('leads')
      .delete()
      .eq('id', leadId)

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