import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { useSession } from "../lib/useSession";
import { getMyUsername } from "../lib/profile";

export default function AuthButton() {
  const { session, loading } = useSession();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState<string | null>(null);

  // Fetch username when session changes (login/logout)
  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!session) {
        setUsername(null);
        return;
      }
      try {
        const u = await getMyUsername();
        if (!cancelled) setUsername(u);
      } catch {
        if (!cancelled) setUsername(null);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [session]);

  const displayName = useMemo(() => {
    if (!session) return "";
    return username || session.user.email || "Account";
  }, [username, session]);

  if (loading) return null;

  // Logged out
  if (!session) {
    return (
      <button
        onClick={() => navigate("/login")}
        className="
          absolute top-5 right-5 rounded-full
          bg-white px-4 py-2 text-sm font-semibold text-black
          shadow-md transition
          hover:bg-white/90 hover:shadow-lg
          focus:outline-none focus:ring-2 focus:ring-white/40
        "
      >
        Sign in
      </button>
    );
  }

  // Logged in
  const initials = (username?.[0] ?? session.user.email?.[0] ?? "U").toUpperCase();

  return (
    <div className="absolute top-5 right-5">
      <button
        onClick={() => setOpen((v) => !v)}
        className="
          flex items-center gap-2 rounded-full
          border border-white/15 bg-white/5 px-3 py-1.5
          text-sm text-white backdrop-blur transition
          hover:bg-white/10
          focus:outline-none focus:ring-2 focus:ring-white/30
        "
      >
        <div className="grid h-7 w-7 place-items-center rounded-full bg-white text-xs font-bold text-black">
          {initials}
        </div>

        <span className="hidden sm:block max-w-[140px] truncate">
          {displayName}
        </span>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 rounded-xl border border-white/10 bg-black/80 shadow-xl backdrop-blur">
          {!username && (
            <button
              onClick={() => {
                setOpen(false);
                navigate("/username");
              }}
              className="block w-full px-4 py-2 text-left text-sm text-white/90 hover:bg-white/10"
            >
              Pick a username
            </button>
          )}

          <button
            onClick={() => {
              setOpen(false);
              navigate("/");
            }}
            className="block w-full px-4 py-2 text-left text-sm text-white/90 hover:bg-white/10"
          >
            Home
          </button>

          <button
            onClick={async () => {
              await supabase.auth.signOut();
              setOpen(false);
            }}
            className="block w-full px-4 py-2 text-left text-sm text-red-300 hover:bg-red-500/10"
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
