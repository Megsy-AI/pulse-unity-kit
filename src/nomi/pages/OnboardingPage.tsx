import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useNomi } from "../store";
import { NomiAvatar } from "../avatar/NomiAvatar";
import type { NomiCompanion, NomiShape } from "../types";

const LOOKS: Array<{
  id: NomiShape;
  en: string;
  ar: string;
  baseColor: string;
  accentColor: string;
  glasses: NomiCompanion["glasses"];
  outfit: NomiCompanion["outfit"];
  glassesLabel: string;
  outfitLabel: string;
}> = [
  { id: "round", en: "Moon drop", ar: "قطرة القمر", baseColor: "#B7A9F4", accentColor: "#2856D8", glasses: "cobalt-round", outfit: "varsity", glassesLabel: "Cobalt round", outfitLabel: "Varsity" },
  { id: "robot", en: "Mint pebble", ar: "حصاة نعناع", baseColor: "#BCE9CF", accentColor: "#142C55", glasses: "clear-square", outfit: "hoodie", glassesLabel: "Clear square", outfitLabel: "Hoodie" },
  { id: "star", en: "Peach star", ar: "نجمة خوخ", baseColor: "#FFA987", accentColor: "#F38CAD", glasses: "pink-heart", outfit: "overalls", glassesLabel: "Pink heart", outfitLabel: "Overalls" },
  { id: "bear", en: "Ivory cloud", ar: "سحابة عاجي", baseColor: "#F4E8D5", accentColor: "#D52D27", glasses: "black-oval", outfit: "knit", glassesLabel: "Black oval", outfitLabel: "Knit sweater" },
];

const chooseLook = (look: (typeof LOOKS)[number]) => ({ shape: look.id, baseColor: look.baseColor, accentColor: look.accentColor, glasses: look.glasses, outfit: look.outfit });

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
        <div className="sticky top-8 flex min-h-[330px] justify-center overflow-hidden rounded-3xl bg-primary-soft/50 p-4">
          <NomiAvatar companion={companion} pose="idle" size={300} floating={false} />
        </div>

        <div className="animate-nomi-rise space-y-6">
          {step === 0 ? (
            <>
              <div>
                <p className="mb-3 text-sm font-medium">{ar ? "اختار شخصيتك" : "Choose your character"}</p>
                <div className="grid grid-cols-2 gap-3">
                  {LOOKS.map((look) => (
                    <button
                      key={look.id}
                      type="button"
                      onClick={() => updateCompanion(chooseLook(look))}
                      className={cn(
                        "rounded-xl border p-2 text-center transition-all",
                        companion.shape === look.id
                          ? "border-primary bg-primary-soft"
                          : "border-border hover:border-primary/40",
                      )}
                    >
                      <NomiAvatar
                        companion={{ ...companion, ...chooseLook(look) }}
                        size={100}
                        floating={false}
                      />
                      <span className="mt-1 block text-xs font-medium">
                        {ar ? look.ar : look.en}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-3 text-sm font-medium">{ar ? "النظارة" : "Glasses"}</p>
                <div className="grid grid-cols-2 gap-2">
                  {LOOKS.map((look) => (
                    <button
                      key={look.glasses}
                      type="button"
                      onClick={() => updateCompanion(chooseLook(look))}
                      className={cn(
                        "rounded-xl border px-3 py-2 text-sm",
                        companion.glasses === look.glasses ? "border-primary bg-primary-soft text-primary" : "border-border",
                      )}
                    >{look.glassesLabel}</button>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-3 text-sm font-medium">{ar ? "الملابس" : "Outfit"}</p>
                <div className="grid grid-cols-2 gap-2">
                  {LOOKS.map((look) => (
                    <button key={look.outfit} type="button" onClick={() => updateCompanion(chooseLook(look))} className={cn("rounded-xl border px-3 py-2 text-sm", companion.outfit === look.outfit ? "border-primary bg-primary-soft text-primary" : "border-border")}>{look.outfitLabel}</button>
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
