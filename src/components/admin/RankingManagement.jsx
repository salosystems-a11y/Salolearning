import React from 'react';
import { motion } from 'framer-motion';
import { useData } from '@/contexts/DataContext';
import { Card } from '@/components/ui/card';
import { Trophy, Medal, Award, TrendingUp, Users, Target } from 'lucide-react';

const RankingManagement = () => {
  const { rankings, users, quizResults } = useData();
  
  const studentRankings = rankings.filter(u => u.role === 'student');

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

  const getStudentStats = (userId) => {
    const userResults = quizResults.filter(r => r.userId === userId);
    const totalQuizzes = userResults.length;
    const averageScore = totalQuizzes > 0 
      ? Math.round(userResults.reduce((sum, r) => sum + r.score, 0) / totalQuizzes)
      : 0;
    
    return { totalQuizzes, averageScore };
  };

  const stats = [
    {
      title: 'Total de Estudantes no Ranking',
      value: studentRankings.length,
      icon: Users,
      color: 'text-blue-400',
      bgColor: 'bg-blue-400/20'
    },
    {
      title: 'Pontuação Máxima',
      value: studentRankings.length > 0 ? studentRankings[0].score : 0,
      icon: Target,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-400/20'
    },
    {
      title: 'Média de Pontos',
      value: studentRankings.length > 0 
        ? Math.round(studentRankings.reduce((sum, r) => sum + r.score, 0) / studentRankings.length)
        : 0,
      icon: TrendingUp,
      color: 'text-green-400',
      bgColor: 'bg-green-400/20'
    }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Gestão de Rankings</h1>
        <p className="text-gray-400">Acompanhe o desempenho e progresso dos estudantes</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="glass-effect p-6 border-2 border-yellow-400/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Rankings Table */}
      <Card className="glass-effect border-2 border-yellow-400/30">
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <Trophy className="w-5 h-5 mr-2" />
            Ranking Completo de Heróis
          </h2>
          
          {studentRankings.length === 0 ? (
            <div className="text-center py-8">
              <div className="hero-symbol mb-4">📊</div>
              <h3 className="text-xl font-semibold mb-2">Nenhum estudante no ranking</h3>
              <p className="text-gray-400">Os estudantes precisam completar quizzes para aparecer no ranking</p>
            </div>
          ) : (
            <div className="space-y-3">
              {studentRankings.map((ranking, index) => {
                const position = index + 1;
                const userData = users.find(u => u.id === ranking.id);
                const stats = getStudentStats(ranking.id);
                
                return (
                  <motion.div
                    key={ranking.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`p-4 rounded-lg border-2 ${getRankColor(position)} transition-all hover:scale-[1.02]`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-800">
                          {getRankIcon(position)}
                        </div>
                        
                        <div className="flex items-center space-x-4">
                          <div className="text-3xl">{'✨'}</div> {/* Placeholder hero symbol, actual symbol not stored */}
                          <div>
                            <div className="font-semibold text-lg">{userData?.name}</div>
                            <div className="text-sm text-gray-400">{userData?.email}</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-8">
                        <div className="text-center">
                          <div className="text-lg font-bold text-yellow-400">
                            {ranking.score}
                          </div>
                          <div className="text-xs text-gray-400">pontos</div>
                        </div>
                        
                        <div className="text-center">
                          <div className="text-lg font-bold text-blue-400">
                            {stats.totalQuizzes}
                          </div>
                          <div className="text-xs text-gray-400">quizzes</div>
                        </div>
                        
                        <div className="text-center">
                          <div className="text-lg font-bold text-green-400">
                            {stats.averageScore}
                          </div>
                          <div className="text-xs text-gray-400">média</div>
                        </div>
                        
                        <div className="text-center">
                          <div className="text-sm text-gray-300">
                            {new Date(userData?.created_at || new Date()).toLocaleDateString('pt-BR')}
                          </div>
                          <div className="text-xs text-gray-400">membro desde</div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </Card>

      {/* Additional Info */}
      <Card className="glass-effect p-6 border-2 border-blue-400/30">
        <h3 className="text-lg font-semibold mb-3 flex items-center">
          <span className="text-2xl mr-2">ℹ️</span>
          Informações do Sistema de Ranking
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
          <div className="space-y-2">
            <p>• Pontos são ganhos através de quizzes e tarefas</p>
            <p>• O ranking é atualizado em tempo real</p>
          </div>
          <div className="space-y-2">
            <p>• Estudantes só veem símbolos anônimos no ranking</p>
            <p>• Apenas administradores veem nomes reais</p>
            <p>• Sistema gamificado motiva o aprendizado</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default RankingManagement;