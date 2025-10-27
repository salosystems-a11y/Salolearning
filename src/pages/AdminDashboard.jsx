
import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminOverview from '@/components/admin/AdminOverview';
import UserManagement from '@/components/admin/UserManagement';
import PermissionManagement from '@/components/admin/PermissionManagement';
import ProfileManagement from '@/components/admin/ProfileManagement';
import CourseManagement from '@/components/admin/CourseManagement';
import QuizManagement from '@/components/admin/QuizManagement';
import TaskManagement from '@/components/admin/TaskManagement';
import RankingManagement from '@/components/admin/RankingManagement';

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
      setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen flex bg-gray-900 text-white">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader onMenuClick={toggleSidebar} />
        
        <main className="flex-1 p-6 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Routes>
              <Route path="/" element={<AdminOverview />} />
              <Route path="/users" element={<UserManagement />} />
              <Route path="/permissions" element={<PermissionManagement />} />
              <Route path="/profiles" element={<ProfileManagement />} />
              <Route path="/courses" element={<CourseManagement />} />
              <Route path="/quizzes" element={<QuizManagement />} />
              <Route path="/tasks" element={<TaskManagement />} />
              <Route path="/rankings" element={<RankingManagement />} />
              <Route path="*" element={<Navigate to="/admin" replace />} />
            </Routes>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
