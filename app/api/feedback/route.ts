import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  const { messageId, type } = await req.json();

  if (!messageId || !["thumbs_up", "thumbs_down"].includes(type)) {
    return new Response(JSON.stringify({ error: "Invalid request" }), {
      status: 400,
    });
  }

  // Upsert feedback (one per user per message)
  const { error } = await supabase.from("feedback").upsert(
    { message_id: messageId, user_id: user.id, type },
    { onConflict: "message_id,user_id" }
  );

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }

  return new Response(JSON.stringify({ success: true }), { status: 200 });
}
