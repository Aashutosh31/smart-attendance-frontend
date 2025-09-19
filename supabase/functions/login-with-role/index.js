import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.js'

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { email, password, role: selectedRole } = await req.json()

    // Create a temporary client to sign in the user
    // We use the anon key because we don't have a user session yet
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    // First, try to sign in with the provided password
    const { data: sessionData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (signInError) {
      throw new Error(signInError.message) // "Invalid login credentials"
    }

    // If password is correct, check the user's role from the returned session
    const userRole = sessionData.user?.user_metadata?.role

    if (userRole !== selectedRole) {
      // If roles don't match, sign the user out immediately and throw an error
      await supabase.auth.signOut()
      throw new Error(`Role mismatch. You are not a ${selectedRole}.`)
    }

    // If roles match, return the valid session
    return new Response(JSON.stringify(sessionData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})