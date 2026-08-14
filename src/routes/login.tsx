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

/** OAuth providers offered on the login screen. */
export type SocialProvider = "google" | "facebook";

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

            <MagneticButton
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-full bg-brand-red px-7 py-3 text-sm font-semibold text-white hover:brightness-95"
            >
              {mode === "login" ? "Login" : "Create account"} <ArrowRight className="h-4 w-4" />
            </MagneticButton>
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

function SocialButton({ provider, onClick }: { provider: SocialProvider; onClick: () => void }) {
  const google = provider === "google";
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-brand-ink transition hover:brightness-95"
    >
      {google ? (
        <svg viewBox="0 0 48 48" className="h-4 w-4" aria-hidden="true">
          <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.6l6.7-6.7C35.6 2.5 30.2 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.8 6.1C12.3 13.2 17.7 9.5 24 9.5z" />
          <path fill="#4285F4" d="M46.1 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.4c-.5 2.9-2.1 5.3-4.5 6.9l7 5.4c4.1-3.8 7.2-9.4 7.2-16.8z" />
          <path fill="#FBBC05" d="M10.4 28.7a14.6 14.6 0 0 1 0-9.4l-7.8-6.1a24 24 0 0 0 0 21.6l7.8-6.1z" />
          <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7-5.4c-2 1.3-4.6 2.1-8.9 2.1-6.3 0-11.7-3.7-13.6-9.2l-7.8 6.1C6.5 42.6 14.6 48 24 48z" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="#1877F2" aria-hidden="true">
          <path d="M22 12a10 10 0 1 0-11.6 9.9v-7h-2.5V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.4h-1.2c-1.2 0-1.6.8-1.6 1.6V12h2.7l-.4 2.9h-2.3v7A10 10 0 0 0 22 12z" />
        </svg>
      )}
      {google ? "Google" : "Facebook"}
    </button>
  );
}
