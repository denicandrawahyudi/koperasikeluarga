import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { financeService } from "./financeService";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [sessionReady, setSessionReady] = useState(false);
  const [modeSederhana, setModeSederhana] = useState(true);

  useEffect(() => {
    const savedUser = window.localStorage.getItem("pk-user");
    const savedMode = window.localStorage.getItem("pk-mode-sederhana");

    if (savedUser) setUser(JSON.parse(savedUser));
    if (savedMode !== null) setModeSederhana(savedMode === "true");
    setSessionReady(true);
  }, []);

  const value = useMemo(
    () => ({
      user,
      modeSederhana,
      sessionReady,
      async login(payload) {
        const result = await financeService.login(payload);
        if (result.success) {
          setUser(result.data.user);
          window.localStorage.setItem("pk-user", JSON.stringify(result.data.user));
        }
        return result;
      },
      logout() {
        setUser(null);
        window.localStorage.removeItem("pk-user");
      },
      toggleModeSederhana() {
        setModeSederhana((prev) => {
          const next = !prev;
          window.localStorage.setItem("pk-mode-sederhana", String(next));
          return next;
        });
      },
    }),
    [user, modeSederhana, sessionReady],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  return useContext(AppContext);
}
