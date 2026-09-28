import { useEffect, useRef, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { ArrowUp, PhoneCall } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useNomi } from "../store";
import { NomiAvatar } from "../avatar/NomiAvatar";
import { detectPose } from "../intent";
import type { NomiPose } from "../types";

/** Keeps replies looking like a conversation, not like raw markdown. */
function clean(text: string) {
  return text
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/^#{1,6}\s*/gm, "")
    .replace(/^\s*[*-]\s+/gm, "• ")
    .replace(/`{1,3}/g, "")
    .trim();
}

const POSE_LABEL: Record<NomiPose, { en: string; ar: string }> = {
  idle: { en: "", ar: "" },
  wave: { en: "", ar: "" },
  think: { en: "Thinking with you", ar: "بفكر معاك" },
  shopping: { en: "Ready to shop", ar: "جاهز للتسوق" },
  reminder: { en: "Keeping time", ar: "هفكرك في وقتها" },
  calendar: { en: "Checking your day", ar: "بشوف يومك" },
  search: { en: "Looking it up", ar: "بدور لك" },
  write: { en: "Writing it down", ar: "بكتبها" },
  email: { en: "On your mail", ar: "على بريدك" },
  call: { en: "Ready to call", ar: "جاهز للاتصال" },
  travel: { en: "Planning the trip", ar: "بنظم الرحلة" },
  celebrate: { en: "Nice one!", ar: "تحفة!" },
};

export default function ChatPage() {
  const { companion, messages, sendMessage, thinking, speaking, pose, t, language } = useNomi();
  const [draft, setDraft] = useState("");
  const endRef = useRef<HTMLDivElement>(null);
  const ar = language === "ar";

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length, thinking]);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const text = draft;
    setDraft("");
    void sendMessage(text);
  };

  const suggestions = ar
    ? ["نظّم يومي", "فكرني أشتري لبن بكرة", "لخّصلي الأخبار", "اكتب رسالة شكر"]
    : ["Plan my day", "Remind me to buy milk", "Summarise the news", "Write a thank-you note"];

  const empty = messages.length === 0;

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="flex items-center justify-between px-5 pt-6 md:px-10">
        <div className="flex items-center gap-3">
          <div className="size-10 overflow-hidden rounded-full bg-primary-soft">
            <NomiAvatar companion={companion} size={40} floating={false} className="translate-y-1" />
          </div>
          <div>
            <p className="text-sm font-semibold">{companion.name}</p>
            <p className="text-xs text-muted-foreground">
              {thinking ? (ar ? "بيفكر…" : "Thinking…") : t("greeting")}
            </p>
          </div>
        </div>
        <Button asChild variant="ghost" size="icon" className="rounded-full">
          <Link to="/call" aria-label={t("callNomi")}>
            <PhoneCall className="size-5" strokeWidth={1.75} />
          </Link>
        </Button>
      </header>

      <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-5 md:px-6">
        {empty ? (
          <div className="flex flex-1 flex-col items-center justify-center py-10 text-center">
            <NomiAvatar companion={companion} pose="wave" speaking={speaking} size={230} />
            <h2 className="mt-4 text-2xl font-bold">
              {ar ? `أهلًا، أنا ${companion.name}` : `Hi, I'm ${companion.name}`}
            </h2>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">{t("heroBody")}</p>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {suggestions.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => void sendMessage(s)}
                  className="rounded-full bg-secondary px-4 py-2 text-sm transition-colors hover:bg-primary-soft hover:text-primary"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-1 flex-col justify-end space-y-6 py-6">
            {messages.map((message, index) => {
              const showAvatar =
                message.role === "assistant" &&
                (message.pose !== "idle" || index === messages.length - 1);
              const label = POSE_LABEL[message.pose]?.[ar ? "ar" : "en"];
              return (
                <div
                  key={message.id}
                  className={cn(
                    "animate-nomi-rise flex gap-3",
                    message.role === "user" ? "justify-end" : "items-start",
                  )}
                >
                  {message.role === "assistant" ? (
                    <div className="flex w-16 shrink-0 flex-col items-center">
                      {showAvatar ? (
                        <NomiAvatar
                          companion={companion}
                          pose={message.pose}
                          speaking={speaking && index === messages.length - 1}
                          size={64}
                          floating={false}
                        />
                      ) : (
                        <div className="mt-2 size-2 rounded-full bg-primary-soft" />
                      )}
                    </div>
                  ) : null}

                  <div className={cn("max-w-[78%]", message.role === "user" && "text-end")}>
                    {message.role === "assistant" && label ? (
                      <p className="mb-1 text-[11px] font-medium text-primary">{label}</p>
                    ) : null}
                    <div
                      className={cn(
                        "whitespace-pre-wrap text-[15px] leading-relaxed",
                        message.role === "user"
                          ? "inline-block rounded-3xl bg-primary px-4 py-2.5 text-start text-primary-foreground"
                          : "text-foreground",
                      )}
                    >
                      {message.role === "assistant" ? clean(message.content) : message.content}
                    </div>
                  </div>
                </div>
              );
            })}

            {thinking ? (
              <div className="flex items-center gap-3">
                <NomiAvatar
                  companion={companion}
                  pose={detectPose(messages[messages.length - 1]?.content ?? "")}
                  size={64}
                  floating={false}
                />
                <div className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="size-2 animate-bounce rounded-full bg-primary/60"
                      style={{ animationDelay: `${i * 120}ms` }}
                    />
                  ))}
                </div>
              </div>
            ) : null}
            <div ref={endRef} />
          </div>
        )}

        <form
          onSubmit={submit}
          className="sticky bottom-20 z-10 mb-4 flex items-end gap-2 rounded-[1.75rem] border border-border bg-card p-2 shadow-[var(--shadow-soft)] md:bottom-6"
        >
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey && window.innerWidth >= 768) {
                e.preventDefault();
                submit(e);
              }
            }}
            rows={1}
            placeholder={t("askPlaceholder")}
            className="max-h-40 min-h-11 flex-1 resize-none bg-transparent px-3 py-2.5 text-[15px] outline-none placeholder:text-muted-foreground"
          />
          <Button
            type="submit"
            size="icon"
            disabled={!draft.trim() || thinking}
            aria-label={t("send")}
            className="size-11 shrink-0 rounded-full"
          >
            <ArrowUp className="size-5" />
          </Button>
        </form>

        {/* poses legend keeps the character present without crowding the thread */}
        <p className="pb-4 text-center text-[11px] text-muted-foreground">
          {POSE_LABEL[pose]?.[ar ? "ar" : "en"] || ""}
        </p>
      </div>
    </div>
  );
}
