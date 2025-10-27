
import React from 'react';
import { Card } from '@/components/ui/card';
import { ShieldCheck } from 'lucide-react';

const PermissionManagement = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Gestão de Permissões</h1>
        <p className="text-gray-400">Defina o que cada tipo de utilizador pode ver e fazer.</p>
      </div>
      <Card className="glass-effect p-8 text-center border-2 border-yellow-400/30">
        <ShieldCheck className="w-16 h-16 mx-auto text-yellow-400 mb-4" />
        <h3 className="text-2xl font-semibold mb-2">Em Construção! 🚧</h3>
        <p className="text-gray-400 max-w-md mx-auto">
          Esta funcionalidade ainda não está implementada. Em breve, poderá gerir as permissões para administradores, professores e estudantes a partir daqui.
        </p>
      </Card>
    </div>
  );
};

export default PermissionManagement;
