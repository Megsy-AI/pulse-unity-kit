import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { Session } from "@supabase/supabase-js";

import { supabase } from "@/integrations/supabase/client";
import { askNomi } from "./ai";
import { detectPose } from "./intent";
import { makeT } from "./i18n";
import {
  DEFAULT_COMPANION,
  DEFAULT_PERMISSIONS,
  type NomiCompanion,
  type NomiLanguage,
  type NomiMemory,
  type NomiMessage,
  type NomiPermissions,
  type NomiPose,
  type NomiTask,
} from "./types";

const KEYS = {
  companion: "nomi_companion",
  messages: "nomi_messages",
  tasks: "nomi_tasks",
  memories: "nomi_memories",
  permissions: "nomi_permissions",
  theme: "nomi_theme",
  language: "nomi_language",
};

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? ({ ...fallback, ...JSON.parse(raw) } as T) : fallback;
  } catch {
    return fallback;
  }
}

function readList<T>(key: string): T[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(key);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    return [];
  }
}

function write(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage can be full or blocked — the app keeps working in memory */
  }
}

const uid = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);

interface NomiContextValue {
  ready: boolean;
  session: Session | null;
  companion: NomiCompanion;
  updateCompanion: (patch: Partial<NomiCompanion>) => void;
  messages: NomiMessage[];
  thinking: boolean;
  pose: NomiPose;
  speaking: boolean;
  sendMessage: (text: string) => Promise<void>;
  clearChat: () => void;
  tasks: NomiTask[];
  addTask: (task: Omit<NomiTask, "id" | "createdAt" | "done">) => void;
  toggleTask: (id: string) => void;
  removeTask: (id: string) => void;
  memories: NomiMemory[];
  addMemory: (content: string, category?: string) => void;
  toggleMemory: (id: string) => void;
  removeMemory: (id: string) => void;
  permissions: NomiPermissions;
  setPermission: (key: keyof NomiPermissions, value: boolean) => void;
  language: NomiLanguage;
  setLanguage: (lang: NomiLanguage) => void;
  theme: "light" | "dark";
  setTheme: (theme: "light" | "dark") => void;
  t: ReturnType<typeof makeT>;
  signOut: () => Promise<void>;
}

const NomiContext = createContext<NomiContextValue | null>(null);

