import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api, ApiError, setTokenGetter } from "../lib/api";

const TOKEN_KEY = "odinbook.token";

const AuthContext = createContext(null);

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

  const value = useMemo(
    () => ({
      token,
      user,
      isBootstrapping,
      isAuthenticated: Boolean(token && user),
      setUser,
      signIn,
      signUp,
      signOut,
    }),
    [token, user, isBootstrapping],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
