
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ShieldCheck, UserCog, PcCase as Case, GraduationCap, User } from 'lucide-react';
import { motion } from 'framer-motion';

const permissions = [
  {
    role: 'Administrador',
    icon: UserCog,
    color: 'text-red-400',
    description: 'Acesso total a todas as funcionalidades, empresas, utilizadores e conteúdos. O super-herói do sistema.',
    privileges: ['Gerir Tudo', 'Criar Empresas', 'Ver Todos os Dados']
  },
  {
    role: 'Gestor',
    icon: Case,
    color: 'text-cyan-400',
    description: 'Controla a sua própria empresa. Gere utilizadores (professores, estudantes) e conteúdos da sua organização.',
    privileges: ['Gerir Utilizadores da Empresa', 'Gerir Conteúdo da Empresa', 'Ver Progresso da Equipa']
  },
  {
    role: 'Professor',
    icon: GraduationCap,
    color: 'text-green-400',
    description: 'Cria e gere conteúdos de aprendizagem (cursos, quizzes) para a sua empresa.',
    privileges: ['Criar/Editar Cursos', 'Criar/Editar Quizzes', 'Ver Desempenho dos Estudantes']
  },
  {
    role: 'Estudante',
    icon: User,
    color: 'text-blue-400',
    description: 'O herói em formação. Acede aos cursos, completa desafios e sobe no ranking da sua empresa.',
    privileges: ['Aceder a Cursos', 'Realizar Quizzes', 'Ver Progresso Pessoal']
  }
];

const PermissionManagement = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Visão Geral das Permissões</h1>
        <p className="text-gray-400">Estes são os níveis de acesso que governam o SaloLearning.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {permissions.map((p, index) => (
          <motion.div 
            key={p.role}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="glass-effect border-2 border-yellow-400/30 h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <p.icon className={`w-8 h-8 ${p.color}`} />
                  <span className="text-2xl">{p.role}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-400">{p.description}</p>
                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-200">Privilégios Principais:</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-300">
                    {p.privileges.map(priv => <li key={priv}>{priv}</li>)}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

       <Card className="glass-effect p-6 border-2 border-blue-400/30">
        <div className="flex items-center gap-4">
          <ShieldCheck className="w-10 h-10 text-blue-400" />
          <div>
            <h3 className="text-xl font-bold">Segurança Multi-Empresa</h3>
            <p className="text-gray-400">Cada empresa funciona num ambiente isolado. Gestores, professores e estudantes só podem ver e interagir com dados da sua própria organização, garantindo total privacidade e segurança.</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default PermissionManagement;
