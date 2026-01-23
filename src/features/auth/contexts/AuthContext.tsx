import React, { createContext, useContext, ReactNode } from 'react';
import { useAuth } from '../hooks/useAuth';
import type { User, Session } from '@supabase/supabase-js';

// Profile type inline to avoid circular dependencies
interface Profile {
  id: string;
  workspace_id: string | null;
  email: string;
  first_name: string;
  last_name: string;
  job_title: string | null;
  avatar_url: string | null;
  status: string | null;
  permissions: Record<string, boolean> | null;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signUp: (data: { email: string; password: string; firstName: string; lastName: string; jobTitle?: string }) => Promise<any>;
  signIn: (data: { email: string; password: string }) => Promise<any>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<Profile>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useAuth();
  
  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}
