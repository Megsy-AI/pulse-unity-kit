import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { MessageCircle, PhoneCall, ListChecks, Brain, Mail, CalendarDays, Globe } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useNomi } from "../store";
import { NomiAvatar } from "../avatar/NomiAvatar";

export default function LandingPage() {
  const { companion, t, ready } = useNomi();
  const navigate = useNavigate();

  useEffect(() => {
    if (ready && companion.onboarded) navigate("/chat", { replace: true });
  }, [ready, companion.onboarded, navigate]);

  const pillars = [
    { icon: MessageCircle, en: "Chats with you", ar: "يتحدث معك" },
    { icon: Brain, en: "Remembers you", ar: "يتذكرك" },
    { icon: ListChecks, en: "Organises your day", ar: "ينظم يومك" },
    { icon: PhoneCall, en: "Talks out loud", ar: "يتكلم معك صوتًا" },
  ];

  const future = [
    { icon: PhoneCall, en: "Answers calls", ar: "يرد على المكالمات" },
    { icon: Mail, en: "Handles email", ar: "يدير البريد" },
    { icon: CalendarDays, en: "Keeps your calendar", ar: "يتابع تقويمك" },
    { icon: Globe, en: "Does web tasks", ar: "ينفذ مهام الويب" },
  ];

  const ar = companion.language === "ar";

  return (
    <main className="relative min-h-dvh overflow-hidden bg-background">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[70vh]"
        style={{ background: "var(--gradient-soft)" }}
      />

      <div className="relative mx-auto flex max-w-5xl flex-col items-center px-6 pb-24 pt-14 text-center">
        <span className="animate-nomi-rise rounded-full bg-primary-soft px-4 py-1.5 text-xs font-semibold text-primary">
          {t("tagline")}
        </span>

        <div className="mt-6">
          <NomiAvatar companion={companion} pose="wave" size={260} />
        </div>

        <h1 className="animate-nomi-rise mt-4 max-w-2xl text-4xl font-extrabold leading-tight tracking-tight md:text-6xl">
          {t("heroTitle")}
        </h1>
        <p className="animate-nomi-rise mt-4 max-w-xl text-base text-muted-foreground md:text-lg">
          {t("heroBody")}
        </p>

        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
          <Button asChild size="lg" className="h-12 rounded-full px-8 text-base shadow-[var(--shadow-float)]">
            <Link to="/onboarding">{t("getStarted")}</Link>
          </Button>
          <Button asChild variant="ghost" size="lg" className="h-12 rounded-full px-6 text-base">
            <Link to="/auth">{t("signIn")}</Link>
          </Button>
        </div>

        <div className="mt-16 grid w-full grid-cols-2 gap-3 md:grid-cols-4">
          {pillars.map(({ icon: Icon, en, ar: arLabel }) => (
            <div key={en} className="nomi-card flex flex-col items-center gap-2 px-4 py-6">
              <Icon className="size-5 text-primary" strokeWidth={1.75} />
              <p className="text-sm font-medium">{ar ? arLabel : en}</p>
            </div>
          ))}
        </div>

        <section className="mt-20 w-full">
          <h2 className="text-xl font-bold md:text-2xl">
            {ar ? "وقريبًا يفعل أكثر" : "And soon, much more"}
          </h2>
          <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
            {future.map(({ icon: Icon, en, ar: arLabel }) => (
              <div key={en} className="rounded-3xl border border-dashed border-border px-4 py-6">
                <Icon className="mx-auto size-5 text-muted-foreground" strokeWidth={1.75} />
                <p className="mt-2 text-sm text-muted-foreground">{ar ? arLabel : en}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
