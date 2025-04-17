"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { registerUser, loginUser, logoutUser, getCurrentUser } from "@/lib/api";
import type { User } from "@/types";
import { toast } from "@/hooks/use-toast";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  register: (userData: any) => Promise<boolean>;
  login: (credentials: any) => Promise<boolean>;
  logout: () => Promise<void>;
  clearError: () => void; // Adiciona clearError
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Verificar se o usuário está autenticado ao carregar a página
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const data = await getCurrentUser();
        if (data && data.success) {
          setUser(data.data);
          setIsAuthenticated(true);
          setError(null);
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (err) {
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Registrar um novo usuário
  const register = async (userData: any) => {
    try {
      setLoading(true);
      const data = await registerUser(userData);
      if (data.success) {
        setUser(data.data);
        setIsAuthenticated(true);
        setError(null);
        toast({
          title: "Registro realizado com sucesso",
          description: "Bem-vindo ao LinkHub!",
        });
        return true;
      } else {
        setError(data.error || "Erro ao registrar");
        toast({
          title: "Erro no registro",
          description: data.error || "Não foi possível criar sua conta",
          variant: "destructive",
        });
        return false;
      }
    } catch (err) {
      setError("Erro ao registrar");
      toast({
        title: "Erro no registro",
        description: "Não foi possível criar sua conta",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Fazer login
  const login = async (credentials: any) => {
    try {
      setLoading(true);
      const data = await loginUser(credentials);
      if (data.success) {
        setUser(data.data);
        setIsAuthenticated(true);
        setError(null);
        toast({
          title: "Login realizado com sucesso",
          description: "Bem-vindo de volta!",
        });
        return true;
      } else {
        setError(data.error || "Credenciais inválidas");
        toast({
          title: "Erro no login",
          description: data.error || "Credenciais inválidas",
          variant: "destructive",
        });
        return false;
      }
    } catch (err) {
      setError("Erro ao fazer login");
      toast({
        title: "Erro no login",
        description: "Não foi possível fazer login",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Fazer logout
  const logout = async () => {
    try {
      setLoading(true);
      await logoutUser();
      setUser(null);
      setIsAuthenticated(false);
      toast({
        title: "Logout realizado com sucesso",
        description: "Você foi desconectado",
      });
    } catch (err) {
      toast({
        title: "Erro ao fazer logout",
        description: "Não foi possível fazer logout",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Limpar erro
  const clearError = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        error,
        register,
        login,
        logout,
        clearError, // Adiciona clearError ao contexto
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}