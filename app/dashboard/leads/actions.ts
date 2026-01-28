'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

// Define the shape of data coming from your Frontend Form
interface AddLeadData {
  name: string;
  email: string;
  phone: string;
  source: string;
  budget: string;
  stage: string;
  assignedTo: string;       
  propertyInterest: string[]; 
  nextFollowUp?: string;
  notes: string;
}

// 1. ADD LEAD (Securely to YOUR Organization)
export async function addLead(leadData: AddLeadData) {
  try {
    const supabase = await createClient()

    // A. Get Current User
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError) {
      console.error('Auth error:', userError)
      return { error: "Authentication failed: " + userError.message }
    }
    
    if (!user) {
      console.error('No user found')
      return { error: "Unauthorized - Please log in again" }
    }

    console.log('User authenticated:', user.id)

    // B. Find User's Organization ID with detailed error handling
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('organization_id')
      .eq('id', user.id)
      .single()

    if (profileError) {
      console.error('Profile fetch error:', profileError)
      return { error: `Profile error: ${profileError.message}` }
    }

    if (!profile?.organization_id) {
      console.error('No organization found for user')
      return { error: "Organization not found. Please contact support." }
    }

    console.log('Organization found:', profile.organization_id)

    // C. Map Frontend Data -> Strict Database Schema
    const dbData = {
      organization_id: profile.organization_id,
      name: leadData.name,
      email: leadData.email || null, // Allow null for optional email
      phone: leadData.phone,
      source: leadData.source,
      budget_display: leadData.budget,
      stage: leadData.stage,
      
      // Set to null and store in metadata
      assigned_to: null, 
      property_interest: null, 
      
      metadata: {
        legacy_assigned_agent: leadData.assignedTo,
        legacy_property_interest: leadData.propertyInterest
      },

      next_follow_up: leadData.nextFollowUp || null,
      notes: leadData.notes || null,
    }

    console.log('Attempting to insert:', JSON.stringify(dbData, null, 2))

    // D. Insert into Supabase with detailed error logging
    const { data, error } = await supabase
      .from('leads')
      .insert(dbData)
      .select()
      .single()

    if (error) {
      console.error('Supabase Insert Error:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      })
      
      // Provide more helpful error messages
      if (error.code === '23505') {
        return { error: 'A lead with this information already exists' }
      }
      if (error.code === '23503') {
        return { error: 'Invalid reference data. Please refresh and try again.' }
      }
      if (error.code === '42501') {
        return { error: 'Permission denied. Please check your account permissions.' }
      }
      
      return { error: error.message }
    }

    if (!data) {
      console.error('No data returned from insert')
      return { error: 'Failed to create lead - no data returned' }
    }

    console.log('Lead created successfully:', data.id)

    revalidatePath('/dashboard/leads')
    
    // E. Return Clean Data to Frontend
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
    console.error('Unexpected error in addLead:', error)
    return { 
      error: error instanceof Error ? error.message : 'An unexpected error occurred' 
    }
  }
}

// 2. GET LEADS (Filtered by Organization automatically via RLS)
export async function getLeads() {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching leads:', error)
    return []
  }

  // Transform Database Columns -> Frontend Shape
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
}

// 3. UPDATE STAGE
export async function updateLeadStage(leadId: string, newStage: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('leads')
    .update({ stage: newStage })
    .eq('id', leadId)

  if (error) return { error: error.message }
  revalidatePath('/dashboard/leads')
  return { success: true }
}

// 4. DELETE LEAD
export async function deleteLead(leadId: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('leads')
    .delete()
    .eq('id', leadId)

  if (error) return { error: error.message }
  revalidatePath('/dashboard/leads')
  return { success: true }
}