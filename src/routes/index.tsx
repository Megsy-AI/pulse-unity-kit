import { createFileRoute } from "@tanstack/react-router";
import { SpaMount } from "@/lib/spaMount";

const title = "Nomi — Your own personal AI companion";
const description =
  "Nomi gives every person a personal AI companion with its own cartoon character, voice, memory and personality — to chat, organise tasks, set reminders and help with daily life.";

export const Route = createFileRoute("/")({
  ssr: false,
  component: SpaMount,
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
    ],
  }),
});
