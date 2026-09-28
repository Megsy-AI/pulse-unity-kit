import type { NomiCompanion, NomiMemory, NomiMessage } from "./types";

const PERSONALITY: Record<string, { en: string; ar: string }> = {
  friendly: { en: "warm, encouraging and easy-going", ar: "ودود ومشجع وبسيط" },
  calm: { en: "calm, gentle and reassuring", ar: "هادئ ولطيف ومطمئن" },
  playful: { en: "playful, light and a bit funny", ar: "مرح وخفيف الظل" },
  focused: { en: "focused, practical and to the point", ar: "عملي ومباشر ومركز" },
  wise: { en: "thoughtful, calm and insightful", ar: "حكيم وهادئ وعميق" },
};

const TONE: Record<string, { en: string; ar: string }> = {
  warm: { en: "warm full sentences", ar: "جمل دافئة كاملة" },
  casual: { en: "casual everyday language", ar: "لغة يومية بسيطة" },
  formal: { en: "polite formal language", ar: "لغة مهذبة رسمية" },
  short: { en: "very short answers", ar: "إجابات قصيرة جدًا" },
};

export function buildSystemPrompt(companion: NomiCompanion, memories: NomiMemory[]) {
  const lang = companion.language;
  const persona = PERSONALITY[companion.personality] ?? PERSONALITY.friendly;
  const tone = TONE[companion.tone] ?? TONE.warm;
  const remembered = memories
    .filter((m) => m.enabled)
    .slice(0, 30)
    .map((m) => `- ${m.category}: ${m.content}`)
    .join("\n");

  const base =
    lang === "ar"
      ? `أنت "${companion.name}"، الرفيق الذكي الشخصي لهذا المستخدم. أسلوبك ${persona.ar}، وتتحدث بـ${tone.ar} بالعربية المصرية البسيطة. تساعد في تنظيم اليوم، المهام، التذكيرات، تلخيص المعلومات، واقتراح خطوات مفيدة. لا تذكر أبدًا أنك نموذج لغوي.`
      : `You are "${companion.name}", this person's own personal AI companion. Your manner is ${persona.en} and you speak in ${tone.en}. You help organise their day, tasks, reminders, summaries and useful next steps. Never mention being a language model.`;

  return remembered
    ? `${base}\n\n${lang === "ar" ? "ما تعرفه عن المستخدم:" : "What you remember about them:"}\n${remembered}`
    : base;
}

function localReply(text: string, companion: NomiCompanion) {
  const ar = companion.language === "ar";
  if (/task|remind|ذكرني|مهمة|تذكير/i.test(text))
    return ar
      ? "تمام، سجّلتها لك في المهام. أنبّهك في وقتها."
      : "Done — I've added that to your tasks and I'll keep an eye on it.";
  return ar
    ? `أنا معاك. احكيلي أكتر وأساعدك أنظمها خطوة بخطوة.`
    : `I'm here with you. Tell me a bit more and I'll help you organise it step by step.`;
}

export async function askNomi(
  history: NomiMessage[],
  companion: NomiCompanion,
  memories: NomiMemory[],
): Promise<string> {
  const messages = [
    { role: "system", content: buildSystemPrompt(companion, memories) },
    ...history.slice(-14).map((m) => ({ role: m.role, content: m.content })),
  ];

  try {
    const response = await fetch("/api/nomi-chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages, language: companion.language }),
    });
    if (response.ok) {
      const data = (await response.json()) as { reply?: string };
      const reply = data.reply?.trim();
      if (reply) return reply;
    }
  } catch {
    // fall through to the offline companion voice
  }

  return localReply(history[history.length - 1]?.content ?? "", companion);
}
