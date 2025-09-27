import { serve } from "https://deno.land/std/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) throw new Error("Missing Authorization");

    const token = authHeader.split(" ")[1];

    const userClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: `Bearer ${token}` } },
    });

    const { data: { user }, error: userError } = await userClient.auth.getUser();
    if (userError || !user) throw new Error("Unauthorized");

    const { data: adminProfile, error: profileError } = await userClient
      .from("users")
      .select("college_id")
      .eq("id", user.id)
      .single();

    if (profileError || !adminProfile) throw new Error("Admin profile fetch failed");

    // Read request JSON for new HOD's details
    const { email, password, full_name, role, department } = await req.json();

    if (!email || !password || !full_name || !role || !department) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
    }

    const adminClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const { data: newUser, error: createError } = await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name,
        role,
        department,
        college_id: adminProfile.college_id,
      },
    });

    if (createError) {
      return new Response(JSON.stringify({ error: createError.message }), { status: 500 });
    }

    return new Response(JSON.stringify({ message: "HOD created successfully", user: newUser }), {
      status: 201,
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 401 });
  }
});
