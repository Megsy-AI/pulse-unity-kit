import { useState } from "react";
import { Link } from "react-router-dom";
import { CalendarDays, ListChecks, PhoneCall, Search, ShoppingBag } from "lucide-react";

import { Conversation, ConversationContent, ConversationScrollButton } from "@/components/ai-elements/conversation";
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
} from "@/components/ai-elements/prompt-input";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useNomi } from "../store";
import { NomiAvatar } from "../avatar/NomiAvatar";
import { detectPose } from "../intent";
import type { NomiPose } from "../types";

function clean(text: string) {
  return text.replace(/\*\*(.+?)\*\*/g, "$1").replace(/^#{1,6}\s*/gm, "").replace(/^\s*[*-]\s+/gm, "• ").replace(/`{1,3}/g, "").trim();
}

const POSE_LABEL: Record<NomiPose, { en: string; ar: string }> = {
  idle: { en: "", ar: "" }, wave: { en: "", ar: "" },
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
  const ar = language === "ar";
  const submit = (text: string) => {
    if (!text.trim() || thinking) return;
    setDraft("");
    void sendMessage(text);
  };
  const suggestions = ar
    ? [
        { label: "نظّم يومي", hint: "رتّب مواعيدي ومهامي", icon: CalendarDays },
        { label: "قائمة التسوق", hint: "فكرني باللي محتاجه", icon: ShoppingBag },
        { label: "ابحث ولخّص", hint: "هاتلي الخلاصة بسرعة", icon: Search },
        { label: "رتّب مهامي", hint: "خلّي أولوياتي أوضح", icon: ListChecks },
      ]
    : [
        { label: "Plan my day", hint: "Organise my schedule", icon: CalendarDays },
        { label: "Shopping list", hint: "Remember what I need", icon: ShoppingBag },
        { label: "Search and sum up", hint: "Give me the short version", icon: Search },
        { label: "Sort my tasks", hint: "Make priorities clearer", icon: ListChecks },
      ];
  const empty = messages.length === 0;

  return (
    <div className="flex h-dvh min-h-[38rem] flex-col overflow-hidden">
      <header className="flex h-20 shrink-0 items-center justify-between border-b border-border/70 px-5 md:px-9">
        <div className="flex items-center gap-3">
          <div className="relative grid size-11 place-items-center rounded-full bg-secondary">
            <NomiAvatar companion={companion} size={48} floating={false} />
            <span className="absolute bottom-0 end-0 size-3 rounded-full border-2 border-background bg-success" />
          </div>
          <div>
            <p className="text-[15px] font-bold">{companion.name}</p>
            <p className="text-xs font-medium text-muted-foreground">{thinking ? (ar ? "بيفكر…" : "Thinking…") : t("greeting")}</p>
          </div>
        </div>
        <Button asChild variant="outline" size="icon" className="size-10 rounded-full bg-card shadow-xs">
          <Link to="/call" aria-label={t("callNomi")}><PhoneCall className="size-[18px]" strokeWidth={2} /></Link>
        </Button>
      </header>

      <main className="relative mx-auto flex min-h-0 w-full max-w-4xl flex-1 flex-col px-4 md:px-8">
        {empty ? (
          <div className="flex min-h-0 flex-1 flex-col items-center justify-center overflow-y-auto py-5 text-center md:py-8">
            <NomiAvatar companion={companion} pose="wave" speaking={speaking} size={240} />
            <h1 className="mt-1 text-3xl font-extrabold md:text-4xl">{ar ? `أهلًا، أنا ${companion.name}` : `Hi, I'm ${companion.name}`}</h1>
            <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">{t("heroBody")}</p>
            <div className="mt-7 grid w-full max-w-xl grid-cols-2 gap-2.5 text-start">
              {suggestions.map(({ label, hint, icon: Icon }) => (
                <Button key={label} type="button" variant="outline" onClick={() => submit(label)} className="h-auto min-h-20 justify-start gap-3 rounded-xl bg-card px-3.5 py-3 shadow-xs">
                  <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-secondary text-primary"><Icon className="size-[18px]" strokeWidth={2} /></span>
                  <span className="min-w-0 text-start"><span className="block truncate text-sm font-bold">{label}</span><span className="mt-0.5 block truncate text-xs font-normal text-muted-foreground">{hint}</span></span>
                </Button>
              ))}
            </div>
          </div>
        ) : (
          <Conversation className="min-h-0 flex-1">
            <ConversationContent className="mx-auto w-full max-w-3xl gap-7 px-1 py-7 md:px-4">
              {messages.map((message, index) => {
                const label = POSE_LABEL[message.pose]?.[ar ? "ar" : "en"];
                return (
                  <Message key={message.id} from={message.role} className="animate-nomi-rise gap-3">
                    {message.role === "assistant" ? <NomiAvatar companion={companion} pose={message.pose} speaking={speaking && index === messages.length - 1} size={52} floating={false} className="mt-[-8px]" /> : null}
                    <div className={cn("min-w-0", message.role === "assistant" && "flex-1")}>
                      {message.role === "assistant" && label ? <p className="mb-1.5 text-[11px] font-bold text-primary">{label}</p> : null}
                      <MessageContent className={cn(message.role === "assistant" && "w-full max-w-none bg-transparent p-0")}>
                        {message.role === "assistant" ? <MessageResponse className="text-[15px] leading-7">{clean(message.content)}</MessageResponse> : <p className="whitespace-pre-wrap text-[15px] leading-6">{message.content}</p>}
                      </MessageContent>
                    </div>
                  </Message>
                );
              })}
              {thinking ? <div className="flex items-center gap-3"><NomiAvatar companion={companion} pose={detectPose(messages.at(-1)?.content ?? "")} size={52} floating={false} /><Shimmer className="text-sm font-medium">{ar ? "نومي بيفكر…" : "Nomi is thinking…"}</Shimmer></div> : null}
            </ConversationContent>
            <ConversationScrollButton />
          </Conversation>
        )}

        <PromptInput onSubmit={({ text }) => submit(text)} className="relative z-10 mx-auto mb-3 w-full max-w-3xl rounded-2xl bg-card shadow-[var(--shadow-composer)] md:mb-5">
          <PromptInputTextarea value={draft} onChange={(e) => setDraft(e.target.value)} placeholder={t("askPlaceholder")} className="min-h-14 px-4 pt-3.5 text-[15px]" />
          <PromptInputFooter className="px-2.5 pb-2.5">
            <PromptInputTools><span className="px-1 text-[11px] font-medium text-muted-foreground">{POSE_LABEL[pose]?.[ar ? "ar" : "en"] || (ar ? "جاهز أساعدك" : "Ready when you are")}</span></PromptInputTools>
            <PromptInputSubmit status={thinking ? "submitted" : "ready"} disabled={!draft.trim() || thinking} aria-label={t("send")} className="size-9 rounded-full" />
          </PromptInputFooter>
        </PromptInput>
      </main>
    </div>
  );
}