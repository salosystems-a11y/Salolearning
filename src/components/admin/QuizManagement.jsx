import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useData } from '@/contexts/DataContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Plus, FileQuestion, Clock, Edit, Trash2 } from 'lucide-react';

const QuizManagement = () => {
  const { quizzes, courses, createQuiz, updateQuiz, deleteQuiz } = useData();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [showForm, setShowForm] = useState(false);
  
  const [quizData, setQuizData] = useState({ title: '', courseId: '', timeLimit: 300, questions: [] });
  const [questionData, setQuestionData] = useState({ question: '', options: ['', '', '', ''], correctAnswer: 0, points: 10 });

  const openCreateForm = () => {
    setIsEditing(false);
    setCurrentQuiz(null);
    setQuizData({ title: '', courseId: '', timeLimit: 300, questions: [] });
    setShowForm(true);
  };

  const openEditForm = (quiz) => {
    setIsEditing(true);
    setCurrentQuiz(quiz);
    setQuizData({ ...quiz });
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setIsEditing(false);
    setCurrentQuiz(null);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (quizData.questions.length === 0) {
      toast({ title: "Erro", description: "Adicione pelo menos uma questão.", variant: "destructive" });
      return;
    }
    if (isEditing) {
      updateQuiz(currentQuiz.id, quizData);
      toast({ title: "Questionário atualizado!", description: `${quizData.title} foi atualizado.` });
    } else {
      createQuiz(quizData);
      toast({ title: "Questionário criado!", description: `${quizData.title} foi criado com sucesso.` });
    }
    closeForm();
  };

  const handleDeleteQuiz = (quizId) => {
    deleteQuiz(quizId);
    toast({ title: "Questionário apagado!", description: "O questionário foi removido." });
  };
  
  const addQuestion = () => {
    if (!questionData.question || questionData.options.some(opt => !opt.trim())) {
      toast({ title: "Erro", description: "Preencha a pergunta e todas as opções.", variant: "destructive" });
      return;
    }
    setQuizData(prev => ({ ...prev, questions: [...prev.questions, { ...questionData, id: Date.now() }] }));
    setQuestionData({ question: '', options: ['', '', '', ''], correctAnswer: 0, points: 10 });
    toast({ title: "Questão adicionada!", description: "A questão foi adicionada." });
  };

  const removeQuestion = (questionId) => {
    setQuizData(prev => ({ ...prev, questions: prev.questions.filter(q => q.id !== questionId) }));
  };

  const updateQuestionOption = (index, value) => {
    setQuestionData(prev => ({ ...prev, options: prev.options.map((opt, i) => i === index ? value : opt) }));
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Gestão de Questionários</h1>
          <p className="text-gray-400">Crie questionários no sistema americano (múltipla escolha)</p>
        </div>
        <Button onClick={openCreateForm} className="angola-gradient">
          <Plus className="w-4 h-4 mr-2" /> Novo Questionário
        </Button>
      </div>

      {showForm && (
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="glass-effect p-6 border-2 border-yellow-400/30">
            <h2 className="text-xl font-bold mb-4">{isEditing ? 'Editar Questionário' : 'Criar Novo Questionário'}</h2>
            <form onSubmit={handleFormSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="title">Título do Questionário</Label>
                  <Input id="title" value={quizData.title} onChange={(e) => setQuizData({ ...quizData, title: e.target.value })} className="glass-effect border-yellow-400/30" required />
                </div>
                <div>
                  <Label htmlFor="courseId">Curso Associado</Label>
                  <select id="courseId" value={quizData.courseId} onChange={(e) => setQuizData({ ...quizData, courseId: parseInt(e.target.value) })} className="w-full h-10 px-3 py-2 glass-effect border border-yellow-400/30 rounded-md text-white" required>
                    <option value="">Selecione um curso</option>
                    {courses.map(course => (<option key={course.id} value={course.id}>{course.title}</option>))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="timeLimit">Tempo Limite (segundos)</Label>
                  <Input id="timeLimit" type="number" value={quizData.timeLimit} onChange={(e) => setQuizData({ ...quizData, timeLimit: parseInt(e.target.value) })} className="glass-effect border-yellow-400/30" required />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Questões do Questionário</h3>
                <div className="glass-effect p-4 rounded-lg border border-yellow-400/20 mb-4">
                  <h4 className="font-semibold mb-3">Adicionar Nova Questão</h4>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="question">Pergunta</Label>
                      <Input id="question" value={questionData.question} onChange={(e) => setQuestionData({ ...questionData, question: e.target.value })} className="glass-effect border-yellow-400/30" placeholder="Digite a pergunta..." />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {questionData.options.map((option, index) => (
                        <div key={index}>
                          <Label htmlFor={`option${index}`}>Opção {String.fromCharCode(65 + index)} {questionData.correctAnswer === index && (<span className="text-green-400 ml-2">(Correta)</span>)}</Label>
                          <div className="flex space-x-2">
                            <Input id={`option${index}`} value={option} onChange={(e) => updateQuestionOption(index, e.target.value)} className="glass-effect border-yellow-400/30" placeholder={`Opção ${String.fromCharCode(65 + index)}`} />
                            <Button type="button" variant={questionData.correctAnswer === index ? "default" : "outline"} onClick={() => setQuestionData({ ...questionData, correctAnswer: index })} className={questionData.correctAnswer === index ? "bg-green-600" : "glass-effect border-yellow-400/30"}>✓</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <Label htmlFor="points">Pontos</Label>
                        <Input id="points" type="number" value={questionData.points} onChange={(e) => setQuestionData({ ...questionData, points: parseInt(e.target.value) })} className="w-24 glass-effect border-yellow-400/30" />
                      </div>
                      <Button type="button" onClick={addQuestion} className="angola-gradient">Adicionar Questão</Button>
                    </div>
                  </div>
                </div>
                {quizData.questions.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-semibold">Questões Adicionadas ({quizData.questions.length})</h4>
                    {quizData.questions.map((question, index) => (
                      <div key={question.id} className="glass-effect p-4 rounded-lg border border-yellow-400/20">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h5 className="font-semibold mb-2">{index + 1}. {question.question}</h5>
                            <div className="grid grid-cols-2 gap-2 text-sm">{question.options.map((option, optIndex) => (<div key={optIndex} className={`p-2 rounded ${question.correctAnswer === optIndex ? 'bg-green-600/20 text-green-400' : 'bg-gray-700/50'}`}>{String.fromCharCode(65 + optIndex)}. {option}</div>))}</div>
                            <div className="mt-2 text-sm text-yellow-400">{question.points} pontos</div>
                          </div>
                          <Button type="button" variant="outline" size="sm" onClick={() => removeQuestion(question.id)} className="ml-4 text-red-400 border-red-400/30 hover:bg-red-400/20"><Trash2 className="w-4 h-4" /></Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex space-x-3 pt-4">
                <Button type="button" variant="outline" onClick={closeForm} className="flex-1 glass-effect border-yellow-400/30">Cancelar</Button>
                <Button type="submit" className="flex-1 angola-gradient" disabled={quizData.questions.length === 0}>{isEditing ? 'Atualizar Questionário' : 'Criar Questionário'}</Button>
              </div>
            </form>
          </Card>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quizzes.map((quiz) => {
          const course = courses.find(c => c.id === quiz.courseId);
          return (
            <motion.div key={quiz.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: quizzes.indexOf(quiz) * 0.1 }}>
              <Card className="glass-effect p-6 border-2 border-yellow-400/30 hover:border-yellow-400/50 transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <FileQuestion className="w-8 h-8 text-yellow-400" />
                    <div>
                      <h3 className="font-semibold text-lg">{quiz.title}</h3>
                      <p className="text-sm text-gray-400">{course?.title || 'Curso não encontrado'}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="icon" onClick={() => openEditForm(quiz)} className="w-8 h-8"><Edit className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteQuiz(quiz.id)} className="w-8 h-8 text-red-400 hover:bg-red-500/10 hover:text-red-400"><Trash2 className="w-4 h-4" /></Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm"><span className="text-gray-400">Questões:</span><span className="text-yellow-400">{quiz.questions.length}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-gray-400">Tempo limite:</span><span className="text-yellow-400 flex items-center"><Clock className="w-3 h-3 mr-1" />{Math.floor(quiz.timeLimit / 60)}:{(quiz.timeLimit % 60).toString().padStart(2, '0')}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-gray-400">Pontos totais:</span><span className="text-yellow-400">{quiz.questions.reduce((total, q) => total + q.points, 0)}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-gray-400">Criado em:</span><span className="text-yellow-400">{new Date(quiz.createdAt).toLocaleDateString('pt-BR')}</span></div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {quizzes.length === 0 && !showForm && (
        <Card className="glass-effect p-8 text-center border-2 border-yellow-400/30">
          <FileQuestion className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Nenhum questionário criado</h3>
          <p className="text-gray-400 mb-4">Comece criando seu primeiro questionário</p>
          <Button onClick={openCreateForm} className="angola-gradient"><Plus className="w-4 h-4 mr-2" />Criar Primeiro Questionário</Button>
        </Card>
      )}
    </div>
  );
};

export default QuizManagement;