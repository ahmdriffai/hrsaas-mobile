import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useState } from "react";

export type User = {
  id: string;
  name: string;
  email: string;
  company_id: string;
  role: "ADMIN" | "USER";
  created_at: string;
  updated_at: string;
};

type AuthContextType = {
  token: string | null;
  user: User | null;
  loading: boolean;
  signIn: (token: string, user: User) => Promise<void>;
  signOut: () => Promise<void>;
  setUser: (user: User) => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  token: null,
  user: null,
  loading: false,
  signIn: async () => {},
  signOut: async () => {},
  setUser: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUserState] = useState<User | null>(null);

  useEffect(() => {
    loadToken();
  }, []);

  const loadToken = async () => {
    const storedToken = await AsyncStorage.getItem("token");
    const storedUser = await AsyncStorage.getItem("user");

    if (storedToken) setToken(storedToken);
    if (storedUser) setUserState(JSON.parse(storedUser));

    setLoading(false);
  };

  async function signIn(token: string, userLogin: User) {
    await AsyncStorage.setItem("token", token);
    await AsyncStorage.setItem("user", JSON.stringify(userLogin));

    setToken(token);
    setUserState(userLogin);
  }

  async function signOut() {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("user");

    setToken(null);
    setUserState(null);
  }

  async function setUser(user: User) {
    await AsyncStorage.setItem("user", JSON.stringify(user));
    setUserState(user);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        signIn,
        signOut,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
