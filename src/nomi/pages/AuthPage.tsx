import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useNomi } from "../store";
import { NomiAvatar } from "../avatar/NomiAvatar";

export default function AuthPage() {
  const { companion, t } = useNomi();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const ar = companion.language === "ar";

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    try {
      if (mode === "up") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/chat` },
        });
        if (error) throw error;
        toast.success(ar ? "تم إنشاء حسابك" : "Your account is ready");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
      navigate(companion.onboarded ? "/chat" : "/onboarding", { replace: true });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : ar ? "تعذر إتمام الطلب" : "Something went wrong");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="flex min-h-dvh items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm">
        <div className="flex justify-center">
          <NomiAvatar companion={companion} pose="wave" size={160} />
        </div>
        <h1 className="mt-4 text-center text-2xl font-bold">
          {mode === "in" ? t("signIn") : t("signUp")}
        </h1>
        <p className="mt-1 text-center text-sm text-muted-foreground">{t("tagline")}</p>

        <form onSubmit={submit} className="nomi-card mt-6 space-y-4 p-6">
          <div className="space-y-2">
            <Label htmlFor="email">{t("email")}</Label>
            <Input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-11 rounded-2xl"
              autoComplete="email"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">{t("password")}</Label>
            <Input
              id="password"
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-11 rounded-2xl"
              autoComplete={mode === "in" ? "current-password" : "new-password"}
            />
          </div>
          <Button type="submit" disabled={busy} className="h-11 w-full rounded-2xl">
            {mode === "in" ? t("signIn") : t("signUp")}
          </Button>
        </form>

        <div className="mt-4 flex flex-col items-center gap-2 text-sm">
          <button
            type="button"
            onClick={() => setMode(mode === "in" ? "up" : "in")}
            className="text-primary hover:underline"
          >
            {mode === "in"
              ? ar
                ? "ليس لديك حساب؟ أنشئ واحدًا"
                : "No account yet? Create one"
              : ar
                ? "لديك حساب بالفعل؟ سجل الدخول"
                : "Already have an account? Sign in"}
          </button>
          <Link to="/onboarding" className="text-muted-foreground hover:underline">
            {t("continueGuest")}
          </Link>
        </div>
      </div>
    </main>
  );
}
