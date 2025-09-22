// supabase/functions/register-college-and-admin/index.js

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.js';

console.log('Function cold start: Initializing...');

Deno.serve(async (req) => {
  // Immediately handle OPTIONS request
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // 1. Check for Environment Variables FIRST
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !serviceRoleKey) {
      console.error('CRITICAL: Missing Supabase environment variables.');
      throw new Error('Server configuration error: Missing credentials.');
    }

    // 2. Safely Parse Request Body
    const body = await req.json();
    const { collegeId, collegeName, fullName, email, password } = body;

    if (!collegeId || !collegeName || !fullName || !email || !password) {
      return new Response(JSON.stringify({ error: 'Missing required registration fields.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400, // Bad Request
      });
    }

    // 3. Initialize Admin Client
    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false },
    });

    // 4. Create the Admin User
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: email,
      password: password,
      email_confirm: true, // Auto-confirm the user's email
      user_metadata: {
        full_name: fullName,
        role: 'admin',
      },
    });

    if (authError) {
      console.error('Authentication Error:', authError);
      // Provide a clearer error message to the frontend
      const friendlyMessage = authError.message.includes('unique constraint') 
        ? 'A user with this email already exists.' 
        : authError.message;
      throw new Error(friendlyMessage);
    }
    
    if (!authData || !authData.user) {
      console.error('User creation did not return a user object.');
      throw new Error('Failed to create user account.');
    }
    const user = authData.user;
    console.log(`Successfully created user: ${user.id}`);

    // 5. Insert the College Record
    const { data: collegeData, error: collegeError } = await supabaseAdmin
      .from('accounts_college')
      .insert({
        id: collegeId,
        name: collegeName,
        admin_id: user.id,
      })
      .select()
      .single();

    if (collegeError) {
      console.error('College Insertion Error:', collegeError);
      // CRITICAL: Rollback user creation if college insertion fails
      await supabaseAdmin.auth.admin.deleteUser(user.id);
      console.log(`Rolled back user creation for: ${user.id}`);
      throw new Error('Failed to register the college. Please check the College ID.');
    }
    console.log(`Successfully inserted college: ${collegeData.id}`);

    // 6. Update User Metadata with College ID
    const { error: updateUserError } = await supabaseAdmin.auth.admin.updateUserById(
      user.id,
      { 
        user_metadata: { 
          full_name: fullName, // Re-apply all metadata explicitly
          role: 'admin',
          college_id: collegeData.id 
        } 
      }
    );

    if (updateUserError) {
      console.error('Update User Error:', updateUserError);
      // CRITICAL: Full rollback
      await supabaseAdmin.auth.admin.deleteUser(user.id);
      await supabaseAdmin.from('accounts_college').delete().eq('id', collegeData.id);
      console.log('Rolled back both user and college creation.');
      throw new Error('Failed to finalize admin account setup.');
    }
    console.log(`Successfully updated user ${user.id} with college ID.`);

    // 7. Success
    return new Response(JSON.stringify({ user: user }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('Error in main try-catch block:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500, // Internal Server Error
    });
  }
});