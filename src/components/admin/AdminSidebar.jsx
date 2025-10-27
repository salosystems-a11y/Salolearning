
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/SupabaseAuthContext.jsx';
import { Button } from '@/components/ui/button';
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
  Users2,
  Building,
  ChevronsLeft,
  ChevronsRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

const SidebarNavLink = ({ to, icon: Icon, label, isCollapsed, onClick, end }) => {
  return (
    <NavLink 
      to={to} 
      onClick={onClick} 
      end={end}
      className={({ isActive }) => cn(
        "flex items-center space-x-3 px-4 py-3 rounded-lg transition-all",
        isActive ? 'bg-yellow-400/20 text-yellow-400 border border-yellow-400/30' : 'hover:bg-white/10 text-gray-300',
        isCollapsed && "justify-center"
      )}
    >
      <Icon className="w-5 h-5 flex-shrink-0" />
      <AnimatePresence>
        {!isCollapsed && (
          <motion.span 
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 'auto' }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ duration: 0.2 }}
            className="whitespace-nowrap"
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>
    </NavLink>
  );
};

const SidebarContent = ({ onClose, isCollapsed, toggleCollapse }) => {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [openDropdown, setOpenDropdown] = useState(null);

  const menuItems = [
    { icon: LayoutDashboard, label: 'Visão Geral', path: '/admin' },
    { icon: Building, label: 'Empresas', path: '/admin/companies'},
    { icon: BookOpen, label: 'Cursos', path: '/admin/courses' },
    { icon: FileQuestion, label: 'Questionários', path: '/admin/quizzes' },
    { icon: CheckSquare, label: 'Tarefas', path: '/admin/tasks' },
    { icon: Trophy, label: 'Rankings', path: '/admin/rankings' },
    { 
      icon: Users, 
      label: 'Utilizadores', 
      id: 'users',
      subItems: [
        { icon: Users2, label: 'Gestão', path: '/admin/users' },
        { icon: KeyRound, label: 'Permissões', path: '/admin/permissions' },
        { icon: UserCog, label: 'Perfis', path: '/admin/profiles' },
      ]
    },
  ];

  useEffect(() => {
    if (isCollapsed) {
      setOpenDropdown(null);
    } else {
      const activeItem = menuItems.find(item => item.subItems?.some(sub => location.pathname.startsWith(sub.path)));
      if (activeItem) {
        setOpenDropdown(activeItem.id);
      }
    }
  }, [location.pathname, menuItems, isCollapsed]);

  const handleLogout = async () => {
    await signOut();
    if(onClose) onClose();
    navigate('/login');
  };

  const handleLinkClick = () => {
    if (window.innerWidth < 1024 && onClose) {
      onClose();
    }
  };

  const toggleDropdown = (id) => {
    if (isCollapsed) return;
    setOpenDropdown(openDropdown === id ? null : id);
  };

  return (
    <div className="flex flex-col h-full relative">
      <div className={cn("p-4 border-b border-yellow-400/30 flex items-center", isCollapsed ? 'justify-center' : 'justify-between')}>
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex items-center space-x-3"
              >
                <div className="text-2xl">👑</div>
                <div>
                  <h2 className="font-bold text-lg whitespace-nowrap">Admin</h2>
                  <p className="text-sm text-gray-400 whitespace-nowrap">SaloLearning</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <button onClick={onClose} className="lg:hidden p-1 hover:bg-white/10 rounded">
            <X className="w-5 h-5" />
          </button>
      </div>

      <nav className="flex-1 p-4 overflow-y-auto overflow-x-hidden">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path || item.id}>
              {item.subItems ? (
                <div>
                  <button 
                    onClick={() => toggleDropdown(item.id)} 
                    className={cn(
                        "flex items-center w-full px-4 py-3 rounded-lg hover:bg-white/10 text-gray-300 transition-all",
                        isCollapsed ? 'justify-center' : 'justify-between'
                    )}
                  >
                    <div className="flex items-center space-x-3">
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      {!isCollapsed && <span>{item.label}</span>}
                    </div>
                    {!isCollapsed && <ChevronDown className={`w-4 h-4 transition-transform ${openDropdown === item.id ? 'rotate-180' : ''}`} />}
                  </button>
                  <AnimatePresence>
                    {!isCollapsed && openDropdown === item.id && (
                      <motion.ul
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="pl-6 mt-1 space-y-1 overflow-hidden"
                      >
                        {item.subItems.map(subItem => (
                          <li key={subItem.path}>
                            <NavLink to={subItem.path} onClick={handleLinkClick} className={({ isActive }) => `flex items-center space-x-3 px-4 py-2 rounded-lg transition-all text-sm ${isActive ? 'bg-yellow-400/20 text-yellow-400' : 'hover:bg-white/10 text-gray-400 hover:text-gray-200'}`}>
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
                <SidebarNavLink to={item.path} icon={item.icon} label={item.label} isCollapsed={isCollapsed} onClick={handleLinkClick} end={item.path === '/admin'} />
              )}
            </li>
          ))}
        </ul>
      </nav>

      <div className={cn("p-4 border-t border-yellow-400/30", isCollapsed && "py-2")}>
        <Button onClick={handleLogout} variant="ghost" className={cn("w-full text-red-400 hover:bg-red-500/20 hover:text-red-400", isCollapsed ? 'justify-center px-0' : 'justify-start')}>
          <LogOut className="w-5 h-5" />
          {!isCollapsed && <span className="ml-3">Sair</span>}
        </Button>
      </div>
      
      <Button onClick={toggleCollapse} variant="ghost" className="hidden lg:flex absolute top-1/2 -right-4 transform -translate-y-1/2 w-8 h-8 p-0 bg-gray-800 hover:bg-yellow-400/20 rounded-full border border-yellow-400/30">
        {isCollapsed ? <ChevronsRight className="w-4 h-4" /> : <ChevronsLeft className="w-4 h-4" />}
      </Button>
    </div>
  );
};

const AdminSidebar = ({ isOpen, onClose, isCollapsed, toggleCollapse }) => {
  const sidebarVariants = { open: { x: 0 }, closed: { x: "-100%" } };
  const backdropVariants = { open: { opacity: 1, pointerEvents: 'auto' }, closed: { opacity: 0, pointerEvents: 'none' } };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div variants={backdropVariants} initial="closed" animate="open" exit="closed" onClick={onClose} className="fixed inset-0 bg-black/60 z-40 lg:hidden" />
        )}
      </AnimatePresence>

      <motion.aside
        className="fixed top-0 left-0 h-full w-64 z-50 glass-effect border-r border-yellow-400/30 lg:hidden"
        variants={sidebarVariants}
        initial="closed"
        animate={isOpen ? "open" : "closed"}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <SidebarContent onClose={onClose} isCollapsed={false} />
      </motion.aside>

      <motion.aside 
        className="hidden lg:fixed lg:flex lg:flex-shrink-0 h-screen glass-effect border-r border-yellow-400/30"
        animate={{ width: isCollapsed ? '5rem' : '16rem' }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <SidebarContent isCollapsed={isCollapsed} toggleCollapse={toggleCollapse} />
      </motion.aside>
    </>
  );
};

export default AdminSidebar;
