
import React, { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Loader2, User, Search, Building, Mail } from 'lucide-react';
import { motion } from 'framer-motion';

const ProfileCard = ({ user, companyName }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
    >
        <Card className="glass-effect border-2 border-yellow-400/30 overflow-hidden">
            <div className="h-20 angola-gradient" />
            <CardContent className="p-6 text-center -mt-12">
                <div className="w-24 h-24 mx-auto rounded-full border-4 border-gray-900 bg-gray-800 flex items-center justify-center">
                    <User className="w-12 h-12 text-yellow-400" />
                </div>
                <h3 className="text-2xl font-bold mt-4">{user.name}</h3>
                <p className="text-cyan-400">{user.role}</p>
                <div className="mt-6 space-y-3 text-left">
                    <div className="flex items-center text-gray-300">
                        <Mail className="w-4 h-4 mr-3" />
                        <span>{user.email}</span>
                    </div>
                     <div className="flex items-center text-gray-300">
                        <Building className="w-4 h-4 mr-3" />
                        <span>{companyName}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    </motion.div>
);


const ProfileManagement = () => {
    const { users, companies, loading } = useData();
    const [searchTerm, setSearchTerm] = useState('');

    const filteredUsers = users.filter(user =>
        (user.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (user.email?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    );

    const getUserCompanyName = (companyId) => {
      if (!companyId) return 'Administração Global';
      const company = companies.find(c => c.id === companyId);
      return company ? company.name : 'Empresa Desconhecida';
    };
    
    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="w-8 h-8 animate-spin text-yellow-400" />
                <span className="ml-2">A carregar perfis...</span>
            </div>
        );
    }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Perfis de Utilizador</h1>
        <p className="text-gray-400">Visualize os perfis de todos os utilizadores no sistema.</p>
      </div>
      
      <Card className="glass-effect p-4 border-2 border-yellow-400/30">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input 
            placeholder="Pesquisar por nome ou email..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
            className="pl-10 glass-effect border-gray-600 bg-gray-800" 
          />
        </div>
      </Card>

      {filteredUsers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredUsers.map(user => (
            <ProfileCard key={user.id} user={user} companyName={getUserCompanyName(user.company_id)} />
          ))}
        </div>
      ) : (
        <Card className="glass-effect p-8 text-center border-2 border-yellow-400/30">
            <User className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Nenhum perfil encontrado</h3>
            <p className="text-gray-400">Ajuste os termos da sua pesquisa.</p>
        </Card>
      )}
    </div>
  );
};

export default ProfileManagement;
