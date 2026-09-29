import { FolderKanban, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNomi } from "../store";
import { PageHeader } from "../components/NomiShell";

export default function ProjectsPage() {
  const { language } = useNomi();
  const ar = language === "ar";
  return <div><PageHeader title={ar ? "المشاريع" : "Projects"} subtitle={ar ? "مساحات مرتبة لكل شيء تعمل عليه مع نومي." : "A focused place for everything you work on with Nomi."} action={<Button className="rounded-xl"><Plus className="size-4" />{ar ? "مشروع جديد" : "New project"}</Button>} /><div className="mx-auto flex max-w-3xl flex-col items-center px-5 py-24 text-center"><span className="grid size-14 place-items-center rounded-2xl bg-secondary text-muted-foreground"><FolderKanban className="size-6" /></span><h2 className="mt-5 text-lg font-semibold">{ar ? "لا توجد مشاريع بعد" : "No projects yet"}</h2><p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">{ar ? "ابدأ مشروعًا وسيجمع نومي المحادثات والمهام والملاحظات الخاصة به هنا." : "Start one and Nomi will keep its conversations, tasks and notes together here."}</p></div></div>;
}