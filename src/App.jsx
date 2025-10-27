
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Toaster } from '@/components/ui/toaster';
import LandingPage from '@/pages/LandingPage';
import LoginPage from '@/pages/LoginPage';
import AdminDashboard from '@/pages/AdminDashboard';
import StudentDashboard from '@/pages/StudentDashboard';
import QuizPage from '@/pages/QuizPage';
import RankingPage from '@/pages/RankingPage';
import CoursePage from '@/pages/CoursePage';
import ProtectedRoute from '@/components/ProtectedRoute';

function App() {
  return (
    <>
      <Helmet>
        <title>SaloLearning - Plataforma de Ensino Gamificada</title>
        <meta name="description" content="SaloLearning: Plataforma de ensino gamificada para consultores comerciais com sistema de ranking e desafios inspirados nos recursos naturais de Angola" />
        <meta property="og:title" content="SaloLearning - Plataforma de Ensino Gamificada" />
        <meta property="og:description" content="SaloLearning: Plataforma de ensino gamificada para consultores comerciais com sistema de ranking e desafios inspirados nos recursos naturais de Angola" />
      </Helmet>
      
      <div className="min-h-screen hero-pattern">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route 
            path="/admin/*" 
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/student/*" 
            element={
              <ProtectedRoute requiredRole={["student", "teacher", "manager"]}>
                <StudentDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/quiz/:quizId" 
            element={
              <ProtectedRoute>
                <QuizPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/course/:courseId" 
            element={
              <ProtectedRoute>
                <CoursePage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/ranking" 
            element={
              <ProtectedRoute>
                <RankingPage />
              </ProtectedRoute>
            } 
          />
        </Routes>
        <Toaster />
      </div>
    </>
  );
}

export default App;
