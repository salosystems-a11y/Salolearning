
import React from 'react';
import { Card } from '@/components/ui/card';
import { UserCog } from 'lucide-react';

const ProfileManagement = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Edição de Perfis</h1>
        <p className="text-gray-400">Visualize e edite os detalhes dos perfis de utilizador.</p>
      </div>
      <Card className="glass-effect p-8 text-center border-2 border-yellow-400/30">
        <UserCog className="w-16 h-16 mx-auto text-yellow-400 mb-4" />
        <h3 className="text-2xl font-semibold mb-2">Em Construção! 🚧</h3>
        <p className="text-gray-400 max-w-md mx-auto">
          Esta funcionalidade ainda não está implementada. Em breve, poderá editar perfis de utilizador detalhadamente a partir deste ecrã.
        </p>
      </Card>
    </div>
  );
};

export default ProfileManagement;
