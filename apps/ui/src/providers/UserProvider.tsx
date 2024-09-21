import { createContext, useState, useContext } from "react";
import { AuthUser } from "@budgeting/types";

interface UserContextProps {
  user?: AuthUser | null;
  setUser: (user: AuthUser) => void;
  isAuthenticated: boolean;
}

export const UserContext = createContext<UserContextProps>({
  user: null,
  setUser: () => {},
  isAuthenticated: false,
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <UserContext.Provider value={{ user, setUser, isAuthenticated }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
