"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { useLocale, useTranslations } from "next-intl";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { Loader2, Sparkles, X } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ConversationState {
  leadData: Record<string, unknown>;
  language: string;
}

const STORAGE_KEY = "lx3-chat";
const LEAD_SCORE_THRESHOLD = 30;
const MIN_MESSAGES_FOR_LEAD = 3;

interface ChatWindowProps {
  onClose?: () => void;
}

export function ChatWindow({ onClose }: ChatWindowProps) {
  const locale = useLocale();
  const t = useTranslations("chatbot");
  const scrollRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversationState, setConversationState] = useState<ConversationState>({
    leadData: {},
    language: locale,
  });
  const [leadSent, setLeadSent] = useState(false);
  const [showQuickReplies, setShowQuickReplies] = useState(true);
  const [initialized, setInitialized] = useState(false);

  // Restore from sessionStorage or show greeting
  useEffect(() => {
    if (initialized) return;

    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        const data = JSON.parse(saved);
        if (data.messages?.length > 0) {
          setMessages(data.messages);
          setConversationState(data.state || { leadData: {}, language: locale });
          setLeadSent(data.leadSent || false);
          setShowQuickReplies(false);
          setInitialized(true);
          return;
        }
      }
    } catch {
      // Ignore parse errors
    }

    setMessages([{ role: "assistant", content: t("greeting") }]);
    setInitialized(true);
  }, [initialized, locale, t]);

  // Persist to sessionStorage
  useEffect(() => {
    if (!initialized || messages.length === 0) return;
    try {
      sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          messages,
          state: conversationState,
          leadSent,
        })
      );
    } catch {
      // Ignore storage errors
    }
  }, [messages, conversationState, leadSent, initialized]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  // Send lead data
  const sendLeadData = useCallback(
    async (currentMessages: Message[], metadata: Record<string, unknown>) => {
      if (leadSent) return;

      try {
        setLeadSent(true);
        const state = metadata.conversationState as Record<string, unknown> | undefined;
        await fetch("/api/leads", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            leadData: state?.leadData ?? {},
            messages: currentMessages.map((m) => ({
              role: m.role,
              content: m.content,
            })),
            score: metadata.leadScore,
            tier: metadata.leadTier,
            language: locale,
          }),
        });
      } catch (error) {
        console.error("[Lead Send Error]", error);
        setLeadSent(false); // Allow retry on failure
      }
    },
    [leadSent, locale]
  );

  async function handleSubmit(text?: string) {
    const messageText = text || input.trim();
    if (!messageText || isLoading) return;

    const userMessage: Message = { role: "user", content: messageText };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setShowQuickReplies(false);
    setIsLoading(true);

    try {
      const allMessages = [...messages, userMessage];
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: allMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          conversationState,
        }),
      });

      if (!response.ok) {
        throw new Error("Chat request failed");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantContent = "";
      let streamMetadata: Record<string, unknown> = {};

      // Add empty assistant message for streaming
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      if (reader) {
        let buffer = "";
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (line.startsWith("0:")) {
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
              try {
                const data = JSON.parse(line.slice(2));
                streamMetadata = data;
                if (data.conversationState) {
                  setConversationState(data.conversationState);
                }
              } catch {
                // skip
              }
            }
          }
        }
      }

      // Send lead email when score crosses threshold
      const userMessageCount = allMessages.filter((m) => m.role === "user").length;
      const leadScore = (streamMetadata.leadScore as number) ?? 0;

      if (
        leadScore >= LEAD_SCORE_THRESHOLD &&
        userMessageCount >= MIN_MESSAGES_FOR_LEAD &&
        !leadSent
      ) {
        const finalMessages = [
          ...allMessages,
          { role: "assistant" as const, content: assistantContent },
        ];
        sendLeadData(finalMessages, streamMetadata);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            locale === "es"
              ? "Disculpa, hubo un error. Puedes intentar de nuevo o escribirnos por WhatsApp al +56 9 8230 7771."
              : "Sorry, there was an error. You can try again or reach us on WhatsApp at +56 9 8230 7771.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  const quickReplies = [
    t("quickReply1"),
    t("quickReply2"),
    t("quickReply3"),
    t("quickReply4"),
  ];

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-surface shadow-2xl sm:h-[600px]">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-white/10 bg-surface-elevated px-5 py-3.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent/15">
          <Sparkles className="h-4 w-4 text-accent" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-white">LX3</p>
          <p className="text-xs text-muted-foreground">
            {locale === "es" ? "Asistente con IA" : "AI-powered assistant"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs text-muted-foreground">Online</span>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-white/5 hover:text-white transition-colors sm:hidden"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Messages area */}
      <div
        ref={scrollRef}
        className="flex-1 space-y-4 overflow-y-auto bg-background px-5 py-5"
      >
        {messages.map((message, i) => (
          <ChatMessage key={i} role={message.role} content={message.content} />
        ))}

        {/* Quick replies */}
        {showQuickReplies && messages.length === 1 && !isLoading && (
          <div className="flex flex-wrap gap-2 pt-1">
            {quickReplies.map((text) => (
              <button
                key={text}
                onClick={() => handleSubmit(text)}
                className="rounded-full border border-accent/30 bg-accent/5 px-3.5 py-2 text-xs font-medium text-accent transition-all hover:bg-accent/15 hover:border-accent/50 active:scale-95"
              >
                {text}
              </button>
            ))}
          </div>
        )}

        {/* Loading indicator */}
        {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent/10">
              <Sparkles className="h-3.5 w-3.5 text-accent" />
            </div>
            <div className="flex items-center gap-2 rounded-2xl rounded-tl-md bg-surface-elevated px-4 py-3 shadow-sm">
              <Loader2 className="h-4 w-4 animate-spin text-accent" />
              <span className="text-sm text-muted-foreground">{t("sending")}</span>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-white/10 bg-surface px-4 py-3">
        <ChatInput
          value={input}
          onChange={setInput}
          onSubmit={() => handleSubmit()}
          placeholder={t("placeholder")}
          disabled={isLoading}
        />
      </div>
    </div>
  );
}
