
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/SupabaseAuthContext.jsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { LogIn, Loader2, UserPlus } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isCreatingAdmin, setIsCreatingAdmin] = useState(false);
  
  const { signIn, session, userProfile, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    if (!authLoading && session && userProfile) {
      const from = location.state?.from?.pathname || (userProfile.role === 'admin' ? '/admin' : '/student');
      navigate(from, { replace: true });
    }
  }, [session, userProfile, authLoading, navigate, location.state]);

  const handleLogin = async (e) => {
    e.preventDefault();
    await signIn(email, password);
  };

  const handleCreateAdmin = async () => {
    setIsCreatingAdmin(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-user', {
        body: JSON.stringify({
          email: 'edsoncanzele@gmail.com',
          password: 'Angola2025#',
          name: 'Edson Canzele (Admin)',
          role: 'admin',
        }),
      });

      if (error) throw error;

      toast({
        title: "Administrador Criado!",
        description: "A conta de administrador foi criada com sucesso. Por favor, faça o login.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao Criar Admin",
        description: error.message || "Não foi possível criar a conta de administrador.",
      });
    } finally {
      setIsCreatingAdmin(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <Card className="glass-effect p-8 border-2 border-yellow-400/30">
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mb-4 inline-block"
            >
              <img 
                src="https://horizons-cdn.hostinger.com/39c5c6ac-23b8-4cfd-832b-f768f14b3976/e9b6a5897c5586a83ca9aada5238b2d2.png" 
                alt="SaloLearning Logo" 
                className="h-20 w-auto" 
              />
            </motion.div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-angola-red to-angola-yellow bg-clip-text text-transparent">
              SaloLearning
            </h1>
            <p className="text-gray-300 mt-2">
              Plataforma de Ensino Gamificada
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="glass-effect border-yellow-400/30 text-white placeholder-gray-400"
                placeholder="seu@email.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-white">Senha</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="glass-effect border-yellow-400/30 text-white placeholder-gray-400"
                placeholder="••••••••"
                required
              />
            </div>

            <Button
              type="submit"
              disabled={authLoading || isCreatingAdmin}
              className="w-full angola-gradient hover:opacity-90 py-3"
            >
              {authLoading ? (
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              ) : (
                <LogIn className="w-5 h-5 mr-2" />
              )}
              Entrar
            </Button>
          </form>

          <div className="mt-6">
            <Button
              variant="outline"
              onClick={handleCreateAdmin}
              disabled={isCreatingAdmin || authLoading}
              className="w-full bg-transparent border-red-500 text-red-400 hover:bg-red-500/10 hover:text-red-300"
            >
              {isCreatingAdmin ? (
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              ) : (
                <UserPlus className="w-5 h-5 mr-2" />
              )}
              Criar Admin Provisório
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default LoginPage;
