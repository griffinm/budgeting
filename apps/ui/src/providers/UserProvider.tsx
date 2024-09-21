import { createContext, useState, useContext, useEffect } from "react";
import { AuthUser } from "@budgeting/types";
import cookies from 'universal-cookie';
import { getCurrentUser } from "../utils/api";
import { Loading } from "@budgeting/ui/components";
import { useNavigate } from "react-router-dom";
import { urls } from "@budgeting/ui/utils/urls";
interface UserContextProps {
  user?: AuthUser | null;
  setUser: (user: AuthUser) => void;
  isAuthenticated: boolean;
  authLoading: boolean;
}

export const UserContext = createContext<UserContextProps>({
  user: null,
  setUser: () => {},
  isAuthenticated: false,
  authLoading: false,
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const jwt = new cookies().get('jwt');
    if (!jwt || user?.id) {
      navigate(urls.signIn);
      return;
    }

    const fetchUser = async () => {
      setAuthLoading(true);
      getCurrentUser().then((response) => {
        setUser(response.data);
        setIsAuthenticated(true);
      }).finally(() => {
        setAuthLoading(false);
      });
    };
    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, isAuthenticated, authLoading }}>
      {authLoading ? <Loading /> : children}
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
