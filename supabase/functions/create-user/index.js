import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.0.0";

// THE FIX: Define corsHeaders directly in this file to remove the broken import.
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle preflight OPTIONS request
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // 1. Create a client with the permissions of the user who called the function
    const userSupabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: req.headers.get("Authorization") } } }
    );

    // 2. Check if the calling user is an admin
    const { data: adminProfile, error: adminError } = await userSupabaseClient
      .from("users")
      .select("role, college_id")
      .single();

    if (adminError || adminProfile.role !== 'admin') {
      throw new Error("Unauthorized: Only admins can create users.");
    }
    
    // 3. Get the new user's details from the request
    const { email, password, full_name, role, department } = await req.json();
    if (!email || !password || !full_name || !role || !department) {
       throw new Error("Missing required fields: email, password, full_name, role, department.");
    }

    // 4. Create a privileged Supabase client to create the new user
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // 5. Create the user. The handle_new_user trigger will automatically create their profile.
    const { data, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email: email,
      password: password,
      email_confirm: true,
      user_metadata: {
        full_name: full_name,
        role: role,
        college_id: adminProfile.college_id,
        department: department,
      },
    });

    if (createError) {
      throw createError;
    }

    return new Response(JSON.stringify({ user: data.user }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 201, // 201 means "Created"
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500, // Use 500 for internal server errors
    });
  }
});