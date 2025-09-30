import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.js'

serve(async (req) => {
  // Handle preflight CORS requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Connect to Supabase with admin privileges to perform user creation
    const supabaseAdmin = createClient(
      Deno.env.get('VITE_SUPABASE_URL') ?? '',
      Deno.env.get('VITE_SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Create a client with the user's auth token to check their permissions
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
        throw new Error("Missing Authorization header.");
    }
    const supabaseClient = createClient(
        Deno.env.get('VITE_SUPABASE_URL') ?? '',
        Deno.env.get('VITE_SUPABASE_ANON_KEY') ?? '',
        { global: { headers: { Authorization: authHeader } } }
    )

    // 1. Check if the calling user is authenticated
    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) {
      throw new Error("Authentication error: User not found.");
    }
    
    // 2. Fetch the user's profile to check their role
    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profileError) throw profileError;
    
    // 3. Authorization Check: Ensure the user is either an 'admin' or an 'hod'
    const authorizedRoles = ['admin', 'hod'];
    if (!authorizedRoles.includes(profile.role)) {
        throw new Error("Authorization error: User does not have permission to create users.");
    }

    // 4. Get the new user details from the request body
    const { fullName, email, role, collegeId } = await req.json();
    if (!fullName || !email || !role || !collegeId) {
        throw new Error("Missing required fields: fullName, email, role, collegeId");
    }

    // 5. Invite the new user using the admin client
    const { data: inviteData, error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(
        email, 
        { data: { full_name: fullName } }
    );

    if (inviteError) {
        throw new Error(`Supabase invite error: ${inviteError.message}`);
    }
    
    if(!inviteData.user) {
        throw new Error("Could not create user account.");
    }

    const newUserId = inviteData.user.id;

    // 6. Create a profile for the newly invited user
    const { error: newProfileError } = await supabaseAdmin
      .from('profiles')
      .insert({
        id: newUserId,
        full_name: fullName,
        role: role,
        college_id: collegeId,
        password_set: false // Ensure new users must set their password
      });

    if (newProfileError) {
      // If profile creation fails, delete the invited user to prevent orphaned accounts
      await supabaseAdmin.auth.admin.deleteUser(newUserId);
      throw new Error(`Failed to create profile: ${newProfileError.message}`);
    }

    // Return a success response
    return new Response(JSON.stringify({ success: true, message: `Invitation sent to ${email}` }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    // Return an error response
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})