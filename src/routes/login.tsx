import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { ArrowRight, Mail, Lock, User } from "lucide-react";
import logo from "@/assets/LOGO.png.asset.json";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Login — B Cube Personalised Décor" },
      {
        name: "description",
        content:
          "Sign in to your B Cube account to track personalised orders, save designs and check out faster.",
      },
      { property: "og:title", content: "Login — B Cube Personalised Décor" },
      { property: "og:description", content: "Sign in or create your B Cube account." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LoginPage,
});

/** Shape the backend auth endpoints should accept. */
export type AuthPayload = {
  mode: "login" | "signup";
  name?: string;
  email: string;
  password: string;
};

function LoginPage() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  function set<K extends keyof typeof form>(k: K, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  function handleSocial(provider: SocialProvider) {
    // TODO(backend): start the OAuth flow for this provider and persist the session.
    console.info("oauth provider", provider);
    toast.info(`${provider === "google" ? "Google" : "Facebook"} sign-in coming soon.`);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload: AuthPayload = { mode, email: form.email, password: form.password, ...(mode === "signup" ? { name: form.name } : {}) };
    // TODO(backend): POST payload to the auth endpoint and persist the session.
    console.info("auth payload", payload);
    toast.success(mode === "login" ? "Welcome back!" : "Account created — you can sign in now.");
    if (mode === "signup") setMode("login");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/30 px-4 pb-24 pt-10 md:pb-16">
      <div className="w-full max-w-lg">
        <div className="text-center">
          <img src={logo.url} alt="B Cube logo" className="mx-auto h-24 w-24 object-contain md:h-28 md:w-28" />
          <h1 className="mt-5 font-display text-2xl italic text-brand-ink md:text-3xl">
            More Than Décor. It&apos;s Personal.
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
            Sign in to track your personalised orders, revisit saved designs and check out in a couple of taps.
          </p>
        </div>

        <div className="mt-8 rounded-[25px] bg-brand-yellow p-6 md:p-[40px]">
          <div className="flex rounded-full bg-white/60 p-1">
            {(["login", "signup"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`flex-1 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                  mode === m ? "bg-brand-red text-white" : "text-brand-ink hover:bg-white/60"
                }`}
              >
                {m === "login" ? "Login" : "Create account"}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {mode === "signup" && (
              <Field icon={<User className="h-4 w-4" />} label="Full name">
                <input
                  required
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                  placeholder="Your name"
                  className="w-full bg-transparent text-sm text-brand-ink outline-none placeholder:text-brand-ink/40"
                />
              </Field>
            )}
            <Field icon={<Mail className="h-4 w-4" />} label="Email">
              <input
                required
                type="email"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-transparent text-sm text-brand-ink outline-none placeholder:text-brand-ink/40"
              />
            </Field>
            <Field icon={<Lock className="h-4 w-4" />} label="Password">
              <input
                required
                minLength={6}
                type="password"
                value={form.password}
                onChange={(e) => set("password", e.target.value)}
                placeholder="••••••••"
                className="w-full bg-transparent text-sm text-brand-ink outline-none placeholder:text-brand-ink/40"
              />
            </Field>

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-full bg-brand-red px-7 py-3 text-sm font-semibold text-white hover:brightness-95"
            >
              {mode === "login" ? "Login" : "Create account"} <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <div className="my-5 flex items-center gap-3">
            <span className="h-px flex-1 bg-brand-ink/15" />
            <span className="text-[11px] font-semibold uppercase tracking-wide text-brand-ink/60">or continue with</span>
            <span className="h-px flex-1 bg-brand-ink/15" />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <SocialButton provider="google" onClick={() => handleSocial("google")} />
            <SocialButton provider="facebook" onClick={() => handleSocial("facebook")} />
          </div>

          <p className="mt-4 text-center text-xs text-brand-ink/70">
            Need help with an order?{" "}
            <Link to="/contact" className="font-semibold underline">
              Contact us
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}

function Field({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <label className="block rounded-2xl bg-white px-4 py-3">
      <span className="mb-1 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-brand-ink/60">
        {icon} {label}
      </span>
      {children}
    </label>
  );
}
