'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

// --- 1. VALIDATION SCHEMAS ---

const PropertySchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  location: z.string().min(2, "Location is required"),
  price: z.string().min(1, "Price is required"),
  type: z.string(),
  status: z.enum(["Available", "Sold", "Under Negotiation"]),
  bedrooms: z.number().int().nonnegative(),
  bathrooms: z.number().int().nonnegative(),
  area: z.string().min(1, "Area is required"),
  description: z.string().optional(),
  listedBy: z.string().optional(),
  soldTo: z.string().optional(),
})

type AddPropertyInput = z.infer<typeof PropertySchema>;
const UpdatePropertySchema = PropertySchema.partial();

// --- 2. TYPES & HELPERS ---

interface ClientMetadata {
  legacy_property_ids?: string[];
  [key: string]: unknown;
}

interface PropertyMetadata {
  listing_agent_name?: string;
  sold_to_client?: string | null;
  [key: string]: unknown;
}

interface PropertyUpdatePayload {
  updated_at: string;
  title?: string;
  location?: string;
  price_display?: string;
  property_type?: string;
  status?: "Available" | "Sold" | "Under Negotiation";
  bedrooms?: number;
  bathrooms?: number;
  area_display?: string;
  description?: string | null;
  metadata?: PropertyMetadata;
}

// Currency Helpers
function parseIndianCurrency(str: string | null | undefined): number {
  if (!str) return 0;
  const clean = str.replace(/[^\d.]/g, '');
  const val = parseFloat(clean);
  if (isNaN(val)) return 0;
  if (str.includes('Cr')) return val * 10000000;
  if (str.includes('L')) return val * 100000;
  if (str.toLowerCase().includes('k')) return val * 1000;
  return val;
}

function formatIndianCurrency(num: number): string {
  if (num <= 0) return "₹0";
  if (num >= 10000000) return `₹${(num / 10000000).toFixed(2)} Cr`;
  if (num >= 100000) return `₹${(num / 100000).toFixed(2)} L`;
  return `₹${num.toLocaleString('en-IN')}`;
}

// Helper: ADD stats to Client
async function updateClientStats(clientName: string, propertyPrice: string, propertyTitle: string) {
  const supabase = await createClient();
  
  const { data: client } = await supabase
    .from('clients')
    .select('id, total_purchases, total_value_display, metadata')
    .eq('name', clientName)
    .single();

  if (!client) return;

  const currentTotal = parseIndianCurrency(client.total_value_display);
  const priceToAdd = parseIndianCurrency(propertyPrice);
  const newTotalDisplay = formatIndianCurrency(currentTotal + priceToAdd);

  const meta = client.metadata as ClientMetadata | null;
  const currentProps: string[] = meta?.legacy_property_ids || [];
  
  const updatedProps = currentProps.includes(propertyTitle) 
    ? currentProps 
    : [...currentProps, propertyTitle];

  await supabase
    .from('clients')
    .update({
      total_purchases: (client.total_purchases || 0) + 1,
      total_value_display: newTotalDisplay,
      metadata: {
        ...meta,
        legacy_property_ids: updatedProps
      }
    })
    .eq('id', client.id);
}

// Helper: REVERT/SUBTRACT stats from Client
async function revertClientStats(clientName: string, propertyPrice: string, propertyTitle: string) {
  const supabase = await createClient();

  const { data: client } = await supabase
    .from('clients')
    .select('id, total_purchases, total_value_display, metadata')
    .eq('name', clientName)
    .single();

  if (!client) return;

  const currentTotal = parseIndianCurrency(client.total_value_display);
  const priceToRemove = parseIndianCurrency(propertyPrice);
  const newTotal = Math.max(0, currentTotal - priceToRemove);
  const newTotalDisplay = formatIndianCurrency(newTotal);

  const newCount = Math.max(0, (client.total_purchases || 0) - 1);

  const meta = client.metadata as ClientMetadata | null;
  const currentProps: string[] = meta?.legacy_property_ids || [];
  const updatedProps = currentProps.filter(p => p !== propertyTitle);

  await supabase
    .from('clients')
    .update({
      total_purchases: newCount,
      total_value_display: newTotalDisplay,
      metadata: {
        ...meta,
        legacy_property_ids: updatedProps
      }
    })
    .eq('id', client.id);
}

