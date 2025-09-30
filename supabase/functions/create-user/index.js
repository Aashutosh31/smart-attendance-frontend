// File Path: supabase/functions/create-user/index.js
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.js';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL'),
      Deno.env.get('SUPABASE_ANON_KEY'),
      { global: { headers: { Authorization: req.headers.get('Authorization') } } }
    );

    const { data: { user }, error: userErr } = await supabaseClient.auth.getUser();
    if (userErr) throw userErr;
    if (!user) throw new Error("User not found.");

    const { data: adminProfile, error: profileErr } = await supabaseAdmin
      .from('profiles')
      .select('role, college_id')
      .eq('id', user.id)
      .single();

    if (profileErr || adminProfile.role !== 'admin') {
      throw new Error("Unauthorized: Only admins can create users.");
    }
    
    // 1. Get the new 'department' field from the request body.
    const { email, password, full_name, role, department } = await req.json();
    if (!email || !password || !full_name || !role || !department) {
      throw new Error("Missing required fields: email, password, full_name, role, department.");
    }

    // 2. Add the 'department' to the user_metadata.
    // The existing SQL trigger will automatically copy this to the 'profiles' table.
    const { data: newUser, error: inviteError } = await supabaseAdmin.auth.admin.createUser({
      email: email,
      password: password,
      email_confirm: true,
      user_metadata: {
        full_name: full_name,
        role: role,
        college_id: adminProfile.college_id,
        department: department, // <-- ADDED
      },
    });

    if (inviteError) throw inviteError;

    return new Response(JSON.stringify({ user: newUser }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});