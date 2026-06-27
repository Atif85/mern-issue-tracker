import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { clearAuthData, getToken, getUser, setAuthData, updateUser } from '../lib/auth.js';

const AuthContext = createContext({
  user: null,
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
  setUser: () => {},
});

export const AuthProvider = ({ children }) => {
  const [user, setUserState] = useState(() => getUser());

  const login = ({ token, user }) => {
    setAuthData({ token, user });
    setUserState(user);
  };

  const logout = () => {
    clearAuthData();
    setUserState(null);
  };

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      login,
      logout,
      setUser: (updatedUser) => {
        updateUser(updatedUser);
        setUserState(updatedUser);
      },
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