// --- 3. ACTIONS ---

// CREATE
export async function addProperty(rawPropData: AddPropertyInput) {
  try {
    const validation = PropertySchema.safeParse(rawPropData);
    if (!validation.success) return { error: validation.error.issues[0].message };

    const propData = validation.data;
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: "Unauthorized" }

    const { data: profile } = await supabase.from('profiles').select('organization_id').eq('id', user.id).single()
    if (!profile?.organization_id) return { error: "Organization not found" }

    const dbData = {
      organization_id: profile.organization_id,
      title: propData.title,
      location: propData.location,
      price: 0,
      price_display: propData.price,
      property_type: propData.type,
      status: propData.status,
      bedrooms: propData.bedrooms,
      bathrooms: propData.bathrooms,
      area_display: propData.area,
      description: propData.description || null,
      metadata: {
        listing_agent_name: propData.listedBy,
        sold_to_client: propData.status === 'Sold' ? propData.soldTo : null
      },
      listed_date: new Date().toISOString()
    }

    const { data, error } = await supabase.from('properties').insert(dbData).select().single()

    if (error) {
      console.error('Insert Property Error:', error);
      return { error: error.message }
    }

    // UPDATE CLIENT STATS IF SOLD
    if (propData.status === 'Sold' && propData.soldTo) {
      await updateClientStats(propData.soldTo, propData.price, propData.title);
    }

    revalidatePath('/dashboard/properties')
    revalidatePath('/dashboard/clients')

    return { 
      success: true, 
      newProperty: {
        id: data.id,
        title: data.title,
        location: data.location,
        price: data.price_display || "₹0",
        type: data.property_type,
        status: data.status,
        bedrooms: data.bedrooms,
        bathrooms: data.bathrooms,
        area: data.area_display,
        image: data.primary_image || "",
        description: data.description || "",
        listedBy: (data.metadata as PropertyMetadata)?.listing_agent_name || "Unknown",
        listedDate: data.listed_date,
        soldTo: (data.metadata as PropertyMetadata)?.sold_to_client
      }
    }
  } catch (error) {
    console.error('Add Property Exception:', error);
    return { error: 'An unexpected error occurred' }
  }
}

// READ
export async function getProperties() {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase.from('properties').select('*').order('created_at', { ascending: false })

    if (error) {
        console.error('Get Properties Error:', error);
        return [];
    }

    return data.map(prop => {
      const meta = prop.metadata as PropertyMetadata | null;
      return {
        id: prop.id,
        title: prop.title,
        location: prop.location,
        price: prop.price_display || "₹0",
        type: prop.property_type || "Apartment",
        status: prop.status || "Available",
        bedrooms: prop.bedrooms || 0,
        bathrooms: prop.bathrooms || 0,
        area: prop.area_display || "0 sqft",
        image: prop.primary_image || "",
        description: prop.description || "",
        listedBy: meta?.listing_agent_name || "Unknown",
        listedDate: prop.listed_date,
        soldTo: meta?.sold_to_client
      };
    })
  } catch (error) {
    console.error('Get Properties Exception:', error);
    return []
  }
}

