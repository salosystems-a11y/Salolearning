import React from 'react';
import { useAuth } from '@/contexts/SupabaseAuthContext.jsx';
import { Button } from '@/components/ui/button';
import { Menu, Bell } from 'lucide-react';

const AdminHeader = ({ onMenuClick }) => {
  const { user } = useAuth();

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
            <h1 className="text-xl font-semibold">Dashboard Administrativo</h1>
            <p className="text-sm text-gray-400">Gerencie sua plataforma de ensino</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
          </Button>
          
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <p className="font-semibold">{user?.user_metadata?.name || 'Admin'}</p>
              <p className="text-sm text-gray-400">Administrador</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;