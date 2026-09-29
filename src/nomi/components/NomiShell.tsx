import { NavLink, useLocation } from "react-router-dom";
import {
  FolderKanban,
  Menu,
  MessageCircle,
  PhoneCall,
  ListChecks,
  Brain,
  Settings,
  Gem,
} from "lucide-react";
import { useState, type ReactNode } from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { useNomi } from "../store";
import { NomiAvatar } from "../avatar/NomiAvatar";

const NAV = [
  { to: "/chat", key: "chat", icon: MessageCircle },
  { to: "/projects", key: "projects", icon: FolderKanban },
  { to: "/tasks", key: "tasks", icon: ListChecks },
  { to: "/call", key: "calls", icon: PhoneCall },
  { to: "/memory", key: "memory", icon: Brain },
] as const;

function SidebarContent({ close }: { close: () => void }) {
  const { companion, session, t } = useNomi();
  const userName = session?.user?.email?.split("@")[0] || (companion.language === "ar" ? "حسابي" : "My account");

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center gap-3 px-1">
        <span className="grid size-9 place-items-center overflow-hidden rounded-xl bg-secondary">
          <NomiAvatar companion={companion} size={42} floating={false} />
        </span>
        <span className="text-[15px] font-semibold">Nomi</span>
      </div>
      <nav className="mt-5 space-y-1">
        {NAV.map(({ to, key, icon: Icon }) => (
          <NavLink key={to} to={to} onClick={close} className={({ isActive }) => cn("flex h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors", isActive ? "bg-secondary text-foreground" : "text-muted-foreground hover:bg-secondary hover:text-foreground")}>
            <Icon className="size-[18px]" strokeWidth={1.8} />
            {t(key)}
          </NavLink>
        ))}
      </nav>
      <div className="mt-auto border-t border-border pt-4">
        <NavLink to="/settings" onClick={close} className={({ isActive }) => cn("flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-secondary", isActive && "bg-secondary")}>
          <span className="grid size-10 shrink-0 place-items-center overflow-hidden rounded-full bg-primary-soft"><NomiAvatar companion={companion} size={46} floating={false} /></span>
          <span className="min-w-0 flex-1"><span className="block truncate text-sm font-semibold">{userName}</span><span className="block text-xs text-muted-foreground">{t("settings")}</span></span>
          <Settings className="size-4 text-muted-foreground" />
        </NavLink>
      </div>
    </div>
  );
}

export function NomiShell({ children }: { children: ReactNode }) {
  const { companion, t } = useNomi();
  const { pathname } = useLocation();
  const immersive = pathname.startsWith("/call");
  const [menuOpen, setMenuOpen] = useState(false);

  if (immersive) return <>{children}</>;

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-border/70 bg-card px-4 md:px-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="rounded-xl" onClick={() => setMenuOpen(true)} aria-label={companion.language === "ar" ? "فتح القائمة" : "Open menu"}><Menu className="size-5" /></Button>
          <div><p className="text-sm font-semibold">{pathname === "/chat" ? companion.name : t(pathname.slice(1) || "chat")}</p><p className="text-[11px] text-muted-foreground">{companion.language === "ar" ? "متصل وجاهز" : "Online and ready"}</p></div>
        </div>
        <Button variant="outline" size="sm" className="rounded-xl bg-card"><Gem className="size-4 text-primary" />{companion.language === "ar" ? "ترقية" : "Upgrade"}</Button>
      </header>
      <div className="min-h-0 flex-1">{children}</div>
      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <SheetContent side={companion.language === "ar" ? "right" : "left"} className="w-[286px] rounded-none p-4 sm:max-w-[286px]">
          <SheetTitle className="sr-only">{companion.language === "ar" ? "القائمة" : "Navigation"}</SheetTitle>
          <SidebarContent close={() => setMenuOpen(false)} />
        </SheetContent>
      </Sheet>
    </div>
  );
}

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <header className="flex items-start justify-between gap-4 px-5 pb-4 pt-8 md:px-10 md:pt-10">
      <div className="animate-nomi-rise">
        <h1 className="text-2xl font-extrabold md:text-3xl">{title}</h1>
        {subtitle ? <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p> : null}
      </div>
      {action}
    </header>
  );
}
