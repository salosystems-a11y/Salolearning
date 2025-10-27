import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/SupabaseAuthContext.jsx';
import { useData } from '@/contexts/DataContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { BookOpen, CheckSquare, Trophy, Play, Calendar, Target } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const StudentOverview = () => {
  const { user, userProfile } = useAuth();
  const { courses, tasks, rankings, quizResults } = useData();
  const { toast } = useToast();

  const userTasks = tasks; // All tasks are considered for now
  const studentRankings = rankings.filter(u => u.role === 'student');
  const userRanking = studentRankings.find(u => u.id === userProfile?.id);
  const userPosition = studentRankings.findIndex(r => r.id === userProfile?.id) + 1;

  const userQuizResults = quizResults.filter(r => r.userId === userProfile?.id);

  const stats = [
    {
      title: 'Cursos Disponíveis',
      value: courses.length,
      icon: BookOpen,
      color: 'text-blue-400',
      bgColor: 'bg-blue-400/20',
      link: '/student/courses'
    },
    {
      title: 'Tarefas Ativas',
      value: userTasks.length,
      icon: CheckSquare,
      color: 'text-green-400',
      bgColor: 'bg-green-400/20',
      link: '/student/tasks'
    },
    {
      title: 'Pontos Totais',
      value: userRanking?.score || 0,
      icon: Trophy,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-400/20',
      link: '/ranking'
    },
    {
      title: 'Quizzes Completados',
      value: userQuizResults.length,
      icon: Target,
      color: 'text-purple-400',
      bgColor: 'bg-purple-400/20',
      link: '/student/progress'
    }
  ];

  const recentActivity = [
    { type: 'quiz', message: 'Quiz completado com sucesso', time: '2 horas atrás', points: '+20 pts' },
    { type: 'task', message: 'Nova tarefa atribuída', time: '1 dia atrás', points: '' },
    { type: 'ranking', message: 'Posição no ranking atualizada', time: '2 dias atrás', points: '' }
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            Bem-vindo, {userProfile?.name}! {'✨'}
          </h1>
          <p className="text-gray-400">Continue sua jornada de aprendizado e conquiste novos desafios</p>
        </div>
        
        {userPosition > 0 && (
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-400">#{userPosition}</div>
            <div className="text-sm text-gray-400">Posição no Ranking</div>
          </div>
        )}
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
            <Link to={stat.link}>
              <Card className="glass-effect p-6 border-2 border-yellow-400/30 hover:border-yellow-400/50 transition-all cursor-pointer">
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
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Active Tasks */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="glass-effect p-6 border-2 border-yellow-400/30">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <CheckSquare className="w-5 h-5 mr-2" />
              Tarefas Ativas
            </h3>
            <div className="space-y-4">
              {userTasks.slice(0, 3).map((task) => {
                // Assuming `expiresAt` is available for tasks
                const daysLeft = task.expiresAt ? Math.ceil((new Date(task.expiresAt) - new Date()) / (1000 * 60 * 60 * 24)) : 'N/A';
                return (
                  <div key={task.id} className="task-card p-4 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-semibold">{task.title}</h4>
                        <p className="text-sm text-gray-400 mt-1">{task.description}</p>
                      </div>
                      <div className="text-right ml-4">
                        <div className="text-yellow-400 font-bold">{task.points} pts</div>
                        <div className={`text-xs ${daysLeft <= 1 ? 'text-red-400' : 'text-green-400'}`}>
                          {typeof daysLeft === 'number' ? `${daysLeft} dias restantes` : daysLeft}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              {userTasks.length === 0 && (
                <p className="text-gray-400 text-center py-4">Nenhuma tarefa ativa no momento</p>
              )}
              {userTasks.length > 0 && (
                <Link to="/student/tasks">
                  <Button className="w-full angola-gradient mt-4">
                    Ver Todas as Tarefas
                  </Button>
                </Link>
              )}
            </div>
          </Card>
        </motion.div>

        {/* Available Courses */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="glass-effect p-6 border-2 border-yellow-400/30">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <BookOpen className="w-5 h-5 mr-2" />
              Cursos Disponíveis
            </h3>
            <div className="space-y-4">
              {courses.slice(0, 3).map((course) => (
                <div key={course.id} className="glass-effect p-4 rounded-lg border border-yellow-400/20">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-semibold">{course.title}</h4>
                      <p className="text-sm text-gray-400 mt-1">{course.description}</p>
                      <div className="flex items-center text-sm text-gray-300 mt-2">
                        <Calendar className="w-4 h-4 mr-1" />
                        {(course.lessons || []).length} lições
                      </div>
                    </div>
                    <Link to={`/course/${course.id}`}>
                      <Button size="sm" className="angola-gradient ml-4">
                        <Play className="w-4 h-4 mr-1" />
                        Iniciar
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
              {courses.length === 0 && (
                <p className="text-gray-400 text-center py-4">Nenhum curso disponível</p>
              )}
              {courses.length > 0 && (
                <Link to="/student/courses">
                  <Button className="w-full angola-gradient mt-4">
                    Ver Todos os Cursos
                  </Button>
                </Link>
              )}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card className="glass-effect p-6 border-2 border-yellow-400/30">
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            <Trophy className="w-5 h-5 mr-2" />
            Atividade Recente
          </h3>
          <div className="space-y-4">
            {/* Using mock data for recentActivity as per requirements for now */}
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 glass-effect rounded-lg">
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm">{activity.message}</p>
                  <p className="text-xs text-gray-400">{activity.time}</p>
                </div>
                {activity.points && (
                  <div className="text-sm text-yellow-400 font-semibold">
                    {activity.points}
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default StudentOverview;