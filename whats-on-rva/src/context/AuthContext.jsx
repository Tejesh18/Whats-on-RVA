import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import * as auth from '../lib/localAuth.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const s = auth.readSession();
    setUser(s?.email ? { email: s.email } : null);
    setReady(true);
  }, []);

  const login = useCallback(async (email, password) => {
    const u = await auth.localLogin(email, password);
    setUser({ email: u.email });
  }, []);

  const register = useCallback(async (email, password) => {
    const u = await auth.localRegister(email, password);
    setUser({ email: u.email });
  }, []);

  const logout = useCallback(() => {
    auth.localLogout();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, ready, login, register, logout }),
    [user, ready, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}
