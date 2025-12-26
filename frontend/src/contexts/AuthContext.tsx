import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { tokenService } from "../utils/token";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  profileImage?: string;
  supervisor?: string;
  cluster?: string;
  startDate?: string | Date;
  dailyTarget?: number;
  weeklyTarget?: number;
  monthlyTarget?: number;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => tokenService.getUser());

  useEffect(() => {
    const storedUser = tokenService.getUser();
    if (storedUser && tokenService.getToken()) {
      setUser(storedUser);
    }
  }, []);

  const login = (userData: User, token: string) => {
    tokenService.setToken(token);
    tokenService.setUser(userData);
    setUser(userData);
  };

  const logout = () => {
    tokenService.removeToken();
    setUser(null);
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      tokenService.setUser(updatedUser);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user && !!tokenService.getToken(),
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}

