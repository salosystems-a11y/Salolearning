
import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const { toast } = useToast();

  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = useCallback(async (currentUser) => {
    if (!currentUser) {
      setUserProfile(null);
      return;
    }
    
    try {
      const { data: profile, error } = await supabase
        .from('users')
        .select('*')
        .eq('auth_id', currentUser.id)
        .single();
      
      // PGRST116 means no rows found, which is a valid state if the profile hasn't been created yet.
      // We should not treat it as a fatal error.
      if (error && error.code !== 'PGRST116') {
        throw error;
      }
      
      setUserProfile(profile || null);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao carregar perfil do utilizador",
        description: error.message,
      });
      setUserProfile(null);
    }
  }, [toast]);


  const handleSession = useCallback(async (currentSession) => {
    setSession(currentSession);
    const currentUser = currentSession?.user ?? null;
    setUser(currentUser);
    await fetchUserProfile(currentUser);
    setLoading(false);
  }, [fetchUserProfile]);

  useEffect(() => {
    setLoading(true);
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      handleSession(session);
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        // Manually re-fetch profile on sign in to ensure data is fresh
        if (event === "SIGNED_IN") {
            setLoading(true);
            await handleSession(session);
            setLoading(false);
        } else {
            await handleSession(session);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [handleSession]);

  const signUp = async (email, password, options) => {
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({ email, password, options });
    if (error) {
      toast({
        variant: "destructive",
        title: "Registo Falhou",
        description: error.message,
      });
    }
    setLoading(false);
    return { data, error };
  };

  const signIn = async (email, password) => {
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      toast({
        variant: "destructive",
        title: "Login Falhou",
        description: error.message,
      });
    }
    setLoading(false);
    return { data, error };
  };

  const signOut = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        variant: "destructive",
        title: "Logout Falhou",
        description: error.message,
      });
    }
    setLoading(false);
    return { error };
  };

  const value = useMemo(() => ({
    user,
    session,
    userProfile,
    loading,
    signUp,
    signIn,
    signOut,
  }), [user, session, userProfile, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
