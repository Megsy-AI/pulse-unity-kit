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
      {/* Desktop rail */}
      <aside className="hidden w-64 shrink-0 flex-col gap-1 border-e border-border bg-card/40 p-4 md:flex">
        <div className="mb-6 flex items-center gap-3 px-2">
          <div className="size-11 shrink-0 overflow-hidden rounded-full bg-primary-soft">
            <NomiAvatar companion={companion} size={44} floating={false} className="translate-y-1" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{companion.name}</p>
            <p className="truncate text-xs text-muted-foreground">{t("tagline")}</p>
          </div>
        </div>

        {NAV.map(({ to, key, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary-soft text-primary"
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

      {/* Mobile bar */}
      <nav className="nomi-glass fixed inset-x-0 bottom-0 z-40 flex items-center justify-around px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 md:hidden">
        {NAV.slice(0, 5).map(({ to, key, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                "flex flex-1 flex-col items-center gap-1 rounded-2xl py-1.5 text-[11px] font-medium transition-colors",
                isActive ? "text-primary" : "text-muted-foreground",
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
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">{title}</h1>
        {subtitle ? <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p> : null}
      </div>
      {action}
    </header>
  );
}
