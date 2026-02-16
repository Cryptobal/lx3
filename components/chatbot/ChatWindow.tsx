"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { useLocale, useTranslations } from "next-intl";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { Loader2 } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function ChatWindow() {
  const locale = useLocale();
  const t = useTranslations("chatbot");
  const scrollRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [phase, setPhase] = useState("greeting");
  const [conversationState, setConversationState] = useState<Record<string, unknown>>({ phase: "greeting", leadData: {}, language: "es" });
  const [started, setStarted] = useState(false);
  const [leadSent, setLeadSent] = useState(false);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  // Show greeting on mount
  useEffect(() => {
    if (!started) {
      setStarted(true);
      setMessages([
        {
          role: "assistant",
          content: t("greeting"),
        },
      ]);
    }
  }, [started, t]);

  // Send lead data to /api/leads when reaching summary or conversion phase
  const sendLeadData = useCallback(
    async (
      currentMessages: Message[],
      currentPhase: string,
      metadata: Record<string, unknown>
    ) => {
      if (leadSent) return;

      try {
        setLeadSent(true);

        // Find the summary message (last assistant message when in summary phase)
        const assistantMessages = currentMessages.filter(
          (m) => m.role === "assistant"
        );
        const lastAssistantMessage =
          assistantMessages[assistantMessages.length - 1]?.content ?? "";

        await fetch("/api/leads", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            leadData: metadata.conversationState
              ? (metadata.conversationState as Record<string, unknown>).leadData
              : {},
            messages: currentMessages.map((m) => ({
              role: m.role,
              content: m.content,
            })),
            conversationSummary:
              currentPhase === "summary" ? lastAssistantMessage : undefined,
            score: metadata.leadScore,
            tier: metadata.leadTier,
            language: locale,
          }),
        });
      } catch (error) {
        console.error("[Lead Send Error]", error);
        // Don't block the user experience — silently fail
      }
    },
    [leadSent, locale]
  );

  async function handleSubmit() {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
          conversationState: { ...conversationState, phase, language: locale },
        }),
      });

      if (!response.ok) {
        throw new Error("Chat request failed");
      }

      // Handle streaming response
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantContent = "";
      let streamMetadata: Record<string, unknown> = {};
      let newPhase = phase;

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "" },
      ]);

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          // Parse SSE-style streaming
          const lines = chunk.split("\n");
          for (const line of lines) {
            if (line.startsWith("0:")) {
              // Vercel AI SDK text stream format
              try {
                const text = JSON.parse(line.slice(2));
                assistantContent += text;
                setMessages((prev) => {
                  const updated = [...prev];
                  updated[updated.length - 1] = {
                    role: "assistant",
                    content: assistantContent,
                  };
                  return updated;
                });
              } catch {
                // skip unparseable chunks
              }
            } else if (line.startsWith("d:")) {
              // Data/metadata from stream
              try {
                const data = JSON.parse(line.slice(2));
                streamMetadata = data;
                if (data.conversationState) {
                  setConversationState(data.conversationState as Record<string, unknown>);
                }
                if (data.phase) {
                  newPhase = data.phase;
                  setPhase(data.phase);
                }
              } catch {
                // skip
              }
            }
          }
        }
      }

      // Send lead data only when summary is delivered
      if (
        (newPhase === "summary" || newPhase === "conversion") &&
        !leadSent
      ) {
        const allMessages = [
          ...messages,
          userMessage,
          { role: "assistant" as const, content: assistantContent },
        ];
        sendLeadData(allMessages, newPhase, streamMetadata);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            locale === "es"
              ? "Disculpa, hubo un error. ¿Podrías intentar de nuevo?"
              : "Sorry, there was an error. Could you try again?",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex h-[600px] flex-col rounded-2xl border border-foreground/5 bg-background shadow-sm dark:border-white/5 dark:bg-primary/30">
      {/* Messages area */}
      <div
        ref={scrollRef}
        className="flex-1 space-y-4 overflow-y-auto p-6"
      >
        {messages.map((message, i) => (
          <ChatMessage key={i} role={message.role} content={message.content} />
        ))}

        {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
          <div className="flex items-center gap-2 text-sm text-foreground/40 dark:text-white/40">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>{t("sending")}</span>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-foreground/5 p-4 dark:border-white/5">
        <ChatInput
          value={input}
          onChange={setInput}
          onSubmit={handleSubmit}
          placeholder={t("placeholder")}
          disabled={isLoading}
        />
      </div>
    </div>
  );
}
