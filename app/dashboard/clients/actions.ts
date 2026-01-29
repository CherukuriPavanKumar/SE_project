'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const ClientSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email").optional().or(z.literal('')),
  phone: z.string().min(10, "Phone number is too short"),
  company: z.string().optional(),
  status: z.enum(["Active", "Inactive", "VIP"]),
  preferredAgent: z.string().optional(),
  tags: z.string().optional(), 
  notes: z.string().optional(),
  propertyIds: z.array(z.string()).optional() 
})

type AddClientInput = z.infer<typeof ClientSchema>;

export async function addClient(rawClientData: AddClientInput) {
  try {
    const validation = ClientSchema.safeParse(rawClientData);
    if (!validation.success) return { error: validation.error.issues[0].message };

    const clientData = validation.data;
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: "Unauthorized" }

    const { data: profile } = await supabase
      .from('profiles')
      .select('organization_id')
      .eq('id', user.id)
      .single()

    if (!profile?.organization_id) return { error: "Organization not found" }

    const tagArray = clientData.tags ? clientData.tags.split(',').map(t => t.trim()).filter(Boolean) : [];

    const dbData = {
      organization_id: profile.organization_id,
      name: clientData.name,
      email: clientData.email || null,
      phone: clientData.phone,
      company: clientData.company || null,
      status: clientData.status,
      preferred_agent: null, // Storing agent name in metadata for now
      tags: tagArray,
      notes: clientData.notes || null,
      metadata: {
        legacy_preferred_agent_name: clientData.preferredAgent,
        legacy_property_ids: clientData.propertyIds
      }
    }

    const { data, error } = await supabase.from('clients').insert(dbData).select().single()

    if (error) {
      console.error('Insert Client Error:', error);
      return { error: error.message }
    }

    revalidatePath('/dashboard/clients')

    return { 
      success: true, 
      newClient: {
        id: data.id,
        name: data.name,
        email: data.email || '',
        phone: data.phone,
        company: data.company || '',
        totalPurchases: 0,
        totalValue: "₹0", 
        propertiesOwned: [], 
        status: data.status,
        joinedDate: data.created_at,
        lastInteraction: data.created_at,
        preferredAgent: data.metadata?.legacy_preferred_agent_name || "Unassigned",
        tags: data.tags || [],
        notes: data.notes || '',
      }
    }
  } catch (error) {
    console.error('Add Client Exception:', error);
    return { error: 'An unexpected error occurred' }
  }
}

export async function getClients() {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase.from('clients').select('*').order('created_at', { ascending: false })

    if (error) {
      console.error('Get Clients Error:', error);
      return []
    }

    return data.map(client => ({
      id: client.id,
      name: client.name,
      email: client.email || '',
      phone: client.phone,
      company: client.company || '',
      totalPurchases: client.total_purchases || 0,
      totalValue: client.total_value_display || "₹0",
      propertiesOwned: [], 
      status: client.status,
      joinedDate: client.created_at,
      lastInteraction: client.last_interaction || client.created_at,
      preferredAgent: client.metadata?.legacy_preferred_agent_name || "Unassigned",
      tags: client.tags || [],
      notes: client.notes || '',
    }))
  } catch (error) {
    console.error('Get Clients Exception:', error);
    return []
  }
}

export async function deleteClient(clientId: string) {
  try {
    const supabase = await createClient()
    const { error } = await supabase.from('clients').delete().eq('id', clientId)
    
    if (error) {
      console.error('Delete Client Error:', error);
      return { error: error.message }
    }

    revalidatePath('/dashboard/clients')
    return { success: true }
  } catch (error) {
    console.error('Delete Client Exception:', error);
    return { error: 'Failed to delete client' }
  }
}