export function NomiProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [companion, setCompanion] = useState<NomiCompanion>(DEFAULT_COMPANION);
  const [messages, setMessages] = useState<NomiMessage[]>([]);
  const [tasks, setTasks] = useState<NomiTask[]>([]);
  const [memories, setMemories] = useState<NomiMemory[]>([]);
  const [permissions, setPermissions] = useState<NomiPermissions>(DEFAULT_PERMISSIONS);
  const [theme, setThemeState] = useState<"light" | "dark">("light");
  const [thinking, setThinking] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [pose, setPose] = useState<NomiPose>("wave");
  const speakTimer = useRef<number | null>(null);

  /* ---------------------------------------------------------------- boot */
  useEffect(() => {
    const stored = read<NomiCompanion>(KEYS.companion, DEFAULT_COMPANION);
    setCompanion(stored);
    setMessages(readList<NomiMessage>(KEYS.messages));
    setTasks(readList<NomiTask>(KEYS.tasks));
    setMemories(readList<NomiMemory>(KEYS.memories));
    setPermissions(read<NomiPermissions>(KEYS.permissions, DEFAULT_PERMISSIONS));
    const savedTheme = (localStorage.getItem(KEYS.theme) as "light" | "dark") || "light";
    setThemeState(savedTheme);
    setReady(true);

    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => setSession(next));
    return () => sub.subscription.unsubscribe();
  }, []);

  /* ------------------------------------------------- html theme / dir */
  useEffect(() => {
    if (!ready) return;
    const html = document.documentElement;
    html.classList.toggle("dark", theme === "dark");
    html.style.colorScheme = theme;
    localStorage.setItem(KEYS.theme, theme);
  }, [theme, ready]);

  useEffect(() => {
    if (!ready) return;
    const html = document.documentElement;
    html.setAttribute("lang", companion.language);
    html.setAttribute("dir", companion.language === "ar" ? "rtl" : "ltr");
    localStorage.setItem(KEYS.language, companion.language);
  }, [companion.language, ready]);

  /* ------------------------------------------------------- persistence */
  useEffect(() => {
    if (ready) write(KEYS.companion, companion);
  }, [companion, ready]);
  useEffect(() => {
    if (ready) write(KEYS.messages, messages.slice(-80));
  }, [messages, ready]);
  useEffect(() => {
    if (ready) write(KEYS.tasks, tasks);
  }, [tasks, ready]);
  useEffect(() => {
    if (ready) write(KEYS.memories, memories);
  }, [memories, ready]);
  useEffect(() => {
    if (ready) write(KEYS.permissions, permissions);
  }, [permissions, ready]);

  /* ----------------------------------------------- cloud sync (signed in) */
  const userId = session?.user?.id ?? null;

  useEffect(() => {
    if (!userId || !ready) return;
    let cancelled = false;

    (async () => {
      const [{ data: comp }, { data: rows }, { data: mems }, { data: perms }] = await Promise.all([
        supabase.from("nomi_companions").select("*").eq("user_id", userId).maybeSingle(),
        supabase.from("nomi_tasks").select("*").eq("user_id", userId).order("created_at"),
        supabase.from("nomi_memories").select("*").eq("user_id", userId).order("created_at"),
        supabase.from("nomi_permissions").select("*").eq("user_id", userId).maybeSingle(),
      ]);
      if (cancelled) return;

      if (comp) {
        setCompanion((previous) => ({
          ...previous,
          name: comp.name,
          shape: comp.shape as NomiCompanion["shape"],
          baseColor: comp.base_color,
          accentColor: comp.accent_color,
          personality: comp.personality as NomiCompanion["personality"],
          tone: comp.tone as NomiCompanion["tone"],
          language: comp.language as NomiLanguage,
          voice: comp.voice as NomiCompanion["voice"],
          onboarded: comp.onboarded,
        }));
      }
      if (rows?.length)
        setTasks(
          rows.map((r) => ({
            id: r.id,
            title: r.title,
            note: r.note ?? undefined,
            kind: (r.kind as NomiTask["kind"]) ?? "task",
            dueAt: r.due_at,
            done: r.done,
            createdAt: r.created_at,
          })),
        );
      if (mems?.length)
        setMemories(
          mems.map((m) => ({
            id: m.id,
            category: m.category,
            content: m.content,
            enabled: m.enabled,
            createdAt: m.created_at,
          })),
        );
      if (perms)
        setPermissions({
          calls: perms.calls,
          email: perms.email,
          calendar: perms.calendar,
          web: perms.web,
          microphone: perms.microphone,
          memory: perms.memory,
        });
    })();

    return () => {
      cancelled = true;
    };
  }, [userId, ready]);

  const pushCompanion = useCallback(
    (next: NomiCompanion) => {
      if (!userId) return;
      void supabase.from("nomi_companions").upsert(
        {
          user_id: userId,
          name: next.name,
          shape: next.shape,
          base_color: next.baseColor,
          accent_color: next.accentColor,
          personality: next.personality,
          tone: next.tone,
          language: next.language,
          voice: next.voice,
          onboarded: next.onboarded,
        },
        { onConflict: "user_id" },
      );
    },
    [userId],
  );

  /* ------------------------------------------------------------ actions */
  const updateCompanion = useCallback(
    (patch: Partial<NomiCompanion>) =>
      setCompanion((prev) => {
        const next = { ...prev, ...patch };
        pushCompanion(next);
        return next;
      }),
    [pushCompanion],
  );

  const markSpeaking = useCallback((text: string) => {
    setSpeaking(true);
    if (speakTimer.current) window.clearTimeout(speakTimer.current);
    const duration = Math.min(9000, 1200 + text.length * 45);
    speakTimer.current = window.setTimeout(() => setSpeaking(false), duration);
  }, []);

  const sendMessage = useCallback(
    async (text: string) => {
      const clean = text.trim();
      if (!clean || thinking) return;

      const detected = detectPose(clean);
      const userMessage: NomiMessage = {
        id: uid(),
        role: "user",
        content: clean,
        pose: detected,
        createdAt: new Date().toISOString(),
      };
      const history = [...messages, userMessage];
      setMessages(history);
      setPose(detected);
      setThinking(true);

      if (userId)
        void supabase
          .from("nomi_messages")
          .insert({ user_id: userId, role: "user", content: clean, pose: detected });

      const reply = await askNomi(history, companion, memories);
      const assistantMessage: NomiMessage = {
        id: uid(),
        role: "assistant",
        content: reply,
        pose: detected,
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setThinking(false);
      markSpeaking(reply);

      if (userId)
        void supabase
          .from("nomi_messages")
          .insert({ user_id: userId, role: "assistant", content: reply, pose: detected });
    },
    [companion, memories, messages, thinking, userId, markSpeaking],
  );

  const clearChat = useCallback(() => setMessages([]), []);

  const addTask = useCallback<NomiContextValue["addTask"]>(
    (task) => {
      const row: NomiTask = {
        ...task,
        id: uid(),
        done: false,
        createdAt: new Date().toISOString(),
      };
      setTasks((prev) => [...prev, row]);
      if (userId)
        void supabase.from("nomi_tasks").insert({
          id: row.id,
          user_id: userId,
          title: row.title,
          note: row.note ?? null,
          kind: row.kind,
          due_at: row.dueAt ?? null,
        });
    },
    [userId],
  );

  const toggleTask = useCallback(
    (id: string) => {
      setTasks((prev) => {
        const next = prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t));
        const changed = next.find((t) => t.id === id);
        if (userId && changed)
          void supabase.from("nomi_tasks").update({ done: changed.done }).eq("id", id);
        return next;
      });
    },
    [userId],
  );

  const removeTask = useCallback(
    (id: string) => {
      setTasks((prev) => prev.filter((t) => t.id !== id));
      if (userId) void supabase.from("nomi_tasks").delete().eq("id", id);
    },
    [userId],
  );

  const addMemory = useCallback(
    (content: string, category = "preference") => {
      const row: NomiMemory = {
        id: uid(),
        category,
        content,
        enabled: true,
        createdAt: new Date().toISOString(),
      };
      setMemories((prev) => [...prev, row]);
      if (userId)
        void supabase
          .from("nomi_memories")
          .insert({ id: row.id, user_id: userId, category, content });
    },
    [userId],
  );

  const toggleMemory = useCallback(
    (id: string) => {
      setMemories((prev) => {
        const next = prev.map((m) => (m.id === id ? { ...m, enabled: !m.enabled } : m));
        const changed = next.find((m) => m.id === id);
        if (userId && changed)
          void supabase.from("nomi_memories").update({ enabled: changed.enabled }).eq("id", id);
        return next;
      });
    },
    [userId],
  );

  const removeMemory = useCallback(
    (id: string) => {
      setMemories((prev) => prev.filter((m) => m.id !== id));
      if (userId) void supabase.from("nomi_memories").delete().eq("id", id);
    },
    [userId],
  );

  const setPermission = useCallback(
    (key: keyof NomiPermissions, value: boolean) => {
      setPermissions((prev) => {
        const next = { ...prev, [key]: value };
        if (userId)
          void supabase
            .from("nomi_permissions")
            .upsert({ user_id: userId, ...next }, { onConflict: "user_id" });
        return next;
      });
    },
    [userId],
  );

  const setLanguage = useCallback(
    (lang: NomiLanguage) => updateCompanion({ language: lang }),
    [updateCompanion],
  );

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setSession(null);
  }, []);

  const value = useMemo<NomiContextValue>(
    () => ({
      ready,
      session,
      companion,
      updateCompanion,
      messages,
      thinking,
      pose,
      speaking,
      sendMessage,
      clearChat,
      tasks,
      addTask,
      toggleTask,
      removeTask,
      memories,
      addMemory,
      toggleMemory,
      removeMemory,
      permissions,
      setPermission,
      language: companion.language,
      setLanguage,
      theme,
      setTheme: setThemeState,
      t: makeT(companion.language),
      signOut,
    }),
    [
      ready,
      session,
      companion,
      updateCompanion,
      messages,
      thinking,
      pose,
      speaking,
      sendMessage,
      clearChat,
      tasks,
      addTask,
      toggleTask,
      removeTask,
      memories,
      addMemory,
      toggleMemory,
      removeMemory,
      permissions,
      setPermission,
      setLanguage,
      theme,
      signOut,
    ],
  );

  return <NomiContext.Provider value={value}>{children}</NomiContext.Provider>;
}

export function useNomi() {
  const ctx = useContext(NomiContext);
  if (!ctx) throw new Error("useNomi must be used inside NomiProvider");
  return ctx;
}
