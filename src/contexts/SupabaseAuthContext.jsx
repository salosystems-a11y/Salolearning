
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
      return null;
    }
    
    try {
      const { data: profile, error } = await supabase
        .from('users')
        .select('*')
        .eq('auth_id', currentUser.id)
        .single();
      
      // PGRST116 means no rows found, which is a valid state if the profile isn't created yet.
      // We should not treat it as a fatal error.
      if (error && error.code !== 'PGRST116') {
        throw error;
      }
      
      setUserProfile(profile || null);
      return profile || null;

    } catch (error) {
      console.error("Erro ao carregar perfil do utilizador:", error);
      // Avoid toasting for non-fatal errors like network issues during initial load
      if (error.code !== 'PGRST116') {
          toast({
            variant: "destructive",
            title: "Erro de Rede",
            description: "Não foi possível carregar o perfil do utilizador. Verifique a sua conexão.",
          });
      }
      setUserProfile(null);
      return null;
    }
  }, [toast]);


  const onAuthStateChange = useCallback(async (event, currentSession) => {
    setLoading(true);
    setSession(currentSession);
    const currentUser = currentSession?.user ?? null;
    setUser(currentUser);
    await fetchUserProfile(currentUser);
    setLoading(false);
  }, [fetchUserProfile]);


  useEffect(() => {
    setLoading(true);
    const getInitialSession = async () => {
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        setSession(initialSession);
        const initialUser = initialSession?.user ?? null;
        setUser(initialUser);
        await fetchUserProfile(initialUser);
        setLoading(false);
    };

    getInitialSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(onAuthStateChange);

    return () => subscription.unsubscribe();
  }, [onAuthStateChange]);

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
    // After sign out, states are cleared by onAuthStateChange
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
