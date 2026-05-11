import React, { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { getMe } from "../utils/api";

export default function OAuthSuccess() {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      // Persist token for use with backend APIs (store under multiple keys for compatibility)
      localStorage.setItem("auth_token", token);

      // Try to fetch full user info from backend using the JWT
      const fetchUser = async () => {
        try {
          const data = await getMe();
          if (data) {
            const user = {
              id: data.id ?? data.email ?? "me",
              email: data.email ?? "",
              name: data.name ?? "",
              avatar: data.avatar ?? data.name ?? "",
            };

            localStorage.setItem("cv_builder_user", JSON.stringify(user));
            localStorage.setItem("auth_token", token);
            // Notify AuthContext to refresh in-memory user
            refreshUser();
          }
        } catch (err) {
          console.error("Error fetching user info:", err);
        } finally {
          navigate("/dashboard", { replace: true });
        }
      };

      fetchUser();
    }
  }, [navigate, refreshUser]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-[#2563EB] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Finalizing sign in...</p>
      </div>
    </div>
  );
}
