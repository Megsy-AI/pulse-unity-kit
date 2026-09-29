import { Navigate, useNavigate } from "react-router-dom";
import { ArrowRight, LockKeyhole } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNomi } from "../store";
import { NomiAvatar } from "../avatar/NomiAvatar";

export default function LandingPage() {
  const { ready, companion, language } = useNomi();
  const navigate = useNavigate();
  const ar = language === "ar";
  if (!ready) return null;
  if (companion.onboarded) return <Navigate to="/chat" replace />;

  return (
    <main className="relative flex min-h-dvh flex-col overflow-hidden bg-background px-5 md:px-8">
      <header className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between border-b border-border"><span className="font-display text-xl font-bold">Nomi<span className="text-primary">.</span></span><Button variant="ghost" size="sm" onClick={() => navigate("/auth")}>{ar ? "تسجيل الدخول" : "Sign in"}</Button></header>
      <section className="mx-auto grid w-full max-w-6xl flex-1 items-center gap-8 py-8 md:grid-cols-[1fr_0.82fr] md:py-12">
        <div className="order-2 text-center md:order-1 md:text-start">
          <p className="mb-5 font-display text-xs font-semibold uppercase text-primary">{ar ? "رفيق شخصي واحد · يوم أبسط" : "One companion · a clearer day"}</p>
          <h1 className="max-w-3xl text-4xl font-semibold leading-[1.04] md:text-7xl">{ar ? "فكّر أقل في التفاصيل. أنجز أكثر مع نومي." : "Less life admin. More room to think."}</h1>
          <p className="mx-auto mt-6 max-w-xl text-base leading-7 text-muted-foreground md:mx-0 md:text-lg">{ar ? "نومي يتذكر ما يهمك، ينظم خطواتك، ويبقى معك من أول فكرة لحد ما تخلص." : "Nomi remembers what matters, organises the next step, and stays with you from first thought to done."}</p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row md:items-start"><Button size="lg" className="h-12 w-full rounded-md px-6 sm:w-auto" onClick={() => navigate("/auth")}>{ar ? "ابدأ مع نومي" : "Start with Nomi"}<ArrowRight className="size-4 rtl:rotate-180" /></Button><span className="flex h-12 items-center gap-2 text-xs text-muted-foreground"><LockKeyhole className="size-4" />{ar ? "أنت تتحكم في كل صلاحية" : "You control every permission"}</span></div>
        </div>
        <div className="order-1 flex items-center justify-center md:order-2">
          <div className="relative grid aspect-square w-full max-w-[330px] place-items-center border-x border-border sm:max-w-[390px]"><span className="absolute start-4 top-4 font-display text-[11px] font-semibold text-muted-foreground">01 / MEET NOMI</span><div className="absolute inset-x-10 bottom-12 h-px bg-border" /><NomiAvatar companion={{ ...companion, shape: "bear", outfit: "knit", glasses: "black-oval" }} pose="wave" size={330} floating={false} className="relative" /></div>
        </div>
      </section>
      <footer className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between border-t border-border text-xs text-muted-foreground"><span>{ar ? "خاص بك من البداية" : "Private by default"}</span><span>© 2026 NOMI</span></footer>
    </main>
  );
}
