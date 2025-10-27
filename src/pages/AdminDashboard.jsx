
import React, { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
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
import CompanyManagement from '@/components/admin/CompanyManagement';

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();

  const toggleSidebarCollapse = () => {
    setSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className="min-h-screen flex bg-gray-900 text-white">
      <AdminSidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
        isCollapsed={isSidebarCollapsed}
        toggleCollapse={toggleSidebarCollapse}
      />
      
      <div className={cn(
          "flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out",
          isSidebarCollapsed ? "lg:pl-20" : "lg:pl-64"
      )}>
        <AdminHeader onMenuClick={() => setSidebarOpen(true)} />
        
        <main className="flex-1 p-6 overflow-y-auto">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Routes>
              <Route path="/" element={<AdminOverview />} />
              <Route path="/companies" element={<CompanyManagement />} />
              <Route path="/users" element={<UserManagement />} />
              <Route path="/permissions" element={<PermissionManagement />} />
              <Route path="/profiles" element={<ProfileManagement />} />
              <Route path="/courses" element={<CourseManagement />} />
              <Route path="/quizzes" element={<QuizManagement />} />
              <Route path="/tasks" element={<TaskManagement />} />
              <Route path="/rankings" element={<RankingManagement />} />
              <Route path="*" element={<AdminOverview />} />
            </Routes>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
