import { Navigate, useNavigate } from "react-router-dom";
import { ArrowRight, MessageCircle, ShieldCheck } from "lucide-react";
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
    <main className="relative flex min-h-dvh flex-col overflow-hidden bg-background px-6">
      <header className="mx-auto flex h-20 w-full max-w-6xl items-center justify-between"><span className="text-lg font-bold">Nomi</span><Button variant="ghost" onClick={() => navigate("/auth")}>{ar ? "تسجيل الدخول" : "Sign in"}</Button></header>
      <section className="mx-auto flex w-full max-w-4xl flex-1 flex-col items-center justify-center pb-10 text-center">
        <div className="relative mb-2 h-72 w-72 sm:h-80 sm:w-80"><div className="absolute inset-x-10 bottom-5 h-10 rounded-full bg-muted blur-xl" /><NomiAvatar companion={{ ...companion, shape: "bear", outfit: "knit", glasses: "black-oval" }} pose="wave" size={320} floating={false} className="relative" /></div>
        <p className="mb-4 text-sm font-semibold text-primary">{ar ? "رفيقك الشخصي، جاهز ليومك" : "Your personal companion, ready for your day"}</p>
        <h1 className="max-w-3xl text-4xl font-semibold leading-tight sm:text-6xl">{ar ? "رتّب حياتك الرقمية مع رفيق يفهمك" : "A calmer digital life, with a companion who knows you"}</h1>
        <p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground">{ar ? "يتذكر ما يهمك، ينظم مهامك، ويساعدك بالطريقة التي تفضلها." : "Nomi remembers what matters, organises your tasks, and helps in the way that feels right to you."}</p>
        <Button size="lg" className="mt-8 h-12 rounded-xl px-6" onClick={() => navigate("/auth")}>{ar ? "ابدأ مع نومي" : "Start with Nomi"}<ArrowRight className="size-4 rtl:rotate-180" /></Button>
        <div className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground"><span className="flex items-center gap-1.5"><MessageCircle className="size-4" />{ar ? "محادثة شخصية" : "Personal conversations"}</span><span className="flex items-center gap-1.5"><ShieldCheck className="size-4" />{ar ? "أنت تتحكم في الصلاحيات" : "Permissions stay in your control"}</span></div>
      </section>
    </main>
  );
}
