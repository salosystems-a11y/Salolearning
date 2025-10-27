
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useData } from '@/contexts/DataContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Plus, Search, Building, Loader2, Calendar } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';

const CompanyManagement = () => {
  const { companies, createCompany, loading: dataLoading } = useData();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [companyName, setCompanyName] = useState('');

  const filteredCompanies = companies.filter(company =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!companyName.trim()) {
      toast({ title: 'Nome inválido', description: 'O nome da empresa não pode estar vazio.', variant: 'destructive' });
      return;
    }
    setFormLoading(true);
    const newCompany = await createCompany({ name: companyName });
    if (newCompany) {
      setShowDialog(false);
      setCompanyName('');
    }
    setFormLoading(false);
  };

  if (dataLoading && companies.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-yellow-400" />
        <span className="ml-2">A carregar empresas...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold mb-2">Gestão de Empresas</h1>
          <p className="text-gray-400">Crie e administre as empresas dos seus clientes.</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button onClick={() => setShowDialog(true)} className="angola-gradient">
            <Plus className="w-4 h-4 mr-2" /> Nova Empresa
          </Button>
        </div>
      </div>

      <Card className="glass-effect p-4 border-2 border-yellow-400/30">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input placeholder="Pesquisar empresas..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 glass-effect border-gray-600 bg-gray-800" />
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCompanies.map((company, index) => (
          <motion.div key={company.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
            <Card className="glass-effect p-6 border-2 border-yellow-400/30 hover:border-yellow-400/50 transition-all h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-cyan-500/20 rounded-lg">
                    <Building className="w-6 h-6 text-cyan-400" />
                  </div>
                  <h3 className="font-semibold text-xl text-cyan-300">{company.name}</h3>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-600 flex items-center justify-between text-xs text-gray-400">
                <div className="flex items-center gap-2">
                  <Calendar className="w-3 h-3"/>
                  <span>Criada em:</span>
                </div>
                <span>{new Date(company.created_at).toLocaleDateString('pt-BR')}</span>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredCompanies.length === 0 && !dataLoading && (
        <Card className="glass-effect p-8 text-center border-2 border-yellow-400/30">
          <Building className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Nenhuma empresa encontrada</h3>
          <p className="text-gray-400">Crie a sua primeira empresa para começar a adicionar clientes.</p>
        </Card>
      )}

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="glass-effect border-yellow-400/30 text-white">
          <DialogHeader>
            <DialogTitle>Criar Nova Empresa</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div>
              <Label htmlFor="companyName">Nome da Empresa</Label>
              <Input 
                id="companyName" 
                value={companyName} 
                onChange={(e) => setCompanyName(e.target.value)} 
                className="bg-gray-800 border-gray-600" 
                required 
                placeholder="Ex: Angola Cables"
              />
            </div>
            <DialogFooter>
              <DialogClose asChild><Button type="button" variant="outline" className="glass-effect border-gray-600" disabled={formLoading}>Cancelar</Button></DialogClose>
              <Button type="submit" className="angola-gradient" disabled={formLoading}>
                {formLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Criar Empresa
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CompanyManagement;
