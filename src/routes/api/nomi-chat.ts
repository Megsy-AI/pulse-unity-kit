import { createFileRoute } from "@tanstack/react-router";

type ChatMessage = { role: string; content: string };

export const Route = createFileRoute("/api/nomi-chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const apiKey = process.env["LOVABLE_API_KEY"];
        if (!apiKey) return Response.json({ error: "ai_unavailable" }, { status: 503 });

        let body: { messages?: unknown };
        try {
          body = (await request.json()) as { messages?: unknown };
        } catch {
          return Response.json({ error: "invalid_body" }, { status: 400 });
        }

        const raw = Array.isArray(body.messages) ? (body.messages as ChatMessage[]) : [];
        const messages = raw
          .filter((m) => m && typeof m.content === "string" && m.content.trim())
          .slice(-16)
          .map((m) => ({
            role: m.role === "assistant" ? "assistant" : m.role === "system" ? "system" : "user",
            content: String(m.content).slice(0, 4000),
          }));

        if (!messages.length) return Response.json({ error: "messages_required" }, { status: 400 });

        try {
          const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${apiKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ model: "google/gemini-2.5-flash", messages }),
          });

          if (response.status === 429)
            return Response.json({ error: "rate_limited" }, { status: 429 });
          if (response.status === 402)
            return Response.json({ error: "credits_required" }, { status: 402 });
          if (!response.ok) {
            console.error("nomi-chat gateway error", response.status, await response.text());
            return Response.json({ error: "ai_failed" }, { status: 502 });
          }

          const payload = (await response.json()) as {
            choices?: Array<{ message?: { content?: string } }>;
          };
          const reply = payload.choices?.[0]?.message?.content?.trim();
          if (!reply) return Response.json({ error: "empty_reply" }, { status: 502 });
          return Response.json({ reply });
        } catch (error) {
          console.error("nomi-chat failed", error);
          return Response.json({ error: "ai_failed" }, { status: 502 });
        }
      },
    },
  },
});
