import { useState, useEffect, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client directly to avoid import issues during build
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});

// Profile type inline
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

interface AuthState {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface SignUpData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  jobTitle?: string;
}

interface SignInData {
  email: string;
  password: string;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    profile: null,
    isLoading: true,
    isAuthenticated: false,
  });

  // Fetch user profile
  const fetchProfile = useCallback(async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
    
    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
    return data;
  }, []);

  // Initialize auth state
  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setState(prev => ({
          ...prev,
          user: session?.user ?? null,
          session,
          isAuthenticated: !!session?.user,
          isLoading: false,
        }));

        // Defer profile fetch to avoid deadlock
        if (session?.user) {
          setTimeout(() => {
            fetchProfile(session.user.id).then(profile => {
              setState(prev => ({ ...prev, profile }));
            });
          }, 0);
        } else {
          setState(prev => ({ ...prev, profile: null }));
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setState(prev => ({
        ...prev,
        user: session?.user ?? null,
        session,
        isAuthenticated: !!session?.user,
        isLoading: false,
      }));

      if (session?.user) {
        fetchProfile(session.user.id).then(profile => {
          setState(prev => ({ ...prev, profile }));
        });
      }
    });

    return () => subscription.unsubscribe();
  }, [fetchProfile]);

  // Sign up
  const signUp = useCallback(async ({ email, password, firstName, lastName, jobTitle }: SignUpData) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          first_name: firstName,
          last_name: lastName,
          job_title: jobTitle || 'Team Member',
        },
      },
    });

    if (error) throw error;
    return data;
  }, []);

  // Sign in
  const signIn = useCallback(async ({ email, password }: SignInData) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  }, []);

  // Sign out
  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }, []);

  // Update profile
  const updateProfile = useCallback(async (updates: Partial<Profile>) => {
    if (!state.user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', state.user.id)
      .select()
      .single();

    if (error) throw error;
    
    setState(prev => ({ ...prev, profile: data }));
    return data;
  }, [state.user]);

  return {
    ...state,
    signUp,
    signIn,
    signOut,
    updateProfile,
    refetchProfile: () => state.user && fetchProfile(state.user.id),
  };
}
