
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/SupabaseAuthContext.jsx';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { ArrowLeft, Clock, HelpCircle, Check, X, Trophy, Star } from 'lucide-react';

const QuizPage = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const { quizzes, submitQuizResult } = useData();
  const { userProfile } = useAuth();
  const { toast } = useToast();

  const quiz = useMemo(() => quizzes.find(q => q.id.toString() === quizId), [quizId, quizzes]);
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(quiz?.timeLimit || 0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [finalAnswers, setFinalAnswers] = useState([]);


  useEffect(() => {
    if (!quiz) return;
    setTimeLeft(quiz.timeLimit);
    const timer = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 1) {
          clearInterval(timer);
          if(!quizFinished) finishQuiz();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [quiz]);
  
  const finishQuiz = useCallback(() => {
    if (quizFinished || !quiz) return; // Prevent multiple calls
  
    let currentAnswers = answers;
    const currentQuestion = quiz.questions[currentQuestionIndex];
    if (selectedAnswer !== null && answers.length === quiz.questions.length - 1) {
        const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
        currentAnswers = [...currentAnswers, {
            questionId: currentQuestion.id,
            selected: selectedAnswer,
            isCorrect: isCorrect,
            points: isCorrect ? currentQuestion.points : 0
        }];
    }
  
    const totalScore = currentAnswers.reduce((sum, ans) => sum + ans.points, 0);
    const correctCount = currentAnswers.filter(ans => ans.isCorrect).length;
    
    setFinalScore(totalScore);
    setFinalAnswers(currentAnswers);
    setQuizFinished(true);
  
    if(userProfile?.id){
      submitQuizResult({
        quizId: quiz.id,
        userId: userProfile.id,
        score: totalScore,
        correctAnswers: correctCount,
        totalQuestions: quiz.questions.length
      });
    } else {
        toast({
            title: "Erro de autenticação",
            description: "Não foi possível registar o seu resultado. Tente novamente.",
            variant: "destructive"
        })
    }
  
  }, [answers, selectedAnswer, quiz, currentQuestionIndex, submitQuizResult, userProfile, toast, quizFinished]);

  const handleAnswerSelect = (optionIndex) => {
    setSelectedAnswer(optionIndex);
  };
  
  const handleNextQuestion = () => {
    const currentQuestion = quiz.questions[currentQuestionIndex];
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    
    const newAnswers = [...answers, {
      questionId: currentQuestion.id,
      selected: selectedAnswer,
      isCorrect: isCorrect,
      points: isCorrect ? currentQuestion.points : 0
    }];
    setAnswers(newAnswers);

    setSelectedAnswer(null);

    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      finishQuiz();
    }
  };

  if (!quiz) {
    return <div className="min-h-screen flex items-center justify-center text-white"><HelpCircle className="w-8 h-8 mr-2"/>Questionário não encontrado.</div>;
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;

  if (quizFinished) {
    const correctCount = finalAnswers.filter(ans => ans.isCorrect).length;
    const accuracy = quiz.questions.length > 0 ? Math.round((correctCount / quiz.questions.length) * 100) : 0;
    
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}>
          <Card className="glass-effect p-8 text-center border-2 border-yellow-400/30 w-full max-w-lg">
            <Trophy className="w-16 h-16 mx-auto text-yellow-400 mb-4" />
            <h1 className="text-3xl font-bold mb-2">Questionário Concluído!</h1>
            <p className="text-gray-300 mb-6">Parabéns por completar o desafio.</p>
            <div className="space-y-4 text-left">
              <div className="flex justify-between items-center glass-effect p-4 rounded-lg">
                <span className="font-semibold flex items-center"><Star className="w-5 h-5 mr-2 text-yellow-400" />Pontuação Final:</span>
                <span className="text-2xl font-bold text-yellow-400">{finalScore}</span>
              </div>
              <div className="flex justify-between items-center glass-effect p-4 rounded-lg">
                <span className="font-semibold flex items-center"><Check className="w-5 h-5 mr-2 text-green-400" />Respostas Corretas:</span>
                <span className="text-xl font-bold">{correctCount} de {quiz.questions.length}</span>
              </div>
              <div className="flex justify-between items-center glass-effect p-4 rounded-lg">
                <span className="font-semibold flex items-center"><X className="w-5 h-5 mr-2 text-red-400" />Taxa de Acerto:</span>
                <span className="text-xl font-bold">{accuracy}%</span>
              </div>
            </div>
            <Button onClick={() => navigate('/student/courses')} className="w-full mt-8 angola-gradient">
              Voltar para Cursos
            </Button>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <Button variant="outline" onClick={() => navigate(-1)} className="glass-effect border-yellow-400/30">
            <ArrowLeft className="w-4 h-4 mr-2" /> Sair do Quiz
          </Button>
          <div className="glass-effect px-4 py-2 rounded-lg flex items-center space-x-2">
            <Clock className="w-5 h-5 text-yellow-400" />
            <span className="font-mono text-lg">{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</span>
          </div>
        </div>
        
        <Card className="glass-effect p-8 border-2 border-yellow-400/30">
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-400">Questão {currentQuestionIndex + 1} de {quiz.questions.length}</span>
              <span className="text-yellow-400">{currentQuestion.points} pontos</span>
            </div>
            <div className="progress-bar h-2"><div style={{ width: `${progress}%` }} className="h-full transition-all duration-300"></div></div>
          </div>
          
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestionIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-2xl font-semibold mb-6">{currentQuestion.question}</h2>
              <div className="space-y-3">
                {currentQuestion.options.map((option, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    onClick={() => setSelectedAnswer(index)}
                    className={`w-full justify-start text-left h-auto py-3 px-4 transition-all duration-200 glass-effect border-2 ${selectedAnswer === index ? 'border-yellow-400 bg-yellow-400/20' : 'border-gray-600 hover:border-yellow-400/50'}`}
                  >
                    <div className="flex items-center">
                      <div className={`w-6 h-6 rounded-md mr-4 flex-shrink-0 flex items-center justify-center border ${selectedAnswer === index ? 'bg-yellow-400 border-yellow-400 text-black' : 'border-gray-500'}`}>
                        {String.fromCharCode(65 + index)}
                      </div>
                      <span>{option}</span>
                    </div>
                  </Button>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="mt-8 flex justify-end">
            <Button onClick={handleNextQuestion} disabled={selectedAnswer === null} className="angola-gradient">
              {currentQuestionIndex === quiz.questions.length - 1 ? 'Finalizar Quiz' : 'Próxima Questão'}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default QuizPage;
