import { useState, type FormEvent } from "react";
import { Bell, Check, ListChecks, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useNomi } from "../store";
import { NomiAvatar } from "../avatar/NomiAvatar";
import { PageHeader } from "../components/NomiShell";

export default function TasksPage() {
  const { companion, tasks, addTask, toggleTask, removeTask, t, language } = useNomi();
  const [title, setTitle] = useState("");
  const [kind, setKind] = useState<"task" | "reminder">("task");
  const [due, setDue] = useState("");
  const ar = language === "ar";

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!title.trim()) return;
    addTask({ title: title.trim(), kind, dueAt: due ? new Date(due).toISOString() : null });
    setTitle("");
    setDue("");
  };

  const open = tasks.filter((task) => !task.done);
  const done = tasks.filter((task) => task.done);

  return (
    <div>
      <PageHeader
        title={t("tasks")}
        subtitle={ar ? "كل اللي نومي بيتابعه لك." : "Everything Nomi is keeping track of."}
      />

      <div className="mx-auto w-full max-w-2xl px-5 pb-10 md:px-6">
        <form onSubmit={submit} className="nomi-card space-y-3 p-4">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={t("addTask")}
            className="h-11 rounded-2xl border-0 bg-secondary text-[15px]"
          />
          <div className="flex flex-wrap items-center gap-2">
            {(["task", "reminder"] as const).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setKind(option)}
                className={cn(
                  "rounded-full px-4 py-1.5 text-sm transition-colors",
                  kind === option ? "bg-primary text-primary-foreground" : "bg-secondary",
                )}
              >
                {option === "task" ? (ar ? "مهمة" : "Task") : ar ? "تذكير" : "Reminder"}
              </button>
            ))}
            <Input
              type="datetime-local"
              value={due}
              onChange={(e) => setDue(e.target.value)}
              className="h-9 w-auto flex-1 rounded-full border-0 bg-secondary text-sm"
            />
            <Button type="submit" className="h-9 rounded-full px-5">
              <Plus className="size-4" />
              {t("add")}
            </Button>
          </div>
        </form>

        {tasks.length === 0 ? (
          <div className="mt-10 flex flex-col items-center text-center">
            <NomiAvatar companion={companion} pose="write" size={170} />
            <p className="mt-3 text-sm text-muted-foreground">{t("noTasks")}</p>
          </div>
        ) : (
          <div className="mt-6 space-y-2">
            {[...open, ...done].map((task) => (
              <div
                key={task.id}
                className={cn(
                  "group flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3 transition-colors",
                  task.done && "opacity-55",
                )}
              >
                <button
                  type="button"
                  onClick={() => toggleTask(task.id)}
                  aria-label={task.title}
                  className={cn(
                    "flex size-6 shrink-0 items-center justify-center rounded-full border transition-colors",
                    task.done ? "border-primary bg-primary text-primary-foreground" : "border-border",
                  )}
                >
                  {task.done ? <Check className="size-3.5" /> : null}
                </button>
                <div className="min-w-0 flex-1">
                  <p className={cn("truncate text-[15px]", task.done && "line-through")}>
                    {task.title}
                  </p>
                  {task.dueAt ? (
                    <p className="text-xs text-muted-foreground">
                      {new Date(task.dueAt).toLocaleString(ar ? "ar-EG" : "en-GB", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </p>
                  ) : null}
                </div>
                {task.kind === "reminder" ? (
                  <Bell className="size-4 text-primary" strokeWidth={1.75} />
                ) : (
                  <ListChecks className="size-4 text-muted-foreground" strokeWidth={1.75} />
                )}
                <button
                  type="button"
                  onClick={() => removeTask(task.id)}
                  aria-label={t("delete")}
                  className="text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
