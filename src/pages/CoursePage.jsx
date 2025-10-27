import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/SupabaseAuthContext.jsx';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { ArrowLeft, Play, Clock, BookOpen } from 'lucide-react';

const CoursePage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { courses, users } = useData();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [course, setCourse] = useState(null);
  const [currentLesson, setCurrentLesson] = useState(0);
  
  const currentUserData = users.find(u => u.auth_id === user?.id);

  useEffect(() => {
    const foundCourse = courses.find(c => c.id === courseId);
    if (foundCourse) {
      setCourse(foundCourse);
    }
  }, [courseId, courses]);

  const handleStartLesson = (lessonIndex) => {
    setCurrentLesson(lessonIndex);
    toast({
      title: "Lição iniciada!",
      description: `Você está estudando: ${course.lessons[lessonIndex].title}`,
    });
  };

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <p className="text-xl mt-4">Curso não encontrado</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="outline"
            onClick={() => navigate(currentUserData?.role === 'admin' ? '/admin/courses' : '/student/courses')}
            className="glass-effect border-yellow-400/30"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Lista de Lições */}
          <div className="lg:col-span-1">
            <Card className="glass-effect p-6 border-2 border-yellow-400/30">
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <BookOpen className="w-5 h-5 mr-2" />
                Lições do Curso
              </h2>
              
              <div className="space-y-3">
                {course.lessons.map((lesson, index) => (
                  <motion.button
                    key={lesson.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleStartLesson(index)}
                    className={`w-full p-4 text-left rounded-lg transition-all ${
                      currentLesson === index 
                        ? 'bg-yellow-400/20 border-2 border-yellow-400' 
                        : 'glass-effect border border-gray-600 hover:border-yellow-400/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">{lesson.title}</h3>
                        <div className="flex items-center text-sm text-gray-400 mt-1">
                          <Clock className="w-4 h-4 mr-1" />
                          {lesson.duration} min
                        </div>
                      </div>
                      <Play className="w-5 h-5 text-yellow-400" />
                    </div>
                  </motion.button>
                ))}
              </div>
            </Card>
          </div>

          {/* Conteúdo da Lição */}
          <div className="lg:col-span-2">
            <motion.div
              key={currentLesson}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="glass-effect p-8 border-2 border-yellow-400/30">
                <div className="mb-6">
                  <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
                  <p className="text-gray-300">{course.description}</p>
                </div>

                {course.lessons[currentLesson] && (
                  <div>
                    <h2 className="text-2xl font-bold mb-4 flex items-center">
                      <span className="text-yellow-400 mr-2">📖</span>
                      {course.lessons[currentLesson].title}
                    </h2>
                    
                    <div className="prose prose-invert max-w-none">
                      <div className="text-gray-300 leading-relaxed whitespace-pre-line">
                        {course.lessons[currentLesson].content}
                      </div>
                    </div>

                    <div className="mt-8 p-6 glass-effect rounded-lg border border-yellow-400/30">
                      <h3 className="text-lg font-semibold mb-3 flex items-center">
                        <span className="text-2xl mr-2">💡</span>
                        Dica de Estudo
                      </h3>
                      <p className="text-gray-300">
                        Faça anotações importantes e pratique os conceitos apresentados. 
                        Lembre-se de que o aprendizado é um processo contínuo!
                      </p>
                    </div>

                    <div className="flex justify-between mt-8">
                      <Button
                        variant="outline"
                        onClick={() => setCurrentLesson(Math.max(0, currentLesson - 1))}
                        disabled={currentLesson === 0}
                        className="glass-effect border-yellow-400/30"
                      >
                        Lição Anterior
                      </Button>
                      
                      <Button
                        onClick={() => setCurrentLesson(Math.min(course.lessons.length - 1, currentLesson + 1))}
                        disabled={currentLesson === course.lessons.length - 1}
                        className="angola-gradient"
                      >
                        Próxima Lição
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursePage;