import { createContext, useContext, useEffect, useMemo, useState } from "react";

const ADMIN_STORAGE_KEY = "shonstudioAdminToken";
const ADMIN_LOGIN_PATH = "/api/shonstudio-admin-prasham9114/login";
const ADMIN_API_BASE = "/api/shonstudio-admin-prasham9114";

const AdminContext = createContext(null);

export const AdminProvider = ({ children }) => {
  const [token, setToken] = useState(() => {
    if (typeof window === "undefined") {
      return "";
    }

    return window.sessionStorage.getItem(ADMIN_STORAGE_KEY) || "";
  });
  const [refreshVersion, setRefreshVersion] = useState(0);

  useEffect(() => {
    const syncToken = () => {
      setToken(window.sessionStorage.getItem(ADMIN_STORAGE_KEY) || "");
    };

    window.addEventListener("storage", syncToken);

    return () => window.removeEventListener("storage", syncToken);
  }, []);

  const value = useMemo(() => {
    const persistToken = (nextToken) => {
      if (nextToken) {
        window.sessionStorage.setItem(ADMIN_STORAGE_KEY, nextToken);
        setToken(nextToken);
        return;
      }

      window.sessionStorage.removeItem(ADMIN_STORAGE_KEY);
      setToken("");
    };

    return {
      token,
      isAdmin: Boolean(token),
      adminApiBase: ADMIN_API_BASE,
      adminLoginPath: ADMIN_LOGIN_PATH,
      refreshVersion,
      openLogin: () => {
        window.location.assign(ADMIN_LOGIN_PATH);
      },
      logout: () => {
        persistToken("");
        window.location.assign("/");
      },
      setAdminToken: persistToken,
      signalRefresh: () => {
        setRefreshVersion((current) => current + 1);
      },
      requestAdmin: async (path, options = {}) => {
        const response = await fetch(`${ADMIN_API_BASE}${path}`, {
          ...options,
          headers: {
            ...(options.headers || {}),
            Authorization: `Bearer ${token}`,
          },
        });

        const result = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(result.message || "Admin request failed");
        }

        return result;
      },
    };
  }, [refreshVersion, token]);

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
};

export const useAdmin = () => {
  const context = useContext(AdminContext);

  if (!context) {
    throw new Error("useAdmin must be used inside AdminProvider");
  }

  return context;
};
