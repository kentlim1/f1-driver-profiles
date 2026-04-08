import { useEffect, useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { useSession } from "../lib/useSession";
import { getMyUsername } from "../lib/profile";

export default function Navbar() {
  const { session, loading } = useSession();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState<string | null>(null);

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

  const initials = (username?.[0] ?? session?.user.email?.[0] ?? "U").toUpperCase();

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#0e0e0e]/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Logo / Brand */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-red-600 to-orange-500 font-black text-white text-sm shadow-lg shadow-red-500/20">
            F1
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-white leading-tight group-hover:text-red-400 transition-colors">
              Driver Profiles
            </span>
            <span className="text-[10px] text-gray-500 leading-tight">2026 Season</span>
          </div>
        </Link>

        {/* Right side: Auth */}
        <div className="relative">
          {loading ? null : !session ? (
            <button
              onClick={() => navigate("/login")}
              className="rounded-full bg-gradient-to-r from-red-600 to-orange-500 px-5 py-2 text-sm font-bold text-white shadow-lg shadow-red-500/20 transition hover:shadow-red-500/40 hover:scale-105 active:scale-95"
            >
              Sign in
            </button>
          ) : (
            <>
              <button
                onClick={() => setOpen((v) => !v)}
                className="flex items-center gap-2.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white backdrop-blur transition hover:bg-white/10 hover:border-white/20 active:scale-95"
              >
                <div className="grid h-7 w-7 place-items-center rounded-full bg-gradient-to-br from-red-600 to-orange-500 text-xs font-bold text-white">
                  {initials}
                </div>
                <span className="hidden sm:block max-w-[140px] truncate text-sm">
                  {displayName}
                </span>
                <svg
                  className={`h-3.5 w-3.5 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {open && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
                  <div className="absolute right-0 z-50 mt-2 w-52 overflow-hidden rounded-xl border border-white/10 bg-[#1a1a1a]/95 shadow-2xl backdrop-blur-xl">
                    <div className="border-b border-white/10 px-4 py-3">
                      <p className="text-xs text-gray-500">Signed in as</p>
                      <p className="text-sm font-medium text-white truncate">{displayName}</p>
                    </div>

                    {!username && (
                      <button
                        onClick={() => { setOpen(false); navigate("/username"); }}
                        className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-white/80 hover:bg-white/5 transition-colors"
                      >
                        <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Pick a username
                      </button>
                    )}

                    <button
                      onClick={() => { setOpen(false); navigate("/"); }}
                      className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-white/80 hover:bg-white/5 transition-colors"
                    >
                      <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1" />
                      </svg>
                      Home
                    </button>

                    <div className="border-t border-white/10">
                      <button
                        onClick={async () => { await supabase.auth.signOut(); setOpen(false); }}
                        className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Sign out
                      </button>
                    </div>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>

      {/* Gradient accent line */}
      <div className="h-[2px] bg-gradient-to-r from-red-600 via-orange-500 to-yellow-500" />
    </nav>
  );
}
