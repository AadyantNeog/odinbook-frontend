import { useEffect, useState } from "react";
import { api, ApiError, setTokenGetter } from "../lib/api";
import { AuthContext } from "./auth-context";

const TOKEN_KEY = "odinbook.token";

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || "");
  const [user, setUser] = useState(null);
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  useEffect(() => {
    setTokenGetter(() => token);
  }, [token]);

  useEffect(() => {
    let ignore = false;

    async function bootstrap() {
      if (!token) {
        setUser(null);
        setIsBootstrapping(false);
        return;
      }

      try {
        const response = await api.get("/auth/me");
        if (!ignore) {
          setUser(response.user);
        }
      } catch (error) {
        if (!ignore) {
          setToken("");
          localStorage.removeItem(TOKEN_KEY);
          setUser(null);
        }

        if (!(error instanceof ApiError)) {
          console.error(error);
        }
      } finally {
        if (!ignore) {
          setIsBootstrapping(false);
        }
      }
    }

    bootstrap();

    return () => {
      ignore = true;
    };
  }, [token]);

  async function authenticate(path, payload) {
    const response = await api.post(path, payload);
    setToken(response.token);
    localStorage.setItem(TOKEN_KEY, response.token);
    setUser(response.user);
    return response.user;
  }

  async function signIn(payload) {
    return authenticate("/auth/login", payload);
  }

  async function signUp(payload) {
    return authenticate("/auth/signup", payload);
  }

  function signOut() {
    setToken("");
    setUser(null);
    localStorage.removeItem(TOKEN_KEY);
  }

  const value = {
    token,
    user,
    isBootstrapping,
    isAuthenticated: Boolean(token && user),
    setUser,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
