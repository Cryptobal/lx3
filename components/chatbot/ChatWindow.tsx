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
const STREAM_FLUSH_MS = 40;
const STREAM_FLUSH_THRESHOLD = 24;

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
      let pendingContent = "";
      let flushTimeout: ReturnType<typeof setTimeout> | null = null;

      // Add empty assistant message for streaming
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      const updateAssistantMessage = (content: string) => {
        setMessages((prev) => {
          const updated = [...prev];

          if (updated[updated.length - 1]?.role === "assistant") {
            updated[updated.length - 1] = { role: "assistant", content };
          } else {
            updated.push({ role: "assistant", content });
          }

          return updated;
        });
      };

      const flushPendingContent = () => {
        if (!pendingContent) {
          flushTimeout = null;
          return;
        }

        assistantContent += pendingContent;
        pendingContent = "";
        flushTimeout = null;
        updateAssistantMessage(assistantContent);
      };

      const scheduleFlush = () => {
        if (flushTimeout) return;
        flushTimeout = setTimeout(flushPendingContent, STREAM_FLUSH_MS);
      };

      const processStreamLine = (line: string) => {
        if (line.startsWith("0:")) {
          try {
            const text = JSON.parse(line.slice(2));
            pendingContent += text;

            if (
              pendingContent.length >= STREAM_FLUSH_THRESHOLD ||
              /[.!?\n]\s*$/.test(pendingContent)
            ) {
              if (flushTimeout) {
                clearTimeout(flushTimeout);
                flushTimeout = null;
              }
              flushPendingContent();
            } else {
              scheduleFlush();
            }
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
      };

      if (reader) {
        let buffer = "";
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            processStreamLine(line);
          }
        }

        const remainingLine = buffer.trim();
        if (remainingLine) {
          processStreamLine(remainingLine);
        }
      }

      if (flushTimeout) {
        clearTimeout(flushTimeout);
      }
      flushPendingContent();

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
        <img
          src="/logo/LX3_isotipo.svg"
          alt="LX3"
          className="h-8 w-8 shrink-0 rounded-lg"
        />
        <div className="flex-1">
          <p className="text-sm font-semibold text-white">LX3</p>
          <p className="text-xs text-muted-foreground">
            {locale === "es" ? "Asistente con IA" : "AI-powered assistant"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="https://wa.me/56982307771?text=Hola%2C%20me%20interesa%20saber%20m%C3%A1s%20sobre%20los%20servicios%20de%20LX3"
            target="_blank"
            rel="nofollow noopener noreferrer"
            className="group flex items-center gap-1.5 rounded-full bg-[#25D366]/10 px-2.5 py-1 text-xs font-medium text-[#25D366] transition-colors hover:bg-[#25D366]"
            title="Contactar por WhatsApp"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="transition-colors group-hover:text-white"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
            </svg>
            <span className="hidden leading-none transition-colors group-hover:text-white sm:inline-block">
              WhatsApp
            </span>
          </a>
          <div className="flex items-center gap-1.5 border-l border-white/10 pl-3">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="hidden text-xs text-muted-foreground sm:inline-block">Online</span>
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
          <ChatMessage
            key={i}
            role={message.role}
            content={message.content}
            isStreaming={isLoading && i === messages.length - 1 && message.role === "assistant"}
          />
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
