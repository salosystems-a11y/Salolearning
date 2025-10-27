
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useData } from '@/contexts/DataContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Plus, Search, User, Mail, Calendar, Edit, Trash2, Loader2, ShieldAlert, PcCase as Case, GraduationCap, UserCog, FileUp, Server, Building } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

const RoleIcon = ({ role }) => {
  switch (role) {
    case 'admin': return <UserCog className="w-4 h-4 mr-2 text-red-400" />;
    case 'manager': return <UserCog className="w-4 h-4 mr-2 text-cyan-400" />;
    case 'teacher': return <Case className="w-4 h-4 mr-2 text-green-400" />;
    case 'student': return <GraduationCap className="w-4 h-4 mr-2 text-blue-400" />;
    default: return <User className="w-4 h-4 mr-2" />;
  }
};

const RoleBadge = ({ role }) => {
    let baseClasses = "inline-block px-3 py-1 rounded-full text-xs font-semibold ";
    switch (role) {
      case 'admin': return <span className={baseClasses + 'bg-red-500/20 text-red-400'}>Administrador</span>;
      case 'manager': return <span className={baseClasses + 'bg-cyan-500/20 text-cyan-400'}>Gestor</span>;
      case 'teacher': return <span className={baseClasses + 'bg-green-500/20 text-green-400'}>Professor</span>;
      case 'student': return <span className={baseClasses + 'bg-blue-500/20 text-blue-400'}>Estudante</span>;
      default: return <span className={baseClasses + 'bg-gray-500/20 text-gray-400'}>Desconhecido</span>;
    }
};

const UserManagement = () => {
  const { users, companies, createUser, updateUser, deleteAllUsers, loading: dataLoading } = useData();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [isDeletingAll, setIsDeletingAll] = useState(false);

  const [userData, setUserData] = useState({ name: '', email: '', password: '', role: 'student', company_id: null });

  const filteredUsers = users.filter(user =>
    (user.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (user.email?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  const openCreateDialog = () => {
    setIsEditing(false);
    setCurrentUser(null);
    setUserData({ name: '', email: '', password: '', role: 'student', company_id: companies[0]?.id || null });
    if (companies.length === 0) {
      toast({
        title: "Nenhuma empresa encontrada",
        description: "Por favor, crie uma empresa primeiro antes de adicionar utilizadores.",
        variant: "destructive"
      });
      return;
    }
    setShowDialog(true);
  };

  const openEditDialog = (user) => {
    setIsEditing(true);
    setCurrentUser(user);
    setUserData({ name: user.name, email: user.email, role: user.role, password: '', company_id: user.company_id }); 
    setShowDialog(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);

    if (userData.role !== 'admin' && !userData.company_id) {
        toast({ title: 'Erro de Validação', description: 'Por favor, associe o utilizador a uma empresa.', variant: 'destructive' });
        setFormLoading(false);
        return;
    }

    if (isEditing) {
      const success = await updateUser(currentUser.id, userData);
      if(success) {
        setShowDialog(false);
      }
    } else {
      const newUser = await createUser(userData);
      if(newUser) {
        setShowDialog(false);
      }
    }
    setFormLoading(false);
  };
  
  const handleDeleteAllUsers = async () => {
    setIsDeletingAll(true);
    await deleteAllUsers();
    setIsDeletingAll(false);
  };
  
  const handleNotImplemented = () => {
    toast({
      title: "🚧 Funcionalidade em construção!",
      description: "Esta opção será implementada em breve. Pode pedi-la no próximo prompt! 🚀",
    });
  };

  if (dataLoading && users.length === 0) {
    return (
        <div className="flex items-center justify-center h-full">
            <Loader2 className="w-8 h-8 animate-spin text-yellow-400" />
            <span className="ml-2">A carregar utilizadores...</span>
        </div>
    );
  }

  const getUserCompanyName = (companyId) => {
      if (!companyId) return 'N/A';
      const company = companies.find(c => c.id === companyId);
      return company ? company.name : 'Empresa Desconhecida';
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold mb-2">Gestão de Utilizadores</h1>
          <p className="text-gray-400">Gerencie contas, associe a empresas e defina permissões.</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button onClick={openCreateDialog} className="angola-gradient">
            <Plus className="w-4 h-4 mr-2" /> Novo Utilizador
          </Button>
          <Button onClick={handleNotImplemented} variant="outline" className="glass-effect border-yellow-400/30">
            <FileUp className="w-4 h-4 mr-2" /> Importar Excel
          </Button>
        </div>
      </div>

      <Card className="glass-effect p-4 border-2 border-yellow-400/30">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input placeholder="Pesquisar utilizadores..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 glass-effect border-yellow-400/30" />
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map((user, index) => (
          <motion.div key={user.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
            <Card className="glass-effect p-6 border-2 border-yellow-400/30 hover:border-yellow-400/50 transition-all flex flex-col justify-between h-full">
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{user.name || 'Nome não definido'}</h3>
                    <div className="flex items-center text-sm text-gray-400 capitalize">
                      <RoleIcon role={user.role} />
                      <RoleBadge role={user.role} />
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => openEditDialog(user)} className="w-8 h-8"><Edit className="w-4 h-4" /></Button>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-gray-300"><Mail className="w-4 h-4 mr-2" /> {user.email}</div>
                  <div className="flex items-center text-gray-300"><Building className="w-4 h-4 mr-2" /> {getUserCompanyName(user.company_id)}</div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-600 flex items-center justify-between text-xs text-gray-400">
                <span>Membro desde:</span>
                <span>{new Date(user.created_at).toLocaleDateString('pt-BR')}</span>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredUsers.length === 0 && !dataLoading && <Card className="glass-effect p-8 text-center border-2 border-yellow-400/30"><User className="w-12 h-12 mx-auto text-gray-400 mb-4" /><h3 className="text-xl font-semibold mb-2">Nenhum utilizador encontrado</h3><p className="text-gray-400">Crie um novo utilizador ou ajuste os termos de pesquisa.</p></Card>}

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="glass-effect border-yellow-400/30 text-white">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Editar Utilizador' : 'Criar Novo Utilizador'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div><Label htmlFor="name">Nome</Label><Input id="name" value={userData.name} onChange={(e) => setUserData({...userData, name: e.target.value})} className="bg-gray-800 border-gray-600" required /></div>
            <div><Label htmlFor="email">Email</Label><Input id="email" type="email" value={userData.email} onChange={(e) => setUserData({...userData, email: e.target.value})} className="bg-gray-800 border-gray-600" required disabled={isEditing} /></div>
            {!isEditing && <div><Label htmlFor="password">Senha</Label><Input id="password" type="password" value={userData.password} onChange={(e) => setUserData({...userData, password: e.target.value})} className="bg-gray-800 border-gray-600" required={!isEditing} /></div>}
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="role">Tipo de Conta</Label>
                <select id="role" value={userData.role} onChange={(e) => setUserData({...userData, role: e.target.value})} className="w-full h-10 px-3 py-2 glass-effect border border-gray-600 rounded-md text-white bg-gray-800">
                  <option value="student">Estudante</option>
                  <option value="teacher">Professor</option>
                  <option value="manager">Gestor</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>
              <div>
                <Label htmlFor="company_id">Empresa</Label>
                <select id="company_id" value={userData.company_id || ''} onChange={(e) => setUserData({...userData, company_id: e.target.value || null})} className="w-full h-10 px-3 py-2 glass-effect border border-gray-600 rounded-md text-white bg-gray-800" disabled={userData.role === 'admin'}>
                  <option value="">Nenhuma (Admin Global)</option>
                  {companies.map(company => (
                    <option key={company.id} value={company.id}>{company.name}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <DialogFooter>
              <DialogClose asChild><Button type="button" variant="outline" className="glass-effect border-gray-600" disabled={formLoading}>Cancelar</Button></DialogClose>
              <Button type="submit" className="angola-gradient" disabled={formLoading}>
                {formLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditing ? 'Atualizar' : 'Criar'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagement;
