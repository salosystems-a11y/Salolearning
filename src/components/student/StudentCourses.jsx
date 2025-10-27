import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useData } from '@/contexts/DataContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { BookOpen, Play, Clock, Calendar, FileQuestion } from 'lucide-react';

const StudentCourses = () => {
  const { courses, quizzes } = useData();

  const getCourseQuizzes = (courseId) => {
    return quizzes.filter(quiz => quiz.courseId === courseId);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Cursos Disponíveis</h1>
        <p className="text-gray-400">Explore os cursos e desenvolva suas habilidades comerciais</p>
      </div>

      {courses.length === 0 ? (
        <Card className="glass-effect p-8 text-center border-2 border-yellow-400/30">
          <BookOpen className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Nenhum curso disponível</h3>
          <p className="text-gray-400">Novos cursos serão adicionados em breve!</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course, index) => {
            const courseQuizzes = getCourseQuizzes(course.id);
            const totalDuration = course.lessons.reduce((total, lesson) => total + lesson.duration, 0);
            
            return (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="glass-effect p-6 border-2 border-yellow-400/30 hover:border-yellow-400/50 transition-all h-full flex flex-col">
                  <div className="flex items-start space-x-4 mb-4">
                    <div className="p-3 bg-yellow-400/20 rounded-lg">
                      <BookOpen className="w-8 h-8 text-yellow-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2">{course.title}</h3>
                      <p className="text-gray-300 text-sm">{course.description}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3 mb-6 flex-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400 flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        Lições:
                      </span>
                      <span className="text-yellow-400">{course.lessons.length}</span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400 flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        Duração:
                      </span>
                      <span className="text-yellow-400">{totalDuration} min</span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400 flex items-center">
                        <FileQuestion className="w-4 h-4 mr-1" />
                        Questionários:
                      </span>
                      <span className="text-yellow-400">{courseQuizzes.length}</span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Criado em:</span>
                      <span className="text-yellow-400">
                        {new Date(course.createdAt).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </div>

                  {/* Course Lessons Preview */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-sm mb-3 text-gray-300">Lições do Curso:</h4>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {course.lessons.slice(0, 3).map((lesson, lessonIndex) => (
                        <div key={lesson.id} className="flex justify-between items-center p-2 glass-effect rounded text-sm">
                          <span className="text-gray-300">{lessonIndex + 1}. {lesson.title}</span>
                          <span className="text-yellow-400 text-xs">{lesson.duration}min</span>
                        </div>
                      ))}
                      {course.lessons.length > 3 && (
                        <div className="text-center text-xs text-gray-400">
                          +{course.lessons.length - 3} mais lições
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Course Quizzes */}
                  {courseQuizzes.length > 0 && (
                    <div className="mb-6">
                      <h4 className="font-semibold text-sm mb-3 text-gray-300">Questionários Disponíveis:</h4>
                      <div className="space-y-2">
                        {courseQuizzes.map((quiz) => (
                          <div key={quiz.id} className="flex justify-between items-center p-2 glass-effect rounded text-sm">
                            <span className="text-gray-300">{quiz.title}</span>
                            <Link to={`/quiz/${quiz.id}`}>
                              <Button size="sm" variant="outline" className="text-xs border-yellow-400/30">
                                Fazer Quiz
                              </Button>
                            </Link>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <Link to={`/course/${course.id}`} className="mt-auto">
                    <Button className="w-full angola-gradient">
                      <Play className="w-4 h-4 mr-2" />
                      Iniciar Curso
                    </Button>
                  </Link>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default StudentCourses;