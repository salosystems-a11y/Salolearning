import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useData } from '@/contexts/DataContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Plus, CheckSquare, Calendar, Users, Target, Edit, Trash2 } from 'lucide-react';

const TaskManagement = () => {
  const { tasks, users, createTask, updateTask, deleteTask } = useData();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [showForm, setShowForm] = useState(false);
  
  const [taskData, setTaskData] = useState({ title: '', description: '', points: 50, assignedTo: [] });

  const students = users.filter(user => user.role === 'student');

  const openCreateForm = () => {
    setIsEditing(false);
    setCurrentTask(null);
    setTaskData({ title: '', description: '', points: 50, assignedTo: [] });
    setShowForm(true);
  };

  const openEditForm = (task) => {
    setIsEditing(true);
    setCurrentTask(task);
    setTaskData({ ...task });
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setIsEditing(false);
    setCurrentTask(null);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (taskData.assignedTo.length === 0) {
      toast({ title: "Erro", description: "Selecione pelo menos um estudante.", variant: "destructive" });
      return;
    }

    if (isEditing) {
      updateTask(currentTask.id, taskData);
      toast({ title: "Tarefa atualizada!", description: `${taskData.title} foi atualizada.` });
    } else {
      createTask(taskData);
      toast({ title: "Tarefa criada!", description: `${taskData.title} foi criada com sucesso.` });
    }
    
    closeForm();
  };
  
  const handleDeleteTask = (taskId) => {
    deleteTask(taskId);
    toast({ title: "Tarefa apagada!", description: "A tarefa foi removida com sucesso." });
  };

  const toggleStudentAssignment = (studentId) => {
    setTaskData(prev => ({
      ...prev,
      assignedTo: prev.assignedTo.includes(studentId)
        ? prev.assignedTo.filter(id => id !== studentId)
        : [...prev.assignedTo, studentId]
    }));
  };

  const selectAllStudents = () => setTaskData(prev => ({ ...prev, assignedTo: students.map(s => s.id) }));
  const clearAllStudents = () => setTaskData(prev => ({ ...prev, assignedTo: [] }));

  const getTaskStatus = (task) => {
    const daysLeft = Math.ceil((new Date(task.expiresAt) - new Date()) / (1000 * 60 * 60 * 24));
    if (daysLeft < 0) return { text: 'Expirada', color: 'text-red-400' };
    if (daysLeft <= 1) return { text: `${daysLeft} dia restante`, color: 'text-orange-400' };
    return { text: `${daysLeft} dias restantes`, color: 'text-green-400' };
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Gestão de Tarefas</h1>
          <p className="text-gray-400">Crie tarefas de 7 dias para os consultores</p>
        </div>
        <Button onClick={openCreateForm} className="angola-gradient">
          <Plus className="w-4 h-4 mr-2" /> Nova Tarefa
        </Button>
      </div>

      {showForm && (
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="glass-effect p-6 border-2 border-yellow-400/30">
            <h2 className="text-xl font-bold mb-4">{isEditing ? 'Editar Tarefa' : 'Criar Nova Tarefa'}</h2>
            <form onSubmit={handleFormSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Título da Tarefa</Label>
                  <Input id="title" value={taskData.title} onChange={(e) => setTaskData({...taskData, title: e.target.value})} className="glass-effect border-yellow-400/30" required />
                </div>
                <div>
                  <Label htmlFor="points">Pontos de Recompensa</Label>
                  <Input id="points" type="number" value={taskData.points} onChange={(e) => setTaskData({...taskData, points: parseInt(e.target.value)})} className="glass-effect border-yellow-400/30" required />
                </div>
              </div>
              <div>
                <Label htmlFor="description">Descrição da Tarefa</Label>
                <textarea id="description" value={taskData.description} onChange={(e) => setTaskData({...taskData, description: e.target.value})} className="w-full h-24 px-3 py-2 glass-effect border border-yellow-400/30 rounded-md text-white resize-none" required />
              </div>
              <div>
                <div className="flex justify-between items-center mb-4">
                  <Label>Atribuir a Estudantes</Label>
                  <div className="space-x-2">
                    <Button type="button" variant="outline" size="sm" onClick={selectAllStudents} className="glass-effect border-yellow-400/30">Selecionar Todos</Button>
                    <Button type="button" variant="outline" size="sm" onClick={clearAllStudents} className="glass-effect border-yellow-400/30">Limpar Seleção</Button>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-60 overflow-y-auto">
                  {students.map(student => (
                    <div key={student.id} onClick={() => toggleStudentAssignment(student.id)} className={`p-3 rounded-lg border cursor-pointer transition-all ${taskData.assignedTo.includes(student.id) ? 'border-yellow-400 bg-yellow-400/20' : 'border-gray-600 bg-gray-700/50 hover:border-yellow-400/50'}`}>
                      <div className="flex items-center space-x-3">
                        <div className="text-xl">{student.heroSymbol}</div>
                        <div className="flex-1"><p className="font-semibold text-sm">{student.name}</p><p className="text-xs text-gray-400">{student.email}</p></div>
                        {taskData.assignedTo.includes(student.id) && <div className="w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center"><span className="text-black text-xs">✓</span></div>}
                      </div>
                    </div>
                  ))}
                </div>
                {students.length === 0 && <p className="text-gray-400 text-center py-4">Nenhum estudante encontrado.</p>}
                <p className="text-sm text-gray-400 mt-2">{taskData.assignedTo.length} de {students.length} estudantes selecionados</p>
              </div>
              <div className="flex space-x-3 pt-4">
                <Button type="button" variant="outline" onClick={closeForm} className="flex-1 glass-effect border-yellow-400/30">Cancelar</Button>
                <Button type="submit" className="flex-1 angola-gradient" disabled={taskData.assignedTo.length === 0}>{isEditing ? 'Atualizar Tarefa' : 'Criar Tarefa'}</Button>
              </div>
            </form>
          </Card>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tasks.map((task) => {
          const taskStatus = getTaskStatus(task);
          const assignedStudents = students.filter(s => task.assignedTo.includes(s.id));
          return (
            <motion.div key={task.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: tasks.indexOf(task) * 0.1 }}>
              <Card className="glass-effect p-6 border-2 border-yellow-400/30 hover:border-yellow-400/50 transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <CheckSquare className="w-8 h-8 text-yellow-400" />
                    <div>
                      <h3 className="font-semibold text-lg">{task.title}</h3>
                      <p className={`text-sm ${taskStatus.color}`}>{taskStatus.text}</p>
                    </div>
                  </div>
                   <div className="flex space-x-2">
                    <Button variant="ghost" size="icon" onClick={() => openEditForm(task)} className="w-8 h-8"><Edit className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteTask(task.id)} className="w-8 h-8 text-red-400 hover:bg-red-500/10 hover:text-red-400"><Trash2 className="w-4 h-4" /></Button>
                  </div>
                </div>
                <p className="text-gray-300 text-sm mb-4">{task.description}</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm"><span className="text-gray-400 flex items-center"><Users className="w-4 h-4 mr-1" />Atribuída a:</span><span className="text-yellow-400">{assignedStudents.length} estudantes</span></div>
                  <div className="flex justify-between text-sm"><span className="text-gray-400 flex items-center"><Calendar className="w-4 h-4 mr-1" />Criada em:</span><span className="text-yellow-400">{new Date(task.createdAt).toLocaleDateString('pt-BR')}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-gray-400 flex items-center"><Target className="w-4 h-4 mr-1" />Expira em:</span><span className="text-yellow-400">{new Date(task.expiresAt).toLocaleDateString('pt-BR')}</span></div>
                </div>
                {assignedStudents.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-600">
                    <p className="text-xs text-gray-400 mb-2">Estudantes atribuídos:</p>
                    <div className="flex flex-wrap gap-1">
                      {assignedStudents.slice(0, 5).map(student => <span key={student.id} className="text-lg" title={student.name}>{student.heroSymbol}</span>)}
                      {assignedStudents.length > 5 && <span className="text-xs text-gray-400 bg-gray-700 px-2 py-1 rounded">+{assignedStudents.length - 5}</span>}
                    </div>
                  </div>
                )}
              </Card>
            </motion.div>
          );
        })}
      </div>

      {tasks.length === 0 && !showForm && (
        <Card className="glass-effect p-8 text-center border-2 border-yellow-400/30">
          <CheckSquare className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Nenhuma tarefa criada</h3>
          <p className="text-gray-400 mb-4">Comece criando sua primeira tarefa de 7 dias</p>
          <Button onClick={openCreateForm} className="angola-gradient"><Plus className="w-4 h-4 mr-2" />Criar Primeira Tarefa</Button>
        </Card>
      )}
    </div>
  );
};

export default TaskManagement;