import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { streamText } from "ai";
import { createClient } from "@/lib/supabase/server";
import { buildSystemPrompt } from "@/lib/system-prompt";
import { checkRateLimit } from "@/lib/rate-limit";
import type { BeautyProfile } from "@/types";

export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    // Rate limiting
    const { allowed, remaining } = checkRateLimit(user.id);
    if (!allowed) {
      return new Response(
        JSON.stringify({
          error: "Too many requests. Please wait a moment before trying again. 💆‍♀️",
        }),
        { status: 429, headers: { "X-RateLimit-Remaining": "0" } }
      );
    }

    const body = await req.json();
    const { messages, sessionId, imageBase64, imageMimeType } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: "Invalid request" }), { status: 400 });
    }

    // Limit message history to last 20 to prevent abuse
    const trimmedMessages = messages.slice(-20);

    // Validate each message
    for (const msg of trimmedMessages) {
      if (!["user", "assistant"].includes(msg.role)) {
        return new Response(JSON.stringify({ error: "Invalid message role" }), { status: 400 });
      }
      if (typeof msg.content !== "string" || msg.content.length > 8000) {
        return new Response(JSON.stringify({ error: "Message too long" }), { status: 400 });
      }
    }

    // Validate image size (max 4MB base64)
    if (imageBase64 && imageBase64.length > 5_500_000) {
      return new Response(JSON.stringify({ error: "Image too large. Max 4MB." }), { status: 400 });
    }

    // Validate image MIME type
    const allowedMimes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (imageMimeType && !allowedMimes.includes(imageMimeType)) {
      return new Response(JSON.stringify({ error: "Unsupported image type" }), { status: 400 });
    }

    // Fetch beauty profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user.id)
      .single();

    const systemPrompt = buildSystemPrompt(profile as BeautyProfile | null);

    // Build messages with optional image in last user message
    // Note: openrouter/free router may not support vision, so we only add image if content is array-capable
    const formattedMessages = trimmedMessages.map(
      (msg: { role: string; content: string }, idx: number) => {
        return {
          role: msg.role as "user" | "assistant",
          content: msg.content,
        };
      }
    );

    // Save user message to DB
    if (sessionId) {
      const lastMsg = messages[messages.length - 1];
      if (lastMsg?.role === "user") {
        await supabase.from("messages").insert({
          session_id: sessionId,
          role: "user",
          content: lastMsg.content,
          image_url: body.imageUrl ?? null,
        });

        // Update session timestamp
        await supabase
          .from("chat_sessions")
          .update({ updated_at: new Date().toISOString() })
          .eq("id", sessionId);
      }
    }

    const openrouter = createOpenRouter({ apiKey: process.env.OPENROUTER_API_KEY! });

    const result = streamText({
      model: openrouter("openrouter/free"),
      system: systemPrompt,
      messages: formattedMessages,
      maxTokens: 1024,
      onFinish: async ({ text }) => {
        // Save assistant response to DB
        if (sessionId && text) {
          await supabase.from("messages").insert({
            session_id: sessionId,
            role: "assistant",
            content: text,
          });
        }
      },
    });

    return result.toTextStreamResponse({
      headers: {
        "X-RateLimit-Remaining": String(remaining),
      },
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("Chat API error:", msg);
    return new Response(
      JSON.stringify({ error: msg }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
