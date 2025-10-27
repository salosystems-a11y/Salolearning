
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/components/ui/use-toast';

const DataContext = createContext(undefined);

export const DataProvider = ({ children }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [rankings, setRankings] = useState([]);
  const [quizResults, setQuizResults] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async (tableName, setter) => {
    if (!user) {
        setter([]);
        return;
    };

    try {
      const { data, error } = await supabase.from(tableName).select('*');
      if (error) throw error;
      setter(data);
      return data;
    } catch (error) {
      toast({
        title: `Erro ao carregar ${tableName}`,
        description: error.message,
        variant: 'destructive',
      });
      setter([]);
      return null;
    }
  }, [toast, user]);

  useEffect(() => {
    if (user) {
      setLoading(true);
      Promise.all([
        fetchData('users', setUsers),
        fetchData('courses', setCourses),
        fetchData('quizzes', setQuizzes),
        fetchData('tasks', setTasks),
        fetchData('user_progress', setQuizResults),
        fetchData('subscriptions', setSubscriptions)
      ]).finally(() => {
        setLoading(false);
      });
    } else {
      setLoading(false);
      setUsers([]);
      setCourses([]);
      setQuizzes([]);
      setTasks([]);
      setRankings([]);
      setQuizResults([]);
      setSubscriptions([]);
    }
  }, [user, fetchData]);

  const handleSubscription = useCallback((payload, setter) => {
    const { eventType, new: newRecord, old: oldRecord } = payload;
    
    setter(current => {
      if (eventType === 'INSERT') {
        return [...current, newRecord];
      }
      if (eventType === 'UPDATE') {
        return current.map(item => (item.id === newRecord.id ? newRecord : item));
      }
      if (eventType === 'DELETE') {
        const oldId = oldRecord.id;
        return current.filter(item => item.id !== oldId);
      }
      return current;
    });
  }, []);
  
  useEffect(() => {
    if (!user) return;

    const subscriptionsSetup = [
      { table: 'users', setter: setUsers },
      { table: 'courses', setter: setCourses },
      { table: 'quizzes', setter: setQuizzes },
      { table: 'tasks', setter: setTasks },
      { table: 'user_progress', setter: setQuizResults },
      { table: 'subscriptions', setter: setSubscriptions }
    ];

    const channels = subscriptionsSetup.map(({ table, setter }) => 
      supabase
        .channel(`public:${table}`)
        .on('postgres_changes', { event: '*', schema: 'public', table }, 
            (payload) => handleSubscription(payload, setter)
        )
        .subscribe()
    );

    return () => {
      channels.forEach(channel => supabase.removeChannel(channel));
    };
  }, [user, handleSubscription]);

  useEffect(() => {
    const studentUsers = users.filter(u => u.role === 'student');
    const sortedStudents = [...studentUsers].sort((a, b) => (b.score || 0) - (a.score || 0));
    setRankings(sortedStudents);
  }, [users]);

  const createUser = async (userData) => {
    try {
      const { data, error } = await supabase.functions.invoke('create-user', {
        body: userData,
      });

      if (error) throw error;
      if (data.error) throw new Error(data.error);

      toast({ title: 'Utilizador Criado', description: `${userData.name} foi adicionado com sucesso.` });
      return data.user;
    } catch (error) {
      toast({
        title: 'Erro ao Criar Utilizador',
        description: error.message,
        variant: 'destructive',
      });
      return null;
    }
  };
  
  const createSubscriptionRequest = async (subData) => {
    try {
        const { data, error } = await supabase.from('subscriptions').insert([subData]).select().single();
        if (error) throw error;
        toast({ title: 'Pedido de Subscrição Enviado!', description: 'A nossa equipa entrará em contacto em breve.' });
        return data;
    } catch(error) {
        toast({
            title: 'Erro ao Enviar Pedido',
            description: error.message,
            variant: 'destructive',
        });
        return null;
    }
  };

  const updateUser = async (userId, updates) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ name: updates.name, role: updates.role })
        .eq('id', userId);

      if (error) throw error;
      
      toast({ title: "Utilizador atualizado!", description: `${updates.name} foi atualizado com sucesso.` });
      return true;
    } catch (error) {
      toast({
        title: 'Erro ao Atualizar Utilizador',
        description: error.message,
        variant: 'destructive',
      });
      return false;
    }
  };

  const deleteUser = async (userId) => {
    try {
        const userToDelete = users.find(u => u.id === userId);
        if(!userToDelete) throw new Error("Utilizador não encontrado.");

        const { data, error } = await supabase.functions.invoke('delete-user', {
            body: { auth_id: userToDelete.auth_id },
        });

        if (error) throw error;
        if (data.error) throw new Error(data.error);
        
        return true;
    } catch (error) {
        toast({
            title: 'Erro ao Apagar Utilizador',
            description: error.message,
            variant: 'destructive',
        });
        return false;
    }
  };

  const deleteAllUsers = async () => {
    const adminEmail = 'edsoncanzele@gmail.com';
    const usersToDelete = users.filter(u => u.email !== adminEmail);
    const authIdsToDelete = usersToDelete.map(u => u.auth_id);

    if (authIdsToDelete.length === 0) {
      toast({ title: "Nenhum utilizador para apagar", description: "Não existem outros utilizadores para além do administrador." });
      return;
    }

    let successCount = 0;
    for (const authId of authIdsToDelete) {
      try {
        const { data, error } = await supabase.functions.invoke('delete-user', {
          body: { auth_id: authId },
        });
        if (error) throw error;
        if (data.error) throw new Error(data.error);
        successCount++;
      } catch (error) {
        toast({
          title: 'Erro ao apagar um utilizador',
          description: `Não foi possível apagar o utilizador. Erro: ${error.message}`,
          variant: 'destructive',
        });
      }
    }
    
    if (successCount > 0) {
      toast({
        title: 'Operação Concluída',
        description: `${successCount} de ${authIdsToDelete.length} utilizadores foram apagados com sucesso.`,
      });
    }
  };

  const createCourse = async (courseData) => {
    try {
      const { data, error } = await supabase.from('courses').insert([courseData]).select().single();
      if (error) throw error;
      toast({ title: 'Curso Criado', description: `${courseData.title} foi criado com sucesso.` });
      return data;
    } catch (error) {
      toast({
        title: 'Erro ao Criar Curso',
        description: error.message,
        variant: 'destructive',
      });
      return null;
    }
  };

  const updateCourse = async (courseId, updates) => {
    try {
      const { data, error } = await supabase.from('courses').update(updates).eq('id', courseId).select().single();
      if (error) throw error;
      toast({ title: 'Curso Atualizado', description: 'O curso foi atualizado com sucesso.' });
      return data;
    } catch (error) {
      toast({
        title: 'Erro ao Atualizar Curso',
        description: error.message,
        variant: 'destructive',
      });
      return null;
    }
  };

  const deleteCourse = async (courseId) => {
    try {
      const { error } = await supabase.from('courses').delete().eq('id', courseId);
      if (error) throw error;
      toast({ title: 'Curso Apagado', description: 'O curso foi removido com sucesso.' });
      return true;
    } catch (error) {
      toast({
        title: 'Erro ao Apagar Curso',
        description: error.message,
        variant: 'destructive',
      });
      return false;
    }
  };
  
  const submitQuizResult = async (resultData) => {
    try {
      const { data: progressData, error: progressError } = await supabase
        .from('user_progress')
        .insert([{
          user_id: resultData.userId,
          quiz_id: resultData.quizId,
          score: resultData.score,
          completed_at: new Date().toISOString(),
          correct_answers: resultData.correctAnswers,
          total_questions: resultData.totalQuestions
        }])
        .select()
        .single();
        
      if (progressError) throw progressError;

      const { error: scoreError } = await supabase.rpc('update_user_score', {
        user_id_param: resultData.userId,
        score_increment: resultData.score
      });

      if (scoreError) throw scoreError;

      toast({ title: 'Resultado Enviado!', description: `Você ganhou ${resultData.score} pontos!` });
      return progressData;

    } catch (error) {
      toast({
        title: 'Erro ao Enviar Resultado',
        description: error.message,
        variant: 'destructive',
      });
      return null;
    }
  };


  const value = {
    users,
    courses,
    quizzes,
    tasks,
    rankings,
    quizResults,
    subscriptions,
    loading,
    createUser,
    updateUser,
    deleteUser,
    deleteAllUsers,
    createCourse,
    updateCourse,
    deleteCourse,
    submitQuizResult,
    createSubscriptionRequest,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
