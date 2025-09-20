// supabase/functions/create-user/index.js
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.js'

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create a Supabase client with the SERVICE_ROLE_KEY
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '', // Use the service role key for admin actions
      { auth: { persistSession: false } }
    )

    const { email, password, role, fullName, collegeId } = await req.json()

    if (!email || !password || !role || !fullName || !collegeId) {
      throw new Error("Missing required fields: email, password, role, fullName, collegeId");
    }

    // Use the admin client to create the new user
    const { data: { user }, error } = await supabaseAdmin.auth.admin.createUser({
      email: email,
      password: password,
      email_confirm: true, // Automatically confirm the user's email
      user_metadata: {
        full_name: fullName,
        role: role,
        college_id: collegeId,
      },
    })

    if (error) throw error;
    if (!user) throw new Error("User creation failed.");

    // The database trigger will automatically create their profile.
    return new Response(JSON.stringify({ user }), {
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