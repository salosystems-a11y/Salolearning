
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/SupabaseAuthContext.jsx';
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  FileQuestion, 
  CheckSquare, 
  Trophy,
  LogOut,
  X,
  ChevronDown,
  UserCog,
  KeyRound,
  Users2
} from 'lucide-react';
import { cn } from '@/lib/utils';

const AdminSidebar = ({ isOpen, onClose }) => {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [openDropdown, setOpenDropdown] = useState(null);

  const menuItems = [
    { icon: LayoutDashboard, label: 'Visão Geral', path: '/admin' },
    { 
      icon: Users, 
      label: 'Utilizadores', 
      id: 'users',
      subItems: [
        { icon: Users2, label: 'Gestão de Utilizadores', path: '/admin/users' },
        { icon: KeyRound, label: 'Permissões', path: '/admin/permissions' },
        { icon: UserCog, label: 'Perfis de Utilizador', path: '/admin/profiles' },
      ]
    },
    { icon: BookOpen, label: 'Cursos', path: '/admin/courses' },
    { icon: FileQuestion, label: 'Questionários', path: '/admin/quizzes' },
    { icon: CheckSquare, label: 'Tarefas', path: '/admin/tasks' },
    { icon: Trophy, label: 'Rankings', path: '/admin/rankings' },
  ];
  
  useEffect(() => {
    const activeItem = menuItems.find(item => item.subItems?.some(sub => location.pathname.startsWith(sub.path)));
    if (activeItem) {
      setOpenDropdown(activeItem.id);
    }
  }, [location.pathname]);

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

  const toggleDropdown = (id) => {
    setOpenDropdown(openDropdown === id ? null : id);
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
        className={cn("fixed top-0 left-0 h-full w-64 z-50 glass-effect border-r border-yellow-400/30 flex-shrink-0 flex-col", isOpen ? "flex" : "hidden lg:flex")}
        variants={sidebarVariants}
        initial={false}
        animate={isOpen ? "open" : "closed"}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-yellow-400/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="text-2xl">👑</div>
                <div>
                  <h2 className="font-bold text-lg">Admin</h2>
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

          <nav className="flex-1 p-4 overflow-y-auto">
            <ul className="space-y-2">
              {menuItems.map((item) => (
                <li key={item.path || item.id}>
                  {item.subItems ? (
                    <div>
                      <button
                        onClick={() => toggleDropdown(item.id)}
                        className="flex items-center justify-between w-full px-4 py-3 rounded-lg hover:bg-white/10 text-gray-300 transition-all"
                      >
                        <div className="flex items-center space-x-3">
                          <item.icon className="w-5 h-5" />
                          <span>{item.label}</span>
                        </div>
                        <ChevronDown className={`w-4 h-4 transition-transform ${openDropdown === item.id ? 'rotate-180' : ''}`} />
                      </button>
                      <AnimatePresence>
                        {openDropdown === item.id && (
                          <motion.ul
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="pl-6 mt-1 space-y-1 overflow-hidden"
                          >
                            {item.subItems.map(subItem => (
                              <li key={subItem.path}>
                                <NavLink
                                  to={subItem.path}
                                  onClick={handleLinkClick}
                                  className={({ isActive }) =>
                                    `flex items-center space-x-3 px-4 py-2 rounded-lg transition-all text-sm ${
                                      isActive
                                        ? 'bg-yellow-400/20 text-yellow-400'
                                        : 'hover:bg-white/10 text-gray-400 hover:text-gray-200'
                                    }`
                                  }
                                >
                                  <subItem.icon className="w-4 h-4" />
                                  <span>{subItem.label}</span>
                                </NavLink>
                              </li>
                            ))}
                          </motion.ul>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <NavLink
                      to={item.path}
                      onClick={handleLinkClick}
                      end={item.path === '/admin'}
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
                  )}
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

export default AdminSidebar;
