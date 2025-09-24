// supabase/functions/register-college-and-admin/index.js
// VERSION 2: Decoupled from Django - Interacts only with Supabase Auth and public.colleges table.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.js';

console.log('Function cold start: Initializing (Supabase-only version)...');

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // 1. Get Supabase Environment Variables (from function secrets)
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !serviceRoleKey) {
      console.error('CRITICAL: Missing Supabase environment variables in function settings.');
      throw new Error('Server configuration error: Missing credentials.');
    }

    const body = await req.json();
    const { collegeId, collegeName, fullName, email, password } = body;

    if (!collegeId || !collegeName || !fullName || !email || !password) {
      return new Response(JSON.stringify({ error: 'Missing required fields.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false },
    });

    // 2. Check if College ID is already taken in our new 'colleges' table
    const { data: existingCollege, error: checkError } = await supabaseAdmin
      .from('colleges')
      .select('id')
      .eq('id', collegeId)
      .single();

    // A server-side error occurred during the check
    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 means "not found", which is what we want
        console.error('Database check error:', checkError);
        throw new Error('Could not verify college details. Please try again.');
    }
      
    // If a college was found, the ID is taken.
    if (existingCollege) {
      return new Response(JSON.stringify({ error: 'This College ID is already taken.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 409, // 409 Conflict is the appropriate status code
      });
    }

    // 3. Create the Admin User in Supabase Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: email,
      password: password,
      email_confirm: true,
      user_metadata: {
        full_name: fullName,
        role: 'admin', // Set the user's role
      },
    });

    if (authError) {
      const friendlyMessage = authError.message.includes('unique constraint') 
        ? 'A user with this email already exists.' 
        : 'Could not create the admin user.';
      throw new Error(friendlyMessage);
    }
    
    const user = authData.user;
    console.log(`Successfully created user in Supabase Auth: ${user.id}`);

    // 4. Insert the new college into our 'colleges' table
    const { error: collegeError } = await supabaseAdmin
      .from('colleges')
      .insert({
        id: collegeId,
        name: collegeName,
        admin_id: user.id,
      });

    // If inserting the college fails, we MUST delete the user we just created to prevent orphaned accounts
    if (collegeError) {
      console.error('College Insertion Error:', collegeError);
      await supabaseAdmin.auth.admin.deleteUser(user.id);
      console.log(`Rolled back user creation for: ${user.id}`);
      throw new Error('Failed to save college details after creating user.');
    }
    console.log(`Successfully inserted college: ${collegeId}`);

    // 5. Final Step: Update the user's metadata to include their college_id
    const { error: updateUserError } = await supabaseAdmin.auth.admin.updateUserById(
      user.id,
      { user_metadata: { ...user.user_metadata, college_id: collegeId } }
    );

    if (updateUserError) {
        console.error('Update User Metadata Error:', updateUserError);
        // Full rollback
        await supabaseAdmin.auth.admin.deleteUser(user.id);
        await supabaseAdmin.from('colleges').delete().eq('id', collegeId);
        console.log('Rolled back both user and college creation due to metadata update failure.');
        throw new Error('Failed to finalize admin account setup.');
    }
    console.log(`Successfully updated user ${user.id} with college ID: ${collegeId}`);

    // 6. Success!
    return new Response(JSON.stringify({ message: "College and admin registered successfully!" }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('Error in main try-catch block:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});