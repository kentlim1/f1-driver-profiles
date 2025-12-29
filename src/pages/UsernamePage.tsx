import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyProfile, setMyUsername } from "../lib/profile";
import { useSession } from "../lib/useSession";

export default function UsernamePage() {
  const { session, loading } = useSession();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [msg, setMsg] = useState<{ type: "error" | "success"; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!session) {
      navigate("/login", { replace: true });
      return;
    }

    (async () => {
      try {
        const { profile } = await getMyProfile();
        if (profile?.username) navigate("/", { replace: true });
      } catch (e: any) {
        setMsg({ type: "error", text: e?.message ?? "Failed to load profile." });
      }
    })();
  }, [session, loading, navigate]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    setBusy(true);
    try {
      await setMyUsername(username);
      setMsg({ type: "success", text: "Username saved!" });
      navigate("/", { replace: true });
    } catch (e: any) {
      setMsg({ type: "error", text: e?.message ?? "Failed to save username." });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-[70vh] grid place-items-center px-6">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur">
        <h2 className="text-2xl font-extrabold tracking-tight text-center">
          Pick a username
        </h2>
        <p className="mt-2 text-sm text-white/70 text-center">
          This will be shown on your profile.
        </p>

        <form onSubmit={handleSave} className="mt-6 grid gap-3">
          <label className="grid gap-1 text-sm text-white/80">
            Username
            <input
              className="w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2.5 text-white placeholder:text-white/40 outline-none focus:border-white/25 focus:ring-2 focus:ring-white/10"
              placeholder="kent_lim"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={busy}
              required
            />
          </label>

          <p className="text-xs text-white/60">
            3–20 characters. Letters, numbers, underscore.
          </p>

          <button
            type="submit"
            disabled={busy}
            className="mt-2 w-full rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-black hover:bg-white/90 disabled:opacity-60"
          >
            {busy ? "Saving…" : "Save username"}
          </button>

          {msg && (
            <div
              className={[
                "mt-2 rounded-xl border p-3 text-sm",
                msg.type === "success"
                  ? "border-emerald-400/20 bg-emerald-500/10 text-emerald-200"
                  : "border-red-400/20 bg-red-500/10 text-red-200",
              ].join(" ")}
            >
              {msg.text}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
