// File: supabase/functions/sync-user-to-mongo/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { MongoClient } from "https://deno.land/x/mongo@v0.31.1/mod.ts";

// Get the MongoDB connection string from your Supabase project's secrets
const MONGO_URI = Deno.env.get("MONGO_URI");
const client = new MongoClient();

serve(async (req) => {
  try {
    // 1. Get the webhook payload from Supabase
    const payload = await req.json();

    // 2. Check if it's an INSERT event for a new user
    if (payload.type !== 'INSERT' || !payload.record) {
      return new Response("Not an insert event, skipping.", { status: 200 });
    }
    
    const user = payload.record;

    // 3. Connect to your MongoDB database
    await client.connect(MONGO_URI);
    const db = client.database("test"); // IMPORTANT: Change "test" to your actual database name if different
    const usersCollection = db.collection("users");

    // 4. Create the new user document for MongoDB
    const newUserDocument = {
      name: user.raw_user_meta_data?.full_name || user.email, // Use full_name from metadata
      email: user.email,
      password: "password_is_managed_by_supabase", // Placeholder, Supabase handles the actual password
      role: user.raw_user_meta_data?.role || "student", // Get role from metadata, default to 'student'
      isFaceEnrolled: false,
      // You can add other default fields here
      createdAt: new Date(user.created_at),
      updatedAt: new Date(user.updated_at),
    };

    // 5. Insert the document into your 'users' collection
    await usersCollection.insertOne(newUserDocument);

    console.log(`Successfully synced new user ${user.email} to MongoDB.`);

    return new Response(JSON.stringify({ message: "User synced successfully" }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error in user sync function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }
});