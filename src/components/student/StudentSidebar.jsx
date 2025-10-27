import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/SupabaseAuthContext.jsx';
import { 
  LayoutDashboard, 
  BookOpen, 
  CheckSquare, 
  TrendingUp,
  Trophy,
  LogOut,
  X
} from 'lucide-react';

const StudentSidebar = ({ isOpen, onClose }) => {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Visão Geral', path: '/student' },
    { icon: BookOpen, label: 'Cursos', path: '/student/courses' },
    { icon: CheckSquare, label: 'Tarefas', path: '/student/tasks' },
    { icon: TrendingUp, label: 'Progresso', path: '/student/progress' },
    { icon: Trophy, label: 'Ranking', path: '/ranking' },
  ];

  const handleLogout = async () => {
    await signOut();
    onClose();
    navigate('/login');
  };
  
  const handleLinkClick = () => {
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  const sidebarVariants = {
    open: { x: 0 },
    closed: { x: "-100%" }
  };
  
  const backdropVariants = {
    open: { opacity: 1, pointerEvents: 'auto' },
    closed: { opacity: 0, pointerEvents: 'none' }
  }

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={backdropVariants}
            initial="closed"
            animate="open"
            exit="closed"
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      <motion.aside
        className="fixed top-0 left-0 h-full w-64 z-50 glass-effect border-r border-yellow-400/30 flex-shrink-0 flex-col lg:static lg:translate-x-0"
        variants={sidebarVariants}
        initial={false}
        animate={isOpen ? "open" : "closed"}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        style={{ display: isOpen ? 'flex' : 'none' }}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-yellow-400/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="text-2xl">🎓</div>
                <div>
                  <h2 className="font-bold text-lg">Estudante</h2>
                  <p className="text-sm text-gray-400">SaloLearning</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="lg:hidden p-1 hover:bg-white/10 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {menuItems.map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    onClick={handleLinkClick}
                    end={item.path === '/student'}
                    className={({ isActive }) =>
                      `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                        isActive
                          ? 'bg-yellow-400/20 text-yellow-400 border border-yellow-400/30'
                          : 'hover:bg-white/10 text-gray-300'
                      }`
                    }
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="p-4 border-t border-yellow-400/30">
            <button
              onClick={handleLogout}
              className="flex items-center space-x-3 px-4 py-3 w-full text-left hover:bg-red-500/20 text-red-400 rounded-lg transition-all"
            >
              <LogOut className="w-5 h-5" />
              <span>Sair</span>
            </button>
          </div>
        </div>
      </motion.aside>
    </>
  );
};

export default StudentSidebar;