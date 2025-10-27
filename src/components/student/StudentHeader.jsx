import React from 'react';
import { useAuth } from '@/contexts/SupabaseAuthContext.jsx';
import { useData } from '@/contexts/DataContext';
import { Button } from '@/components/ui/button';
import { Menu, Bell, Trophy } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast'; // Import useToast

const StudentHeader = ({ onMenuClick }) => {
  const { user } = useAuth();
  const { users } = useData();
  const { toast } = useToast(); // Initialize useToast
  
  const currentUserData = users.find(u => u.auth_id === user?.id);

  return (
    <header className="glass-effect border-b border-yellow-400/30 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            className="lg:hidden"
          >
            <Menu className="w-5 h-5" />
          </Button>
          
          <div>
            <h1 className="text-xl font-semibold">Painel do Estudante</h1>
            <p className="text-sm text-gray-400">Continue sua jornada de aprendizado</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {currentUserData && (
            <div className="flex items-center space-x-2 ranking-badge px-3 py-1 rounded-full">
              <Trophy className="w-4 h-4" />
              <span className="text-sm font-semibold">{currentUserData.score} pts</span>
            </div>
          )}
          
          <Button onClick={() => toast({ title: "Notificações", description: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀" })} variant="ghost" size="icon" className="relative">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
          </Button>
          
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <p className="font-semibold">{currentUserData?.name}</p>
              <p className="text-sm text-gray-400">Consultor</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default StudentHeader;