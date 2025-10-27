import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useData } from '@/contexts/DataContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Plus, BookOpen, Clock, Edit, Trash2, Loader2 } from 'lucide-react';

const CourseManagement = () => {
  const { courses, createCourse, updateCourse, deleteCourse, loading } = useData();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [currentCourse, setCurrentCourse] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  
  const [courseData, setCourseData] = useState({
    title: '',
    description: '',
    lessons: []
  });

  const [lessonData, setLessonData] = useState({
    title: '',
    content: '',
    duration: 30
  });

  const openCreateForm = () => {
    setIsEditing(false);
    setCurrentCourse(null);
    setCourseData({ title: '', description: '', lessons: [] });
    setShowForm(true);
  };

  const openEditForm = (course) => {
    setIsEditing(true);
    setCurrentCourse(course);
    setCourseData({ 
      title: course.title,
      description: course.description,
      lessons: course.lessons || [] 
    });
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setIsEditing(false);
    setCurrentCourse(null);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (courseData.lessons.length === 0) {
      toast({ title: "Erro", description: "Adicione pelo menos uma lição.", variant: "destructive" });
      return;
    }
    setFormLoading(true);

    if (isEditing) {
      await updateCourse(currentCourse.id, courseData);
      toast({ title: "Curso atualizado!", description: `${courseData.title} foi atualizado.` });
    } else {
      await createCourse(courseData);
      toast({ title: "Curso criado!", description: `${courseData.title} foi criado com sucesso.` });
    }
    
    setFormLoading(false);
    closeForm();
  };
  
  const handleDeleteCourse = async (courseId) => {
    await deleteCourse(courseId);
    toast({ title: "Curso apagado!", description: "O curso foi removido com sucesso." });
  };

  const addLesson = () => {
    if (!lessonData.title || !lessonData.content) {
      toast({ title: "Erro", description: "Preencha todos os campos da lição.", variant: "destructive" });
      return;
    }
    setCourseData(prev => ({
      ...prev,
      lessons: [...prev.lessons, { ...lessonData, id: Date.now() }]
    }));
    setLessonData({ title: '', content: '', duration: 30 });
    toast({ title: "Lição adicionada!", description: "A lição foi adicionada ao curso." });
  };

  const removeLesson = (lessonId) => {
    setCourseData(prev => ({
      ...prev,
      lessons: prev.lessons.filter(lesson => lesson.id !== lessonId)
    }));
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Gestão de Cursos</h1>
          <p className="text-gray-400">Crie e gerencie cursos para os estudantes</p>
        </div>
        <Button onClick={openCreateForm} className="angola-gradient">
          <Plus className="w-4 h-4 mr-2" />
          Novo Curso
        </Button>
      </div>

      {showForm && (
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="glass-effect p-6 border-2 border-yellow-400/30">
            <h2 className="text-xl font-bold mb-4">{isEditing ? 'Editar Curso' : 'Criar Novo Curso'}</h2>
            <form onSubmit={handleFormSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Título do Curso</Label>
                  <Input id="title" value={courseData.title} onChange={(e) => setCourseData({...courseData, title: e.target.value})} className="glass-effect border-yellow-400/30" required />
                </div>
              </div>
              <div>
                <Label htmlFor="description">Descrição</Label>
                <textarea id="description" value={courseData.description} onChange={(e) => setCourseData({...courseData, description: e.target.value})} className="w-full h-24 px-3 py-2 glass-effect border border-yellow-400/30 rounded-md text-white resize-none" required />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Lições do Curso</h3>
                <div className="glass-effect p-4 rounded-lg border border-yellow-400/20 mb-4">
                  <h4 className="font-semibold mb-3">Adicionar Nova Lição</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="lessonTitle">Título da Lição</Label>
                      <Input id="lessonTitle" value={lessonData.title} onChange={(e) => setLessonData({...lessonData, title: e.target.value})} className="glass-effect border-yellow-400/30" />
                    </div>
                    <div>
                      <Label htmlFor="lessonDuration">Duração (minutos)</Label>
                      <Input id="lessonDuration" type="number" value={lessonData.duration} onChange={(e) => setLessonData({...lessonData, duration: parseInt(e.target.value)})} className="glass-effect border-yellow-400/30" />
                    </div>
                    <div className="flex items-end">
                      <Button type="button" onClick={addLesson} className="w-full angola-gradient">Adicionar Lição</Button>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Label htmlFor="lessonContent">Conteúdo da Lição</Label>
                    <textarea id="lessonContent" value={lessonData.content} onChange={(e) => setLessonData({...lessonData, content: e.target.value})} className="w-full h-32 px-3 py-2 glass-effect border border-yellow-400/30 rounded-md text-white resize-none" placeholder="Digite o conteúdo da lição..." />
                  </div>
                </div>
                {(courseData.lessons || []).length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-semibold">Lições Adicionadas ({(courseData.lessons || []).length})</h4>
                    {(courseData.lessons || []).map((lesson) => (
                      <div key={lesson.id} className="glass-effect p-4 rounded-lg border border-yellow-400/20">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h5 className="font-semibold">{lesson.title}</h5>
                            <p className="text-sm text-gray-400 mt-1">{lesson.content.substring(0, 100)}...</p>
                            <div className="flex items-center mt-2 text-sm text-gray-300"><Clock className="w-4 h-4 mr-1" />{lesson.duration} minutos</div>
                          </div>
                          <Button type="button" variant="outline" size="sm" onClick={() => removeLesson(lesson.id)} className="ml-4 text-red-400 border-red-400/30 hover:bg-red-400/20"><Trash2 className="w-4 h-4" /></Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex space-x-3 pt-4">
                <Button type="button" variant="outline" onClick={closeForm} className="flex-1 glass-effect border-yellow-400/30">Cancelar</Button>
                <Button type="submit" className="flex-1 angola-gradient" disabled={formLoading || courseData.lessons.length === 0}>
                  {formLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  {isEditing ? 'Atualizar Curso' : 'Criar Curso'}
                </Button>
              </div>
            </form>
          </Card>
        </motion.div>
      )}

      {loading && !showForm && (
        <div className="flex justify-center items-center p-8">
            <Loader2 className="w-8 h-8 animate-spin text-yellow-400"/>
        </div>
      )}

      {!loading && courses.length > 0 && !showForm && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <motion.div key={course.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: courses.indexOf(course) * 0.1 }}>
              <Card className="glass-effect p-6 border-2 border-yellow-400/30 hover:border-yellow-400/50 transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <BookOpen className="w-8 h-8 text-yellow-400" />
                    <div>
                      <h3 className="font-semibold text-lg">{course.title}</h3>
                      <p className="text-sm text-gray-400">{(course.lessons || []).length} lições</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="icon" onClick={() => openEditForm(course)} className="w-8 h-8"><Edit className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteCourse(course.id)} className="w-8 h-8 text-red-400 hover:bg-red-500/10 hover:text-red-400"><Trash2 className="w-4 h-4" /></Button>
                  </div>
                </div>
                <p className="text-gray-300 text-sm mb-4">{course.description}</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm"><span className="text-gray-400">Total de lições:</span><span className="text-yellow-400">{(course.lessons || []).length}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-gray-400">Duração total:</span><span className="text-yellow-400">{(course.lessons || []).reduce((total, lesson) => total + (lesson.duration || 0), 0)} min</span></div>
                  <div className="flex justify-between text-sm"><span className="text-gray-400">Criado em:</span><span className="text-yellow-400">{new Date(course.created_at).toLocaleDateString('pt-BR')}</span></div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {!loading && courses.length === 0 && !showForm && (
        <Card className="glass-effect p-8 text-center border-2 border-yellow-400/30">
          <BookOpen className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Nenhum curso criado</h3>
          <p className="text-gray-400 mb-4">Comece criando seu primeiro curso</p>
          <Button onClick={openCreateForm} className="angola-gradient"><Plus className="w-4 h-4 mr-2" />Criar Primeiro Curso</Button>
        </Card>
      )}
    </div>
  );
};

export default CourseManagement;