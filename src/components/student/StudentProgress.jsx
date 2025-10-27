import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/SupabaseAuthContext.jsx';
import { useData } from '@/contexts/DataContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { TrendingUp, Trophy, Target, FileQuestion, Award, BarChart3 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const StudentProgress = () => {
  const { userProfile } = useAuth();
  const { quizResults, rankings, quizzes } = useData();
  const { toast } = useToast();
  
  const userQuizResults = quizResults.filter(r => r.userId === userProfile?.id);
  const studentRankings = rankings.filter(u => u.role === 'student');
  const userRanking = studentRankings.find(u => u.id === userProfile?.id);
  const userPosition = studentRankings.findIndex(r => r.id === userProfile?.id) + 1;

  const totalQuizzes = userQuizResults.length;
  const totalPoints = userRanking?.score || 0;
  const averageScore = totalQuizzes > 0 
    ? Math.round(userQuizResults.reduce((sum, r) => sum + r.score, 0) / totalQuizzes)
    : 0;
  const correctAnswers = userQuizResults.reduce((sum, r) => sum + r.correctAnswers, 0);
  const totalQuestions = userQuizResults.reduce((sum, r) => sum + r.totalQuestions, 0);
  const accuracyRate = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;

  const stats = [
    {
      title: 'Posição no Ranking',
      value: userPosition > 0 ? `#${userPosition}` : 'N/A',
      icon: Trophy,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-400/20'
    },
    {
      title: 'Pontos Totais',
      value: totalPoints,
      icon: Target,
      color: 'text-green-400',
      bgColor: 'bg-green-400/20'
    },
    {
      title: 'Quizzes Completados',
      value: totalQuizzes,
      icon: FileQuestion,
      color: 'text-blue-400',
      bgColor: 'bg-blue-400/20'
    },
    {
      title: 'Taxa de Acerto',
      value: `${accuracyRate}%`,
      icon: BarChart3,
      color: 'text-purple-400',
      bgColor: 'bg-purple-400/20'
    }
  ];

  const getPerformanceLevel = (accuracy) => {
    if (accuracy >= 90) return { level: 'Excelente', color: 'text-green-400', icon: '🏆' };
    if (accuracy >= 80) return { level: 'Muito Bom', color: 'text-blue-400', icon: '🥇' };
    if (accuracy >= 70) return { level: 'Bom', color: 'text-yellow-400', icon: '🥈' };
    if (accuracy >= 60) return { level: 'Regular', color: 'text-orange-400', icon: '🥉' };
    return { level: 'Precisa Melhorar', color: 'text-red-400', icon: '📚' };
  };

  const performance = getPerformanceLevel(accuracyRate);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Meu Progresso</h1>
        <p className="text-gray-400">Acompanhe seu desempenho e evolução na plataforma</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Performance Overview */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="glass-effect p-6 border-2 border-yellow-400/30">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <Award className="w-5 h-5 mr-2" />
              Desempenho Geral
            </h3>
            
            <div className="text-center mb-6">
              <div className="text-6xl mb-2">{performance.icon}</div>
              <div className={`text-2xl font-bold ${performance.color}`}>
                {performance.level}
              </div>
              <div className="text-gray-400 text-sm">
                Baseado na sua taxa de acerto de {accuracyRate}%
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-400">Respostas Corretas:</span>
                <span className="text-green-400 font-semibold">{correctAnswers}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Total de Questões:</span>
                <span className="text-blue-400 font-semibold">{totalQuestions}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Pontuação Média:</span>
                <span className="text-yellow-400 font-semibold">{averageScore} pts</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">Taxa de Acerto</span>
                <span className="text-yellow-400">{accuracyRate}%</span>
              </div>
              <div className="progress-bar h-3">
                <div 
                  className="h-full transition-all duration-1000 ease-out"
                  style={{ width: `${accuracyRate}%` }}
                />
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Recent Quiz Results */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="glass-effect p-6 border-2 border-yellow-400/30">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              Resultados Recentes
            </h3>
            
            <div className="space-y-4 max-h-80 overflow-y-auto">
              {userQuizResults.slice(-5).reverse().map((result, index) => {
                const quiz = quizzes.find(q => q.id === result.quizId);
                const accuracy = Math.round((result.correctAnswers / result.totalQuestions) * 100);
                
                return (
                  <div key={result.id} className="glass-effect p-4 rounded-lg border border-yellow-400/20">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm">{quiz?.title || 'Quiz Desconhecido'}</h4>
                        <div className="text-xs text-gray-400">
                          {new Date(result.completedAt).toLocaleDateString('pt-BR')}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-yellow-400">{result.score} pts</div>
                        <div className="text-xs text-gray-400">{accuracy}% acerto</div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">
                        {result.correctAnswers}/{result.totalQuestions} corretas
                      </span>
                      <span className={`font-semibold ${
                        accuracy >= 80 ? 'text-green-400' : 
                        accuracy >= 60 ? 'text-yellow-400' : 'text-red-400'
                      }`}>
                        {accuracy >= 80 ? 'Excelente' : accuracy >= 60 ? 'Bom' : 'Pode Melhorar'}
                      </span>
                    </div>
                  </div>
                );
              })}
              
              {userQuizResults.length === 0 && (
                <div className="text-center py-8">
                  <FileQuestion className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-400">Nenhum quiz completado ainda</p>
                  <Link to="/student/courses">
                    <Button className="mt-4 angola-gradient">
                      Fazer Primeiro Quiz
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Ranking Position */}
      {userProfile && userPosition > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="glass-effect p-6 border-2 border-yellow-400/30">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <Trophy className="w-5 h-5 mr-2" />
              Sua Posição no Ranking
            </h3>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="text-4xl">{'✨'}</div> {/* Placeholder hero symbol */}
                <div>
                  <div className="text-2xl font-bold text-yellow-400">#{userPosition}</div>
                  <div className="text-gray-400">de {studentRankings.length} participantes</div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-3xl font-bold text-yellow-400">{totalPoints}</div>
                <div className="text-gray-400">pontos totais</div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-center">
              <Link to="/ranking">
                <Button className="angola-gradient">
                  Ver Ranking Completo
                </Button>
              </Link>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Motivational Message */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <Card className="glass-effect p-6 border-2 border-blue-400/30">
          <h3 className="text-lg font-semibold mb-3 flex items-center">
            <span className="text-2xl mr-2">💪</span>
            Continue Evoluindo!
          </h3>
          <div className="text-sm text-gray-300 space-y-2">
            <p>• Complete mais quizzes para ganhar pontos e subir no ranking</p>
            <p>• Mantenha uma taxa de acerto alta para melhorar seu desempenho</p>
            <p>• Participe das tarefas semanais para ganhar pontos extras</p>
            <p>• Estude os cursos disponíveis para aprimorar seus conhecimentos</p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default StudentProgress;