import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useState } from "react";
import { User } from "../schemas/auth-schema";

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
  loading: true,
  signIn: async () => {},
  signOut: async () => {},
  setUser: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUserState] = useState<User | null>(null);

  useEffect(() => {
    loadSession();
  }, []);

  const loadSession = async () => {
    const storedToken = await AsyncStorage.getItem("token");
    const storedUser = await AsyncStorage.getItem("user");

    if (storedToken) setToken(storedToken);
    if (storedUser) setUserState(JSON.parse(storedUser));

    setLoading(false);
  };

  const signIn = async (token: string, user: User) => {
    await AsyncStorage.setItem("token", token);
    await AsyncStorage.setItem("user", JSON.stringify(user));
    setToken(token);
    setUser(user);
  };

  const signOut = async () => {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("user");
    setToken(null);
    setUserState(null);
  };

  const setUser = async (user: User) => {
    await AsyncStorage.setItem("user", JSON.stringify(user));
    setUserState(user);
  };

  return (
    <AuthContext.Provider
      value={{ user, token, loading, signIn, signOut, setUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
