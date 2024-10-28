import { createContext, useContext, useEffect, useState } from "react";
import { ApiResponse, AuthResponse, Usuario } from "../utils/types";
import { api } from "../lib/axios";

type AuthContextType = {
  loading: boolean;
  checking: boolean;
  usuario?: Usuario;
  accessToken?: string;
  login: (documento: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [usuario, setUsuario] = useState<Usuario>();
  const [accessToken, setAccessToken] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const [checking, setChecking] = useState<boolean>(true);

  const checkAuth = async () => {

    if (usuario) return

    setChecking(true);

    try {
      const { data } = await api.get<ApiResponse<AuthResponse>>("/auth/check");

      if (data.ok && data.data) {
        setUsuario(data.data.usuario);
        setAccessToken(data.data.accessToken);
      }
    } catch (error) {
      setUsuario(undefined);
      setAccessToken(undefined);
    } finally {
      setChecking(false);
    }
  };

  const login = async (documento: string, password: string) => {
    setLoading(true);

    try {
      const { data } = await api.post<ApiResponse<AuthResponse>>("/auth/login", { documento, password });

      if (data.ok && data.data) {
        setUsuario(data.data.usuario);
        setAccessToken(data.data.accessToken);
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      throw new Error((error as Error).message)
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {

    setLoading(true);

    try {

      const { data } = await api.get<ApiResponse<undefined>>("/auth/logout")

      if (data.ok) {
        setUsuario(undefined)
        setAccessToken(undefined)
        window.location.assign("/login")
      } else {
        throw new Error(data.error)
      }

    } catch (error) {
      throw new Error((error as Error).message)
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ usuario, accessToken, login, logout, loading, checking }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context)
    throw new Error("useAuth debe estar dentro de AuthContextProvider");

  return context;
};
