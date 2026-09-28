import { Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useNomi } from "../store";
import { NomiAvatar } from "../avatar/NomiAvatar";
import { PageHeader } from "../components/NomiShell";
import type { NomiCompanion, NomiShape } from "../types";

const SHAPES: Array<{ id: NomiShape; en: string; ar: string }> = [
  { id: "round", en: "Bubble", ar: "فقاعة" },
  { id: "cat", en: "Kitty", ar: "قطة" },
  { id: "bear", en: "Bear", ar: "دبدوب" },
  { id: "star", en: "Star", ar: "نجمة" },
  { id: "robot", en: "Robo", ar: "روبوت" },
];

const PALETTES = [
  { base: "#7C5CFF", accent: "#FFB86B" },
  { base: "#38BDF8", accent: "#FDE68A" },
  { base: "#F472B6", accent: "#A7F3D0" },
  { base: "#34D399", accent: "#FCA5A5" },
  { base: "#F59E0B", accent: "#818CF8" },
  { base: "#111827", accent: "#F9A8D4" },
];

const PERSONALITIES: Array<{ id: NomiCompanion["personality"]; en: string; ar: string }> = [
  { id: "friendly", en: "Friendly", ar: "ودود" },
  { id: "calm", en: "Calm", ar: "هادئ" },
  { id: "playful", en: "Playful", ar: "مرح" },
  { id: "focused", en: "Focused", ar: "عملي" },
  { id: "wise", en: "Thoughtful", ar: "حكيم" },
];

const TONES: Array<{ id: NomiCompanion["tone"]; en: string; ar: string }> = [
  { id: "warm", en: "Warm", ar: "دافئ" },
  { id: "casual", en: "Casual", ar: "بسيط" },
  { id: "formal", en: "Formal", ar: "رسمي" },
  { id: "short", en: "Brief", ar: "مختصر" },
];

const VOICES: Array<{ id: NomiCompanion["voice"]; en: string; ar: string }> = [
  { id: "soft", en: "Soft", ar: "ناعم" },
  { id: "bright", en: "Bright", ar: "مشرق" },
  { id: "deep", en: "Deep", ar: "عميق" },
];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="nomi-card space-y-3 p-5">
      <h2 className="text-sm font-semibold">{title}</h2>
      {children}
    </section>
  );
}

function Chips<T extends string>({
  options,
  value,
  onSelect,
  ar,
}: {
  options: Array<{ id: T; en: string; ar: string }>;
  value: T;
  onSelect: (id: T) => void;
  ar: boolean;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          onClick={() => onSelect(option.id)}
          className={cn(
            "rounded-full border px-4 py-2 text-sm transition-colors",
            value === option.id
              ? "border-primary bg-primary-soft text-primary"
              : "border-border hover:bg-secondary",
          )}
        >
          {ar ? option.ar : option.en}
        </button>
      ))}
    </div>
  );
}

export default function CharacterPage() {
  const { companion, updateCompanion, theme, setTheme, t, language, session, signOut } = useNomi();
  const ar = language === "ar";

  return (
    <div>
      <PageHeader
        title={t("persona")}
        subtitle={ar ? "شكل نومي وطريقته في الكلام." : "How Nomi looks, feels and speaks."}
      />

      <div className="mx-auto grid w-full max-w-4xl gap-5 px-5 pb-10 md:grid-cols-[280px_1fr] md:px-6">
        <div className="flex h-fit flex-col items-center rounded-[2rem] bg-primary-soft/50 p-6">
          <NomiAvatar companion={companion} pose="wave" size={220} />
          <p className="mt-3 text-lg font-semibold">{companion.name}</p>
        </div>

        <div className="space-y-4">
          <Section title={t("nameLabel")}>
            <Input
              value={companion.name}
              maxLength={20}
              onChange={(e) => updateCompanion({ name: e.target.value })}
              className="h-11 rounded-2xl"
            />
          </Section>

          <Section title={t("shape")}>
            <div className="grid grid-cols-5 gap-2">
              {SHAPES.map((shape) => (
                <button
                  key={shape.id}
                  type="button"
                  onClick={() => updateCompanion({ shape: shape.id })}
                  className={cn(
                    "rounded-2xl border p-2 transition-colors",
                    companion.shape === shape.id
                      ? "border-primary bg-primary-soft"
                      : "border-border hover:border-primary/40",
                  )}
                >
                  <NomiAvatar
                    companion={{ ...companion, shape: shape.id }}
                    size={56}
                    floating={false}
                  />
                </button>
              ))}
            </div>
          </Section>

          <Section title={t("colors")}>
            <div className="flex flex-wrap gap-3">
              {PALETTES.map((palette) => (
                <button
                  key={palette.base}
                  type="button"
                  aria-label={palette.base}
                  onClick={() =>
                    updateCompanion({ baseColor: palette.base, accentColor: palette.accent })
                  }
                  className={cn(
                    "size-11 rounded-full ring-offset-2 ring-offset-background transition-all",
                    companion.baseColor === palette.base && "ring-2 ring-primary",
                  )}
                  style={{ background: `linear-gradient(135deg, ${palette.base}, ${palette.accent})` }}
                />
              ))}
            </div>
          </Section>

          <Section title={t("personalityLabel")}>
            <Chips
              options={PERSONALITIES}
              value={companion.personality}
              onSelect={(id) => updateCompanion({ personality: id })}
              ar={ar}
            />
          </Section>

          <Section title={t("toneLabel")}>
            <Chips
              options={TONES}
              value={companion.tone}
              onSelect={(id) => updateCompanion({ tone: id })}
              ar={ar}
            />
          </Section>

          <Section title={ar ? "الصوت" : "Voice"}>
            <Chips
              options={VOICES}
              value={companion.voice}
              onSelect={(id) => updateCompanion({ voice: id })}
              ar={ar}
            />
          </Section>

          <Section title={t("language")}>
            <Chips
              options={[
                { id: "en" as const, en: "English", ar: "English" },
                { id: "ar" as const, en: "العربية", ar: "العربية" },
              ]}
              value={companion.language}
              onSelect={(id) => updateCompanion({ language: id })}
              ar={ar}
            />
          </Section>

          <Section title={t("settings")}>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{t("darkMode")}</span>
              <Button
                variant="outline"
                size="sm"
                className="rounded-full"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
                {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
                {theme === "dark" ? (ar ? "فاتح" : "Light") : ar ? "داكن" : "Dark"}
              </Button>
            </div>
            {session ? (
              <Button
                variant="ghost"
                className="w-full justify-start rounded-2xl text-destructive hover:text-destructive"
                onClick={() => void signOut()}
              >
                {t("signOut")}
              </Button>
            ) : null}
          </Section>
        </div>
      </div>
    </div>
  );
}
