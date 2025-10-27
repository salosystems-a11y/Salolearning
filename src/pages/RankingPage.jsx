import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/SupabaseAuthContext.jsx';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Trophy, Medal, Award } from 'lucide-react';

const RankingPage = () => {
  const navigate = useNavigate();
  const { users, quizResults } = useData();
  const { user, userProfile } = useAuth();
  
  // Filter for student users only for the ranking
  const studentUsers = users.filter(u => u.role === 'student');
  const topRankings = [...studentUsers].sort((a, b) => (b.score || 0) - (a.score || 0)).slice(0, 20);

  const getRankIcon = (position) => {
    switch (position) {
      case 1: return <Trophy className="w-6 h-6 text-yellow-400" />;
      case 2: return <Medal className="w-6 h-6 text-gray-300" />;
      case 3: return <Award className="w-6 h-6 text-amber-600" />;
      default: return <div className="w-6 h-6 flex items-center justify-center text-gray-400 font-bold">{position}</div>;
    }
  };

  const getRankColor = (position) => {
    switch (position) {
      case 1: return 'border-yellow-400 bg-yellow-400/10';
      case 2: return 'border-gray-300 bg-gray-300/10';
      case 3: return 'border-amber-600 bg-amber-600/10';
      default: return 'border-gray-600 bg-gray-600/10';
    }
  };

  // Function to get quiz stats for a user (needed for consistency with admin view)
  const getStudentQuizStats = (userId) => {
    const userResults = quizResults.filter(r => r.userId === userId);
    const totalQuizzes = userResults.length;
    const averageScore = totalQuizzes > 0 
      ? Math.round(userResults.reduce((sum, r) => sum + r.score, 0) / totalQuizzes)
      : 0;
    
    return { totalQuizzes, averageScore };
  };

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="outline"
            onClick={() => navigate(userProfile?.role === 'admin' ? '/admin' : '/student')}
            className="glass-effect border-yellow-400/30"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          
          <h1 className="text-3xl font-bold">🏆 Ranking de Heróis</h1>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {topRankings.length === 0 ? (
            <Card className="glass-effect p-8 text-center border-2 border-yellow-400/30">
              <Trophy className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Nenhum estudante no ranking</h3>
              <p className="text-gray-400">Complete alguns quizzes para aparecer no ranking!</p>
            </Card>
          ) : (
            topRankings.map((rankedUser, index) => {
              const position = index + 1;
              const isCurrentUser = rankedUser.auth_id === user?.id;
              const stats = getStudentQuizStats(rankedUser.id);
              
              return (
                <motion.div
                  key={rankedUser.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className={`glass-effect p-6 border-2 ${getRankColor(position)} ${
                    isCurrentUser ? 'ring-2 ring-yellow-400' : ''
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-800">
                          {getRankIcon(position)}
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <div>
                            <div className="font-semibold text-lg">
                              {rankedUser.name}
                              {isCurrentUser && (
                                <span className="ml-2 text-sm text-yellow-400">(Você)</span>
                              )}
                            </div>
                            <div className="text-sm text-gray-400">
                              {rankedUser.role === 'student' ? `Estudante` : rankedUser.role} desde: {new Date(rankedUser.created_at).toLocaleDateString('pt-BR')}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-2xl font-bold text-yellow-400">
                          {rankedUser.score}
                        </div>
                        <div className="text-sm text-gray-400">pontos</div>
                        <div className="text-xs text-gray-400">
                          {stats.totalQuizzes} quizzes, {stats.averageScore} média
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })
          )}
        </motion.div>

        {userProfile?.role === 'student' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8"
          >
            <Card className="glass-effect p-6 border-2 border-blue-400/30">
              <h3 className="text-lg font-semibold mb-3 flex items-center">
                <span className="text-2xl mr-2">ℹ️</span>
                Sobre o Ranking
              </h3>
              <div className="text-sm text-gray-300 space-y-2">
                <p>• Ganhe pontos completando quizzes e desafios para subir no ranking.</p>
                <p>• O ranking é atualizado em tempo real com a pontuação de todos os consultores.</p>
              </div>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default RankingPage;