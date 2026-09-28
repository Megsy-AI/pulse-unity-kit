import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useNomi } from "../store";
import { NomiAvatar } from "../avatar/NomiAvatar";
import type { NomiCompanion, NomiShape } from "../types";

const SHAPES: Array<{ id: NomiShape; en: string; ar: string }> = [
  { id: "round", en: "Bubble", ar: "فقاعة" },
  { id: "cat", en: "Kitty", ar: "قطة" },
  { id: "bear", en: "Bear", ar: "دبدوب" },
  { id: "star", en: "Star", ar: "نجمة" },
  { id: "robot", en: "Robo", ar: "روبوت" },
];

const PALETTES: Array<{ base: string; accent: string }> = [
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

export default function OnboardingPage() {
  const { companion, updateCompanion, t, language } = useNomi();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const ar = language === "ar";

  const steps = useMemo(() => [t("stepLook"), t("stepName"), t("stepPersonality"), t("stepLanguage")], [t]);

  const finish = () => {
    updateCompanion({ onboarded: true });
    navigate("/chat", { replace: true });
  };

  return (
    <main className="mx-auto flex min-h-dvh max-w-5xl flex-col px-6 py-10">
      <div className="flex items-center justify-center gap-2">
        {steps.map((label, index) => (
          <div key={label} className="flex items-center gap-2">
            <span
              className={cn(
                "flex size-7 items-center justify-center rounded-full text-xs font-semibold transition-colors",
                index <= step ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground",
              )}
            >
              {index < step ? <Check className="size-3.5" /> : index + 1}
            </span>
            {index < steps.length - 1 ? <span className="h-px w-6 bg-border" /> : null}
          </div>
        ))}
      </div>

      <h1 className="mt-8 text-center text-2xl font-bold md:text-3xl">{t("onboardTitle")}</h1>

      <div className="mt-6 grid flex-1 items-start gap-8 md:grid-cols-2">
        <div className="flex justify-center rounded-[2rem] bg-primary-soft/50 p-6">
          <NomiAvatar companion={companion} pose={step === 2 ? "celebrate" : "wave"} size={260} />
        </div>

        <div className="animate-nomi-rise space-y-6">
          {step === 0 ? (
            <>
              <div>
                <p className="mb-3 text-sm font-medium">{t("shape")}</p>
                <div className="grid grid-cols-3 gap-3">
                  {SHAPES.map((shape) => (
                    <button
                      key={shape.id}
                      type="button"
                      onClick={() => updateCompanion({ shape: shape.id })}
                      className={cn(
                        "rounded-2xl border p-3 text-center transition-all",
                        companion.shape === shape.id
                          ? "border-primary bg-primary-soft"
                          : "border-border hover:border-primary/40",
                      )}
                    >
                      <NomiAvatar
                        companion={{ ...companion, shape: shape.id }}
                        size={64}
                        floating={false}
                      />
                      <span className="mt-1 block text-xs font-medium">
                        {ar ? shape.ar : shape.en}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-3 text-sm font-medium">{t("colors")}</p>
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
                      style={{
                        background: `linear-gradient(135deg, ${palette.base}, ${palette.accent})`,
                      }}
                    />
                  ))}
                </div>
              </div>
            </>
          ) : null}

          {step === 1 ? (
            <div className="space-y-3">
              <p className="text-sm font-medium">{t("nameLabel")}</p>
              <Input
                value={companion.name}
                maxLength={20}
                onChange={(e) => updateCompanion({ name: e.target.value })}
                className="h-12 rounded-2xl text-lg"
                placeholder="Nomi"
              />
              <div className="flex flex-wrap gap-2">
                {["Nomi", "Luna", "Zeko", "سمسم", "نور", "Miso"].map((name) => (
                  <button
                    key={name}
                    type="button"
                    onClick={() => updateCompanion({ name })}
                    className="rounded-full bg-secondary px-4 py-1.5 text-sm hover:bg-primary-soft"
                  >
                    {name}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {step === 2 ? (
            <div className="space-y-6">
              <div>
                <p className="mb-3 text-sm font-medium">{t("personalityLabel")}</p>
                <div className="flex flex-wrap gap-2">
                  {PERSONALITIES.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => updateCompanion({ personality: item.id })}
                      className={cn(
                        "rounded-full border px-4 py-2 text-sm transition-colors",
                        companion.personality === item.id
                          ? "border-primary bg-primary-soft text-primary"
                          : "border-border hover:bg-secondary",
                      )}
                    >
                      {ar ? item.ar : item.en}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-3 text-sm font-medium">{t("toneLabel")}</p>
                <div className="flex flex-wrap gap-2">
                  {TONES.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => updateCompanion({ tone: item.id })}
                      className={cn(
                        "rounded-full border px-4 py-2 text-sm transition-colors",
                        companion.tone === item.id
                          ? "border-primary bg-primary-soft text-primary"
                          : "border-border hover:bg-secondary",
                      )}
                    >
                      {ar ? item.ar : item.en}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : null}

          {step === 3 ? (
            <div className="space-y-3">
              <p className="text-sm font-medium">{t("language")}</p>
              {[
                { id: "en" as const, label: "English" },
                { id: "ar" as const, label: "العربية المصرية" },
              ].map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => updateCompanion({ language: option.id })}
                  className={cn(
                    "flex w-full items-center justify-between rounded-2xl border px-5 py-4 text-start transition-colors",
                    companion.language === option.id
                      ? "border-primary bg-primary-soft"
                      : "border-border hover:bg-secondary",
                  )}
                >
                  <span className="font-medium">{option.label}</span>
                  {companion.language === option.id ? <Check className="size-4 text-primary" /> : null}
                </button>
              ))}
            </div>
          ) : null}

          <div className="flex gap-3 pt-2">
            {step > 0 ? (
              <Button variant="ghost" className="h-11 rounded-2xl" onClick={() => setStep(step - 1)}>
                {t("back")}
              </Button>
            ) : null}
            <Button
              className="h-11 flex-1 rounded-2xl"
              onClick={() => (step === 3 ? finish() : setStep(step + 1))}
            >
              {step === 3 ? t("finish") : t("next")}
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
