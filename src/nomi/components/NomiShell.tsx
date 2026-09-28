import { NavLink, useLocation } from "react-router-dom";
import {
  MessageCircle,
  PhoneCall,
  ListChecks,
  Brain,
  Palette,
  Wand2,
  ShieldCheck,
} from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import { useNomi } from "../store";
import { NomiAvatar } from "../avatar/NomiAvatar";

const NAV = [
  { to: "/chat", key: "chat", icon: MessageCircle },
  { to: "/call", key: "calls", icon: PhoneCall },
  { to: "/tasks", key: "tasks", icon: ListChecks },
  { to: "/memory", key: "memory", icon: Brain },
  { to: "/character", key: "persona", icon: Palette },
  { to: "/abilities", key: "integrations", icon: Wand2 },
  { to: "/privacy", key: "privacy", icon: ShieldCheck },
] as const;

export function NomiShell({ children }: { children: ReactNode }) {
  const { companion, t } = useNomi();
  const { pathname } = useLocation();
  const immersive = pathname.startsWith("/call");

  if (immersive) return <>{children}</>;

  return (
    <div className="flex min-h-dvh bg-background">
      <aside className="hidden w-56 shrink-0 flex-col gap-1 border-e border-border bg-card px-3 py-5 md:flex">
        <div className="mb-7 flex items-center gap-3 px-2">
          <div className="grid size-10 shrink-0 place-items-center rounded-full bg-secondary">
            <NomiAvatar companion={companion} size={44} floating={false} />
          </div>
          <div className="min-w-0">
            <p className="truncate text-[15px] font-extrabold">Nomi</p>
            <p className="truncate text-[11px] font-medium text-muted-foreground">{companion.name}</p>
          </div>
        </div>

        {NAV.map(({ to, key, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors",
                isActive
                  ? "bg-secondary text-foreground"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground",
              )
            }
          >
            <Icon className="size-[18px]" strokeWidth={1.75} />
            {t(key)}
          </NavLink>
        ))}
      </aside>

      <div className="flex min-w-0 flex-1 flex-col pb-20 md:pb-0">{children}</div>

      <nav className="fixed inset-x-3 bottom-3 z-40 flex items-center justify-around rounded-2xl border border-border bg-card/95 px-1.5 pb-[max(0.4rem,env(safe-area-inset-bottom))] pt-1.5 shadow-[var(--shadow-navigation)] backdrop-blur-xl md:hidden">
        {NAV.slice(0, 5).map(({ to, key, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                "flex flex-1 flex-col items-center gap-1 rounded-xl py-1.5 text-[10px] font-semibold transition-colors",
                isActive ? "bg-secondary text-foreground" : "text-muted-foreground",
              )
            }
          >
            <Icon className="size-5" strokeWidth={1.75} />
            {t(key)}
          </NavLink>
        ))}
      </nav>
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
