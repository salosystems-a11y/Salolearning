import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import StudentSidebar from '@/components/student/StudentSidebar';
import StudentHeader from '@/components/student/StudentHeader';
import StudentOverview from '@/components/student/StudentOverview';
import StudentCourses from '@/components/student/StudentCourses';
import StudentTasks from '@/components/student/StudentTasks';
import StudentProgress from '@/components/student/StudentProgress';

const StudentDashboard = () => {
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
    if (window.innerWidth < 1024) {
      setSidebarOpen(!sidebarOpen);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-900 text-white">
      <StudentSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col min-w-0">
        <StudentHeader onMenuClick={toggleSidebar} />
        
        <main className="flex-1 p-6 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Routes>
              <Route path="/" element={<StudentOverview />} />
              <Route path="/courses" element={<StudentCourses />} />
              <Route path="/tasks" element={<StudentTasks />} />
              <Route path="/progress" element={<StudentProgress />} />
              <Route path="*" element={<Navigate to="/student" replace />} />
            </Routes>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default StudentDashboard;