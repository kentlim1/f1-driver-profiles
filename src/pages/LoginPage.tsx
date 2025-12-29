import React, { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { useSession } from "../lib/useSession";

type LocationState = { from?: string };

export default function LoginPage() {
  const { session } = useSession();
  const navigate = useNavigate();
  const location = useLocation();

  const state = (location.state as LocationState | null) ?? null;
  const redirectTo = useMemo(() => state?.from || "/", [state]);

  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(
    null
  );

  async function handleEmailAuth(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    setBusy(true);

    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        const { profile } = await (await import("../lib/profile")).getMyProfile();
        navigate(profile?.username ? redirectTo : "/username", { replace: true });

      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setMessage({
          type: "success",
          text: "Account created — check your email to confirm, then sign in.",
        });
        setMode("signin");
      }
    } catch (err: any) {
      setMessage({ type: "error", text: err?.message ?? "Something went wrong." });
    } finally {
      setBusy(false);
    }
  }

  async function handleOAuth(provider: "google" | "github") {
    setMessage(null);
    setBusy(true);

    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: window.location.origin },
    });

    if (error) setMessage({ type: "error", text: error.message });
    setBusy(false);
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
  }

  if (session) {
    return (
      <div className="min-h-[70vh] grid place-items-center px-6">
        <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur">
          <div className="text-center">
            <h2 className="text-2xl font-extrabold tracking-tight">You’re logged in ✅</h2>
            <p className="mt-2 text-sm text-white/70">{session.user.email}</p>
          </div>

          <div className="mt-6 grid gap-3">
            <button
              className="w-full rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-black hover:bg-white/90 disabled:opacity-60"
              onClick={() => navigate("/")}
            >
              Go back home
            </button>
            <button
              className="w-full rounded-xl border border-white/15 bg-transparent px-4 py-2.5 text-sm font-bold text-white hover:bg-white/5 disabled:opacity-60"
              onClick={handleSignOut}
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[70vh] grid place-items-center px-6">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur">
        <div className="text-center">
          <h2 className="text-2xl font-extrabold tracking-tight">
            {mode === "signin" ? "Welcome back" : "Create your account"}
          </h2>
          <p className="mt-2 text-sm text-white/70">
            {mode === "signin"
              ? "Sign in to interact with the community on race days (coming soon!)"
              : "Sign up with your email and password."}
          </p>
        </div>

        {/* OAuth */}
        <div className="mt-6 grid gap-3">
          <button
            type="button"
            onClick={() => handleOAuth("google")}
            disabled={busy}
            className="w-full rounded-xl border border-white/15 bg-transparent px-4 py-2.5 text-sm font-bold text-white hover:bg-white/5 disabled:opacity-60"
            title="Enable Google provider in Supabase to use this"
          >
            Continue with Google
          </button>
        </div>

        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-white/10" />
          <span className="text-xs text-white/60">or</span>
          <div className="h-px flex-1 bg-white/10" />
        </div>

        {/* Email/password */}
        <form onSubmit={handleEmailAuth} className="grid gap-3">
          <label className="grid gap-1 text-sm text-white/80">
            Email
            <input
              className="w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2.5 text-white placeholder:text-white/40 outline-none focus:border-white/25 focus:ring-2 focus:ring-white/10"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={busy}
              required
            />
          </label>

          <label className="grid gap-1 text-sm text-white/80">
            Password
            <input
              className="w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2.5 text-white placeholder:text-white/40 outline-none focus:border-white/25 focus:ring-2 focus:ring-white/10"
              type="password"
              autoComplete={mode === "signin" ? "current-password" : "new-password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={busy}
              minLength={6}
              required
            />
          </label>

          <button
            type="submit"
            disabled={busy}
            className="mt-2 w-full rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-black hover:bg-white/90 disabled:opacity-60"
          >
            {busy ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
          </button>

          {message && (
            <div
              className={[
                "mt-2 rounded-xl border p-3 text-sm",
                message.type === "success"
                  ? "border-emerald-400/20 bg-emerald-500/10 text-emerald-200"
                  : "border-red-400/20 bg-red-500/10 text-red-200",
              ].join(" ")}
            >
              {message.text}
            </div>
          )}
        </form>

        <div className="mt-5 flex items-center justify-between text-sm">
          <button
            type="button"
            disabled={busy}
            onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
            className="text-white/80 underline underline-offset-4 hover:text-white disabled:opacity-60"
          >
            {mode === "signin" ? "Need an account? Sign up" : "Already have an account? Sign in"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/")}
            className="text-white/70 hover:text-white"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
}
