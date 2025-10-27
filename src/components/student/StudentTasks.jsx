import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/SupabaseAuthContext.jsx';
import { useData } from '@/contexts/DataContext';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { CheckSquare, Calendar, Target, Clock, Trophy } from 'lucide-react';

const StudentTasks = () => {
  const { user } = useAuth();
  const { getUserTasks, completeTask } = useData();
  const { toast } = useToast();
  const [taskToComplete, setTaskToComplete] = useState(null);
  
  const userTasks = getUserTasks(user.id);

  const getTaskStatus = (task) => {
    const now = new Date();
    const expiresAt = new Date(task.expiresAt);
    const daysLeft = Math.ceil((expiresAt - now) / (1000 * 60 * 60 * 24));
    
    if (task.completed) return { status: 'completed', text: 'Concluída', color: 'text-blue-400', bgColor: 'bg-blue-400/20' };
    if (daysLeft < 0) return { status: 'expired', text: 'Expirada', color: 'text-red-400', bgColor: 'bg-red-400/20' };
    if (daysLeft <= 1) return { status: 'urgent', text: `${daysLeft} dia restante`, color: 'text-orange-400', bgColor: 'bg-orange-400/20' };
    return { status: 'active', text: `${daysLeft} dias restantes`, color: 'text-green-400', bgColor: 'bg-green-400/20' };
  };

  const handleCompleteTask = (task) => {
    completeTask(task.id, user.id);
    toast({
      title: "Tarefa concluída! 🎉",
      description: `Você ganhou ${task.points} pontos!`,
    });
    setTaskToComplete(null);
  };

  const activeTasks = userTasks.filter(task => !task.completed && new Date(task.expiresAt) > new Date());
  const completedOrExpiredTasks = userTasks.filter(task => task.completed || new Date(task.expiresAt) <= new Date());
  
  return (
    <>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Minhas Tarefas</h1>
          <p className="text-gray-400">Complete suas tarefas de 7 dias e ganhe pontos no ranking</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="glass-effect p-6 border-2 border-green-400/30">
            <div className="flex items-center justify-between">
              <div><p className="text-sm text-gray-400 mb-1">Tarefas Ativas</p><p className="text-3xl font-bold text-green-400">{activeTasks.length}</p></div>
              <CheckSquare className="w-8 h-8 text-green-400" />
            </div>
          </Card>
          <Card className="glass-effect p-6 border-2 border-blue-400/30">
            <div className="flex items-center justify-between">
              <div><p className="text-sm text-gray-400 mb-1">Tarefas Concluídas</p><p className="text-3xl font-bold text-blue-400">{userTasks.filter(t => t.completed).length}</p></div>
              <Trophy className="w-8 h-8 text-blue-400" />
            </div>
          </Card>
          <Card className="glass-effect p-6 border-2 border-yellow-400/30">
            <div className="flex items-center justify-between">
              <div><p className="text-sm text-gray-400 mb-1">Pontos Disponíveis</p><p className="text-3xl font-bold text-yellow-400">{activeTasks.reduce((total, task) => total + task.points, 0)}</p></div>
              <Target className="w-8 h-8 text-yellow-400" />
            </div>
          </Card>
        </div>

        {activeTasks.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-4 flex items-center"><CheckSquare className="w-6 h-6 mr-2 text-green-400" />Tarefas Ativas</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeTasks.map((task, index) => {
                const taskStatus = getTaskStatus(task);
                return (
                  <motion.div key={task.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
                    <Card className="glass-effect p-6 border-2 border-yellow-400/30 hover:border-yellow-400/50 transition-all h-full flex flex-col">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center space-x-3">
                          <Target className="w-8 h-8 text-yellow-400" />
                          <div><h3 className="font-semibold text-lg">{task.title}</h3><div className={`text-sm px-2 py-1 rounded ${taskStatus.bgColor} ${taskStatus.color}`}>{taskStatus.text}</div></div>
                        </div>
                        <div className="text-right"><div className="text-xl font-bold text-yellow-400">{task.points}</div><div className="text-xs text-gray-400">pontos</div></div>
                      </div>
                      <p className="text-gray-300 text-sm mb-6 flex-1">{task.description}</p>
                      <div className="space-y-3 mb-6">
                        <div className="flex justify-between text-sm"><span className="text-gray-400 flex items-center"><Calendar className="w-4 h-4 mr-1" />Criada em:</span><span className="text-yellow-400">{new Date(task.createdAt).toLocaleDateString('pt-BR')}</span></div>
                        <div className="flex justify-between text-sm"><span className="text-gray-400 flex items-center"><Clock className="w-4 h-4 mr-1" />Expira em:</span><span className="text-yellow-400">{new Date(task.expiresAt).toLocaleDateString('pt-BR')}</span></div>
                      </div>
                      <Button onClick={() => setTaskToComplete(task)} className="w-full angola-gradient mt-auto">Marcar como Concluída</Button>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {completedOrExpiredTasks.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-4 flex items-center"><Clock className="w-6 h-6 mr-2 text-gray-400" />Histórico de Tarefas</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {completedOrExpiredTasks.map((task, index) => {
                 const taskStatus = getTaskStatus(task);
                 return (
                    <motion.div key={task.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
                      <Card className={`glass-effect p-6 border-2 opacity-75 ${taskStatus.status === 'completed' ? 'border-blue-400/30' : 'border-red-400/30'}`}>
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center space-x-3">
                            <Target className={`w-8 h-8 ${taskStatus.status === 'completed' ? 'text-blue-400' : 'text-red-400'}`} />
                            <div>
                              <h3 className="font-semibold text-lg">{task.title}</h3>
                              <div className={`text-sm px-2 py-1 rounded ${taskStatus.bgColor} ${taskStatus.color}`}>{taskStatus.text}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={`text-xl font-bold ${taskStatus.status === 'completed' ? 'text-blue-400' : 'text-gray-500'}`}>{task.points}</div>
                            <div className="text-xs text-gray-400">{taskStatus.status === 'completed' ? 'pontos ganhos' : 'pontos perdidos'}</div>
                          </div>
                        </div>
                        <p className="text-gray-400 text-sm">{task.description}</p>
                      </Card>
                    </motion.div>
                 );
              })}
            </div>
          </div>
        )}

        {userTasks.length === 0 && (
          <Card className="glass-effect p-8 text-center border-2 border-yellow-400/30">
            <CheckSquare className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Nenhuma tarefa atribuída</h3>
            <p className="text-gray-400">Aguarde novas tarefas serem criadas pelos administradores</p>
          </Card>
        )}
      </div>

      <Dialog open={!!taskToComplete} onOpenChange={() => setTaskToComplete(null)}>
        <DialogContent className="glass-effect border-yellow-400/30">
          <DialogHeader>
            <DialogTitle>Confirmar Conclusão da Tarefa</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja marcar a tarefa "{taskToComplete?.title}" como concluída? Você ganhará {taskToComplete?.points} pontos. Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild><Button variant="outline" className="glass-effect border-yellow-400/30">Cancelar</Button></DialogClose>
            <Button onClick={() => handleCompleteTask(taskToComplete)} className="angola-gradient">Confirmar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default StudentTasks;