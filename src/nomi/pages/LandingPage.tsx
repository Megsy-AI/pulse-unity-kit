import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion, useInView, useScroll, useTransform } from "framer-motion";
import { ArrowDown, ArrowRight, CalendarDays, Check, ChevronRight, Globe2, Mail, Menu, MessageCircle, ShieldCheck, ShoppingBag, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NomiAvatar } from "../avatar/NomiAvatar";
import { useNomi } from "../store";

const navItems = [
  { label: "Meet Nomi", href: "#meet" },
  { label: "What Nomi does", href: "#abilities" },
  { label: "Connections", href: "#connections" },
  { label: "Trust", href: "#trust" },
];

function StaggeredFade({ children }: { children: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const visible = useInView(ref, { once: true, amount: 0.8 });
  return <span ref={ref} className="block" aria-label={children}>{Array.from(children).map((character, index) => <motion.span key={`${character}-${index}`} aria-hidden="true" initial={{ opacity: 0, y: 18 }} animate={visible ? { opacity: 1, y: 0 } : undefined} transition={{ duration: 0.55, delay: index * 0.055, ease: [0.22, 1, 0.36, 1] }} className="inline-block">{character === " " ? "\u00a0" : character}</motion.span>)}</span>;
}

function Reveal({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <motion.div initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.25 }} transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }} className={className}>{children}</motion.div>;
}

function ChatPreview({ companion }: { companion: ReturnType<typeof useNomi>["companion"] }) {
  return <div className="landing-phone mx-auto w-full max-w-[390px] px-4 pb-4 pt-3 sm:px-5 sm:pb-5">
    <div className="mb-6 flex flex-col items-center"><NomiAvatar companion={companion} pose="wave" size={72} floating={false} /><strong className="-mt-2 text-sm">Nomi</strong><span className="text-[11px] text-landing-muted">Working on it…</span></div>
    <div className="space-y-3 text-sm">
      <div className="landing-bubble max-w-[90%]">I found two evening flights within your budget. Want the one with less travel time?</div>
      <div className="ms-auto w-fit rounded-2xl rounded-br-md bg-landing-blue-soft px-4 py-3 text-landing-ink">Yes — save the 7:30 option.</div>
      <div className="landing-tool-panel"><div className="flex items-center gap-3 border-b border-landing-line px-4 py-3"><span className="grid size-9 place-items-center rounded-xl bg-landing-blue-soft text-landing-blue"><Globe2 className="size-4" /></span><div><strong className="block text-xs">Browser</strong><span className="text-[11px] text-landing-muted">Holding your flight</span></div></div><div className="space-y-3 p-4"><div className="flex items-center justify-between"><span className="text-xs text-landing-muted">Cairo → Lisbon</span><strong>$284</strong></div><div className="h-2 overflow-hidden rounded-full bg-landing-soft"><motion.div initial={{ width: 0 }} whileInView={{ width: "76%" }} viewport={{ once: true }} transition={{ duration: 1.2 }} className="h-full rounded-full bg-landing-blue" /></div><Button size="sm" className="w-full rounded-full">Open browser</Button></div></div>
    </div>
    <div className="mt-5 flex h-14 items-center gap-3 rounded-full border border-landing-line bg-landing-surface px-5 text-landing-muted shadow-sm"><span className="text-xl">+</span><span className="flex-1">Message Nomi</span><MessageCircle className="size-4" /></div>
  </div>;
}

function ApprovalPreview({ companion }: { companion: ReturnType<typeof useNomi>["companion"] }) {
  return <div className="landing-phone mx-auto w-full max-w-[390px] p-5"><div className="flex justify-center"><NomiAvatar companion={companion} pose="shopping" size={74} floating={false} /></div><div className="landing-bubble mt-1 text-sm">I found the carry-on you saved for 30% less. I’ll only place the order if you approve.</div><div className="landing-tool-panel mt-4 p-4"><div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-xl bg-landing-soft"><ShoppingBag className="size-5" /></span><div><strong className="block text-sm">Purchase approval</strong><span className="text-xs text-landing-muted">Travel carry-on · Navy</span></div></div><div className="my-5 flex items-end justify-between border-y border-landing-line py-4"><span className="text-sm text-landing-muted">Estimated total</span><strong className="text-xl">$86</strong></div><Button className="w-full rounded-full">Allow once</Button><Button variant="ghost" className="mt-2 w-full rounded-full">Not now</Button></div></div>;
}

