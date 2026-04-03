import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getApiBase, getApiBaseCandidates } from "../utils/apiBase.js";

const ADMIN_STORAGE_KEY = "shonstudioAdminToken";

const API_BASE = getApiBase();
const API_BASE_CANDIDATES = getApiBaseCandidates();
const ADMIN_LOGIN_PATH = `${API_BASE}/shonstudio-admin-secured/login`;
const ADMIN_API_BASE = `${API_BASE}/shonstudio-admin-secured`;

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
    const params = new URLSearchParams(window.location.search);
    const incomingToken = params.get("adminToken");
    const shouldLogout = params.get("adminLogout");

    if (shouldLogout) {
      window.sessionStorage.removeItem(ADMIN_STORAGE_KEY);
      setToken("");
    } else if (incomingToken) {
      window.sessionStorage.setItem(ADMIN_STORAGE_KEY, incomingToken);
      setToken(incomingToken);
    }

    if (shouldLogout || incomingToken) {
      params.delete("adminToken");
      params.delete("adminLogout");
      const nextSearch = params.toString();
      const nextUrl = `${window.location.pathname}${nextSearch ? `?${nextSearch}` : ""}${window.location.hash}`;
      window.history.replaceState({}, "", nextUrl);
    }
  }, []);

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
        let lastError = null;

        for (const apiBase of API_BASE_CANDIDATES) {
          try {
            const response = await fetch(`${apiBase}/shonstudio-admin-secured${path}`, {
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
          } catch (requestError) {
            lastError = requestError;
          }
        }

        throw lastError || new Error("Admin request failed");
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