// UPDATE (With Revert Logic)
export async function updateProperty(propertyId: string, rawData: Partial<AddPropertyInput>) {
  try {
    const supabase = await createClient();
    
    // 1. Fetch CURRENT data
    const { data: currentProp } = await supabase
      .from('properties')
      .select('status, price_display, title, metadata')
      .eq('id', propertyId)
      .single();

    if (!currentProp) return { error: "Property not found" };

    const validation = UpdatePropertySchema.safeParse(rawData);
    if (!validation.success) return { error: validation.error.issues[0].message };
    const data = validation.data;

    // Safely cast current metadata
    const currentMeta = currentProp.metadata as PropertyMetadata | null;

    // 2. LOGIC: Check for Status Changes
    const oldStatus = currentProp.status;
    const newStatus = data.status || oldStatus;
    const oldClient = currentMeta?.sold_to_client;
    const newClient = data.soldTo; 

    // CASE A: Was Sold -> Now NOT Sold (Revert stats)
    if (oldStatus === 'Sold' && newStatus !== 'Sold' && oldClient) {
      await revertClientStats(oldClient, currentProp.price_display, currentProp.title);
    }

    // CASE B: Sold -> Sold, but different Client (Revert old)
    if (oldStatus === 'Sold' && newStatus === 'Sold' && newClient && oldClient !== newClient) {
        if (oldClient) await revertClientStats(oldClient, currentProp.price_display, currentProp.title);
    }

    // 3. Prepare Update Payload
    const dbData: PropertyUpdatePayload = {
      updated_at: new Date().toISOString(),
    };

    if (data.title) dbData.title = data.title;
    if (data.location) dbData.location = data.location;
    if (data.price) dbData.price_display = data.price;
    if (data.type) dbData.property_type = data.type;
    if (data.status) dbData.status = data.status;
    if (data.bedrooms !== undefined) dbData.bedrooms = data.bedrooms;
    if (data.bathrooms !== undefined) dbData.bathrooms = data.bathrooms;
    if (data.area) dbData.area_display = data.area;
    if (data.description !== undefined) dbData.description = data.description;
    
    const metadata: PropertyMetadata = { ...currentMeta }; 
    if (data.listedBy) metadata.listing_agent_name = data.listedBy;
    
    // Logic for Sold To Metadata
    if (newStatus === 'Sold' && newClient) {
      metadata.sold_to_client = newClient;
    } else if (newStatus !== 'Sold') {
      metadata.sold_to_client = null; 
    }

    dbData.metadata = metadata;

    const { error } = await supabase.from('properties').update(dbData).eq('id', propertyId);

    if (error) {
      console.error('Update Property Error:', error);
      return { error: error.message };
    }

    // CASE C: Add stats to New Client
    if (newStatus === 'Sold' && newClient) {
        if (oldStatus !== 'Sold' || oldClient !== newClient) {
             const finalPrice = data.price || currentProp.price_display;
             const finalTitle = data.title || currentProp.title;
             await updateClientStats(newClient, finalPrice, finalTitle);
        }
    }

    revalidatePath('/dashboard/properties');
    revalidatePath('/dashboard/clients');
    return { success: true };

  } catch (error) {
    console.error('Update Property Exception:', error);
    return { error: 'Failed to update property' };
  }
}

// DELETE (With Revert Logic)
export async function deleteProperty(propertyId: string) {
  try {
    const supabase = await createClient()

    // 1. Fetch before delete to check if sold
    const { data: currentProp } = await supabase
      .from('properties')
      .select('status, price_display, title, metadata')
      .eq('id', propertyId)
      .single();

    if (currentProp) {
        const meta = currentProp.metadata as PropertyMetadata | null;
        // 2. If Sold, revert client stats
        if (currentProp.status === 'Sold' && meta?.sold_to_client) {
            await revertClientStats(meta.sold_to_client, currentProp.price_display, currentProp.title);
        }
    }

    const { error } = await supabase.from('properties').delete().eq('id', propertyId)
    if (error) {
        console.error('Delete Property Error:', error);
        return { error: error.message }
    }
    
    revalidatePath('/dashboard/properties')
    revalidatePath('/dashboard/clients')
    return { success: true }
  } catch (error) {
    console.error('Delete Property Exception:', error);
    return { error: 'Failed to delete property' }
  }
}