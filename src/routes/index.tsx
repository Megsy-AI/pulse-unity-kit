import { createFileRoute } from "@tanstack/react-router";
import { SpaMount } from "@/lib/spaMount";

const title = "Studio — Footer";
const description = "Fresh ideas, imagination, and creative collaboration.";

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
