'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

// Define the shape of your form state
interface AuthState {
  error?: string;
  success?: boolean;
}

export async function login(prevState: AuthState, formData: FormData) {
  const supabase = await createClient()

  // 1. Extract Data
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  // 2. Validate (Basic)
  if (!email || !password) {
    return { error: 'Please enter both email and password' }
  }

  // 3. Authenticate with Supabase
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  // 4. Success
  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signup(prevState: AuthState, formData: FormData) {
  const supabase = await createClient()

  // 1. Extract Data
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const fullName = formData.get('fullName') as string
  const agencyName = formData.get('agencyName') as string
  const phone = formData.get('phone') as string
  const teamSize = formData.get('teamSize') as string

  // 2. Sign Up
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        agency_name: agencyName,
        phone: phone,
        team_size: teamSize,
        role: 'admin',
      },
    },
  })

  if (error) {
    return { error: error.message }
  }

  // 3. Success
  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  
  revalidatePath('/', 'layout')
  redirect('/auth/login')
}