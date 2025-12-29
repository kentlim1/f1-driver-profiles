import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSession } from "../lib/useSession";
import { getMyProfile } from "../lib/profile";

export default function UsernameGate() {
  const { session, loading } = useSession();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (loading) return;
    if (!session) return;

    // Don't loop on the username page
    if (location.pathname === "/username") return;

    (async () => {
      try {
        const { profile } = await getMyProfile();
        // If profile exists but username not set then force user to pick one
        if (!profile?.username) {
          navigate("/username", { replace: true });
        }
      } catch {
        // If something goes wrong reading profile
      }
    })();
  }, [session, loading, location.pathname, navigate]);

  return null;
}