export default function LandingPage() {
  const { companion } = useNomi();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const guideY = useTransform(scrollYProgress, [0, 1], [0, -34]);
  return <main className="landing-page bg-landing-surface text-landing-ink">
    <section className="relative min-h-dvh overflow-hidden bg-landing-surface text-landing-ink">
      <header className="relative z-30 mx-auto grid h-16 w-full max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center px-5 sm:h-20 sm:px-8 lg:px-12">
        <a href="#top" className="min-w-0 font-medium uppercase tracking-[0.25em] text-landing-ink sm:tracking-[0.3em]">Nomi</a>
        <nav className="hidden items-center gap-8 md:flex">{navItems.map((item) => <a key={item.href} href={item.href} className="text-xs font-light uppercase tracking-[0.2em] text-landing-muted transition-colors duration-300 hover:text-landing-ink">{item.label}</a>)}<Button variant="outline" size="sm" className="rounded-full border-landing-line bg-landing-surface text-landing-ink hover:bg-landing-soft" onClick={() => navigate("/auth")}>Sign in</Button></nav>
        <Button variant="ghost" size="icon" className="text-landing-ink hover:bg-landing-soft md:hidden" onClick={() => setMenuOpen((open) => !open)} aria-label={menuOpen ? "Close menu" : "Open menu"}>{menuOpen ? <X className="size-[22px]" /> : <Menu className="size-[22px]" />}</Button>
      </header>
      <AnimatePresence>{menuOpen && <motion.nav initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3, ease: "easeOut" }} className="mobile-menu-glass fixed inset-x-4 top-16 z-50 flex flex-col gap-5 rounded-2xl py-8 md:hidden">{navItems.map((item, index) => <motion.a key={item.href} href={item.href} initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 + index * 0.06 }} onClick={() => setMenuOpen(false)} className="px-8 text-sm font-light uppercase tracking-[0.25em] text-landing-on-dark-muted hover:text-landing-on-dark">{item.label}</motion.a>)}<Button className="mx-6 mt-2 rounded-full bg-landing-on-dark text-landing-ink hover:bg-landing-on-dark-muted" onClick={() => navigate("/auth")}>Sign in</Button></motion.nav>}</AnimatePresence>
      <div id="top" className="relative z-10 flex min-h-[calc(100dvh-4rem)] flex-col items-center justify-center px-5 pb-24 pt-12 text-center sm:px-8 sm:pt-16 md:min-h-[calc(100dvh-5rem)] md:pt-24">
        <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }} className="mb-5"><NomiAvatar companion={companion} pose="wave" size={118} floating={false} /></motion.div>
        <h1 className="font-garamond mb-6 text-5xl font-normal leading-[1.08] tracking-normal sm:mb-8 sm:text-6xl md:text-8xl lg:text-9xl"><StaggeredFade>MEET YOUR</StaggeredFade><StaggeredFade>OTHER SELF</StaggeredFade></h1>
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 1.6 }} className="mb-8 max-w-xs text-sm font-light leading-relaxed text-landing-muted sm:mb-10 sm:max-w-md sm:text-base md:text-lg">Nomi remembers the details, takes care of the next step,<br className="hidden sm:block" /> and leaves more of your day for you.</motion.p>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 2 }}><Button size="lg" className="h-auto rounded-full bg-landing-ink px-7 py-3.5 text-xs uppercase tracking-[0.18em] text-landing-on-dark hover:bg-landing-blue sm:px-10 sm:py-4 sm:tracking-[0.2em]" onClick={() => navigate("/auth")}>Begin with Nomi</Button></motion.div>
        <a href="#meet" aria-label="Explore Nomi" className="absolute bottom-8 flex flex-col items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-landing-muted"><span>Explore</span><ArrowDown className="size-4" /></a>
      </div>
    </section>

    <section id="meet" className="landing-story-section bg-landing-soft"><Reveal className="landing-copy text-center"><span className="landing-eyebrow">Your whole life, in one conversation</span><h2>Nomi gets the small things done before they become big things.</h2><p>Share a plan, a worry, or a half-finished thought. Nomi remembers the context, finds the next move, and keeps everything connected.</p></Reveal><Reveal className="mt-12 w-full"><ChatPreview companion={companion} /></Reveal></section>
    <section id="abilities" className="landing-story-section bg-landing-surface"><Reveal className="landing-copy text-center"><span className="landing-eyebrow">Action, not another dashboard</span><h2>Talk naturally. Nomi handles the tools.</h2><p>Plan trips, organize projects, draft messages, remember preferences, and follow up—without learning a new workflow.</p></Reveal><Reveal className="mt-14 grid w-full max-w-5xl gap-4 md:grid-cols-3">{[[CalendarDays, "Plans that stay current", "Tasks, schedules, and reminders update as life changes."], [Sparkles, "Ideas at the right moment", "Useful suggestions based on your goals—not generic noise."], [Mail, "Follow-through included", "Nomi prepares the email, form, or next action and brings it back to you."]].map(([Icon, title, copy]) => { const ItemIcon = Icon as typeof CalendarDays; return <article key={String(title)} className="landing-feature"><span className="landing-feature-icon"><ItemIcon className="size-5" /></span><h3>{String(title)}</h3><p>{String(copy)}</p></article>; })}</Reveal></section>
    <section className="landing-story-section bg-landing-soft"><Reveal className="landing-copy text-center"><span className="landing-eyebrow">You stay in control</span><h2>Nothing important happens without your say-so.</h2><p>Nomi can research and prepare. Sending, booking, buying, and sharing wait for a clear approval from you.</p></Reveal><Reveal className="mt-12 w-full"><ApprovalPreview companion={companion} /></Reveal></section>
    <section id="connections" className="landing-story-section bg-landing-surface"><Reveal className="landing-copy text-center"><span className="landing-eyebrow">Connections</span><h2>Works where your day already happens.</h2><p>Connect only what you choose. Nomi asks when a task needs access and keeps every permission visible.</p></Reveal><Reveal className="mt-14 grid w-full max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4">{[[CalendarDays, "Calendar"], [Mail, "Email"], [MessageCircle, "Messages"], [Globe2, "Browser"]].map(([Icon, label]) => { const ItemIcon = Icon as typeof CalendarDays; return <div key={String(label)} className="landing-integration"><span><ItemIcon className="size-6" /></span><strong>{String(label)}</strong></div>; })}</Reveal></section>
    <section id="trust" className="landing-story-section bg-landing-soft"><Reveal className="landing-copy text-center"><span className="mx-auto mb-8 grid size-20 place-items-center rounded-[1.75rem] bg-landing-ink text-landing-on-dark shadow-xl"><ShieldCheck className="size-9" /></span><span className="landing-eyebrow">Private by design</span><h2>Your life is context, not inventory.</h2><p>Your permissions stay under your control. Sensitive actions require approval, and you can review or remove what Nomi remembers.</p></Reveal><Reveal className="mt-12 w-full max-w-3xl divide-y divide-landing-line border-y border-landing-line">{[["Permission by permission", "Choose exactly what Nomi can see and do."], ["Approval before action", "Important sends, bookings, and purchases wait for you."], ["Memory you can edit", "See, correct, or forget anything at any time."]].map(([title, copy]) => <div key={title} className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4 py-6"><Check className="size-5 shrink-0 text-landing-blue" /><div className="min-w-0"><strong className="block">{title}</strong><span className="mt-1 block text-sm text-landing-muted">{copy}</span></div><ChevronRight className="size-4 shrink-0 text-landing-muted" /></div>)}</Reveal></section>
    <section className="flex min-h-[78dvh] flex-col items-center justify-center bg-landing-blue px-5 py-24 text-center text-landing-on-dark"><Reveal className="max-w-3xl"><NomiAvatar companion={companion} pose="celebrate" size={150} floating={false} className="mx-auto mb-2" /><h2 className="font-garamond text-5xl font-normal leading-[1.05] tracking-normal sm:text-7xl">A clearer day starts here.</h2><p className="mx-auto mt-6 max-w-md text-landing-on-dark-muted">Create your Nomi, choose how it looks and speaks, then start with one simple message.</p><Button size="lg" className="mt-9 rounded-full bg-landing-on-dark px-8 text-landing-ink hover:bg-landing-on-dark-muted" onClick={() => navigate("/auth")}>Create your Nomi <ArrowRight className="size-4" /></Button></Reveal></section>
    <footer className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-6 bg-landing-ink px-5 py-8 text-xs text-landing-on-dark-muted sm:px-8 lg:px-12"><span className="truncate">Nomi · Your personal AI companion</span><span>© 2026</span></footer>
    <motion.div style={{ y: guideY }} className="pointer-events-none fixed bottom-5 end-5 z-40 hidden rounded-2xl border border-landing-line bg-landing-surface-translucent p-1 shadow-lg backdrop-blur-xl sm:block"><NomiAvatar companion={companion} pose="idle" size={58} floating={false} /></motion.div>
  </main>;
}