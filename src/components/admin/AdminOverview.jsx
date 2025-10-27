import React from 'react';
import { motion } from 'framer-motion';
import { useData } from '@/contexts/DataContext';
import { Card } from '@/components/ui/card';
import { Users, BookOpen, FileQuestion, Trophy, TrendingUp, Calendar, Loader2 } from 'lucide-react';

const AdminOverview = () => {
  const { users, courses, quizzes, rankings, tasks, loading } = useData();

  const stats = [
    {
      title: 'Total de Utilizadores',
      value: users.filter(u => u.role === 'student').length,
      icon: Users,
      color: 'text-blue-400',
      bgColor: 'bg-blue-400/20'
    },
    {
      title: 'Cursos Ativos',
      value: courses.length,
      icon: BookOpen,
      color: 'text-green-400',
      bgColor: 'bg-green-400/20'
    },
    {
      title: 'Questionários',
      value: quizzes.length,
      icon: FileQuestion,
      color: 'text-purple-400',
      bgColor: 'bg-purple-400/20'
    },
    {
      title: 'Participantes no Ranking',
      value: rankings.length,
      icon: Trophy,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-400/20'
    }
  ];

  const recentActivity = [
    { type: 'user', message: 'Novo utilizador registado', time: '2 horas atrás' },
    { type: 'quiz', message: 'Quiz completado por estudante', time: '4 horas atrás' },
    { type: 'course', message: 'Novo curso criado', time: '1 dia atrás' },
    { type: 'ranking', message: 'Ranking atualizado', time: '2 dias atrás' }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-12 h-12 animate-spin text-yellow-400" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Visão Geral</h1>
        <p className="text-gray-400">Acompanhe o desempenho da sua plataforma</p>
      </div>

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
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="glass-effect p-6 border-2 border-yellow-400/30">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              Atividade Recente
            </h3>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 glass-effect rounded-lg">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm">{activity.message}</p>
                    <p className="text-xs text-gray-400">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="glass-effect p-6 border-2 border-yellow-400/30">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Tarefas Ativas
            </h3>
            <div className="space-y-4">
              {tasks.slice(0, 4).map((task) => (
                <div key={task.id} className="task-card p-4 rounded-lg">
                  <h4 className="font-semibold">{task.title}</h4>
                  <p className="text-sm text-gray-400 mt-1">{task.description}</p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-yellow-400">
                      Expira: {new Date(task.expiresAt).toLocaleDateString('pt-BR')}
                    </span>
                    <span className="text-xs bg-yellow-400/20 px-2 py-1 rounded">
                      {task.points} pts
                    </span>
                  </div>
                </div>
              ))}
              {tasks.length === 0 && (
                <p className="text-gray-400 text-center py-4">Nenhuma tarefa ativa</p>
              )}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminOverview;