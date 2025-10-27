
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useData } from '@/contexts/DataContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Plus, Search, User, Mail, Calendar, Edit, Trash2, Loader2, ShieldAlert, PcCase as Case, GraduationCap, UserCog } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

const RoleIcon = ({ role }) => {
  switch (role) {
    case 'admin':
      return <UserCog className="w-4 h-4 mr-2" />;
    case 'teacher':
      return <Case className="w-4 h-4 mr-2" />;
    case 'student':
      return <GraduationCap className="w-4 h-4 mr-2" />;
    default:
      return <User className="w-4 h-4 mr-2" />;
  }
};

const RoleBadge = ({ role }) => {
    let baseClasses = "inline-block px-3 py-1 rounded-full text-xs font-semibold ";
    switch (role) {
      case 'admin':
        return <span className={baseClasses + 'bg-red-500/20 text-red-400'}>Administrador</span>;
      case 'teacher':
        return <span className={baseClasses + 'bg-green-500/20 text-green-400'}>Professor</span>;
      case 'student':
        return <span className={baseClasses + 'bg-blue-500/20 text-blue-400'}>Estudante</span>;
      default:
        return <span className={baseClasses + 'bg-gray-500/20 text-gray-400'}>Desconhecido</span>;
    }
};

const UserManagement = () => {
  const { users, createUser, updateUser, deleteUser, deleteAllUsers, loading: dataLoading } = useData();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [isDeletingAll, setIsDeletingAll] = useState(false);

  const [userData, setUserData] = useState({ name: '', email: '', password: '', role: 'student' });

  const filteredUsers = users.filter(user =>
    (user.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (user.email?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  const openCreateDialog = () => {
    setIsEditing(false);
    setCurrentUser(null);
    setUserData({ name: '', email: '', password: '', role: 'student' });
    setShowDialog(true);
  };

  const openEditDialog = (user) => {
    setIsEditing(true);
    setCurrentUser(user);
    setUserData({ name: user.name, email: user.email, role: user.role, password: '' }); 
    setShowDialog(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);

    if (isEditing) {
      const updates = {
          name: userData.name,
          email: userData.email,
          role: userData.role,
      };
      const success = await updateUser(currentUser.id, updates);
      if(success) {
        toast({ title: "Utilizador atualizado!", description: `${userData.name} foi atualizado.` });
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
  
  const handleDeleteUser = (userId) => {
    const userToDelete = users.find(u => u.id === userId);
    if(userToDelete && userToDelete.email === 'edsoncanzele@gmail.com') {
      toast({ title: "Ação não permitida", description: "Não pode apagar o administrador principal.", variant: "destructive" });
      return;
    }
    deleteUser(userId).then(success => {
      if(success) {
        toast({ title: "Utilizador apagado!", description: "O utilizador foi removido com sucesso." });
      }
    });
  };

  const handleDeleteAllUsers = async () => {
    setIsDeletingAll(true);
    await deleteAllUsers();
    setIsDeletingAll(false);
  };

  if (dataLoading) {
    return (
        <div className="flex items-center justify-center h-full">
            <Loader2 className="w-8 h-8 animate-spin text-yellow-400" />
            <span className="ml-2">A carregar utilizadores...</span>
        </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold mb-2">Gestão de Utilizadores</h1>
          <p className="text-gray-400">Gerencie contas de estudantes, professores e administradores</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={openCreateDialog} className="angola-gradient">
            <Plus className="w-4 h-4 mr-2" /> Novo Utilizador
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" disabled={isDeletingAll}>
                {isDeletingAll ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Trash2 className="w-4 h-4 mr-2" />}
                Apagar Todos
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="glass-effect border-red-500/50">
              <AlertDialogHeader>
                <AlertDialogTitle>
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="text-red-400" />
                    Tem a certeza absoluta?
                  </div>
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Esta ação não pode ser desfeita. Isto irá apagar permanentemente todos os utilizadores, <strong>exceto a sua conta de administrador.</strong>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel asChild>
                    <Button variant="outline" className="glass-effect border-yellow-400/30">Cancelar</Button>
                </AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteAllUsers} className="bg-red-600 hover:bg-red-700">
                  Sim, apagar todos
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
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
            <Card className="glass-effect p-6 border-2 border-yellow-400/30 hover:border-yellow-400/50 transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{user.name || 'Nome não definido'}</h3>
                  <div className="flex items-center text-sm text-gray-400 capitalize">
                    <RoleIcon role={user.role} />
                    {user.role}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="ghost" size="icon" onClick={() => openEditDialog(user)} className="w-8 h-8"><Edit className="w-4 h-4" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDeleteUser(user.id)} className="w-8 h-8 text-red-400 hover:bg-red-500/10 hover:text-red-400"><Trash2 className="w-4 h-4" /></Button>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center text-gray-300"><Mail className="w-4 h-4 mr-2" /> {user.email}</div>
                <div className="flex items-center text-gray-300"><Calendar className="w-4 h-4 mr-2" /> {new Date(user.created_at).toLocaleDateString('pt-BR')}</div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-600">
                <RoleBadge role={user.role} />
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredUsers.length === 0 && !dataLoading && <Card className="glass-effect p-8 text-center border-2 border-yellow-400/30"><User className="w-12 h-12 mx-auto text-gray-400 mb-4" /><h3 className="text-xl font-semibold mb-2">Nenhum utilizador encontrado</h3><p className="text-gray-400">Crie um novo utilizador ou ajuste os termos de pesquisa.</p></Card>}

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="glass-effect border-yellow-400/30">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Editar Utilizador' : 'Criar Novo Utilizador'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div><Label htmlFor="name">Nome</Label><Input id="name" value={userData.name} onChange={(e) => setUserData({...userData, name: e.target.value})} className="glass-effect border-yellow-400/30" required /></div>
            <div><Label htmlFor="email">Email</Label><Input id="email" type="email" value={userData.email} onChange={(e) => setUserData({...userData, email: e.target.value})} className="glass-effect border-yellow-400/30" required disabled={isEditing} /></div>
            {!isEditing && <div><Label htmlFor="password">Senha</Label><Input id="password" type="password" value={userData.password} onChange={(e) => setUserData({...userData, password: e.target.value})} className="glass-effect border-yellow-400/30" required={!isEditing} /></div>}
            <div>
              <Label htmlFor="role">Tipo de Conta</Label>
              <select id="role" value={userData.role} onChange={(e) => setUserData({...userData, role: e.target.value})} className="w-full h-10 px-3 py-2 glass-effect border border-yellow-400/30 rounded-md text-white">
                <option value="student">Estudante</option>
                <option value="teacher">Professor</option>
                <option value="admin">Administrador</option>
              </select>
            </div>
            <DialogFooter>
              <DialogClose asChild><Button type="button" variant="outline" className="glass-effect border-yellow-400/30" disabled={formLoading}>Cancelar</Button></DialogClose>
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
