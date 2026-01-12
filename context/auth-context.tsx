"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { User, UserRole } from "@/lib/types";
import { mockUsers } from "@/lib/mock-data";

interface AuthContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  switchRole: (role: UserRole) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(mockUsers[0]); // Default to first user
  const [isLoading, setIsLoading] = useState(false);

  const switchRole = (role: UserRole) => {
    setIsLoading(true);
    // Simulate loading
    setTimeout(() => {
      const user = mockUsers.find((u) => u.role === role);
      if (user) {
        setCurrentUser(user);
      }
      setIsLoading(false);
    }, 500);
  };

  return (
    <AuthContext.Provider
      value={{ currentUser, setCurrentUser, switchRole, isLoading }}
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
