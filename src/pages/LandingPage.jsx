
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Users, Zap, Gem, Mail, MessageCircle, Loader2, ChevronDown, PlayCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { useData } from '@/contexts/DataContext';
import { useToast } from '@/components/ui/use-toast';

const AccordionItem = ({ q, a, videoSrc }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b-2 border-yellow-400/20 py-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center text-left text-lg font-semibold"
      >
        <span>{q}</span>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
          <ChevronDown />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0, marginTop: 0 }}
            animate={{ height: 'auto', opacity: 1, marginTop: '16px' }}
            exit={{ height: 0, opacity: 0, marginTop: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <p className="text-gray-300 pb-4">{a}</p>
            {videoSrc && (
                 <div className="aspect-video rounded-lg overflow-hidden relative group cursor-pointer border-2 border-yellow-400/30">
                    <video
                        src={videoSrc}
                        className="w-full h-full object-cover"
                        autoPlay
                        loop
                        muted
                        playsInline
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <PlayCircle className="w-16 h-16 text-white" />
                    </div>
                </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [isEnglish, setIsEnglish] = useState(i18n.language.startsWith('en'));

  const toggleLanguage = () => {
    const newLang = isEnglish ? 'pt' : 'en';
    i18n.changeLanguage(newLang);
    setIsEnglish(!isEnglish);
  };

  return (
    <div className="flex items-center space-x-2">
      <span className={`text-sm font-medium ${!isEnglish ? 'text-white' : 'text-gray-400'}`}>PT</span>
      <Switch checked={isEnglish} onCheckedChange={toggleLanguage} />
      <span className={`text-sm font-medium ${isEnglish ? 'text-white' : 'text-gray-400'}`}>EN</span>
    </div>
  );
};

const ContactBubbles = () => {
  return (
    <div className="fixed bottom-5 right-5 flex flex-col gap-3 z-50">
      <a href="https://wa.me/244926778213" target="_blank" rel="noopener noreferrer" className="p-4 rounded-full bg-green-500 text-white shadow-lg hover:bg-green-600 transition-all transform hover:scale-110">
        <MessageCircle className="w-6 h-6" />
      </a>
      <a href="mailto:comercial@salotf.com" className="p-4 rounded-full bg-blue-500 text-white shadow-lg hover:bg-blue-600 transition-all transform hover:scale-110">
        <Mail className="w-6 h-6" />
      </a>
    </div>
  );
};

const SubscriptionForm = ({ plan, onOpenChange, open }) => {
    const { t } = useTranslation();
    const { createSubscriptionRequest } = useData();
    const [formData, setFormData] = useState({ companyName: '', managerName: '', managerEmail: '' });
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const subData = {
            company_name: formData.companyName,
            manager_email: formData.managerEmail,
            plan_name: plan.key,
            max_users: plan.users,
            price_kwanza: parseFloat(plan.rawPrice),
            billing_cycle: 'monthly'
        };

        const result = await createSubscriptionRequest(subData);
        setLoading(false);
        if (result) {
            onOpenChange(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="glass-effect border-yellow-400/30 text-white">
                <DialogHeader>
                    <DialogTitle>{t('landing.form.title')} - {plan.title}</DialogTitle>
                    <p className="text-sm text-gray-400">{t('landing.form.subtitle')}</p>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="companyName">{t('landing.form.company_name')}</Label>
                        <Input id="companyName" value={formData.companyName} onChange={(e) => setFormData({...formData, companyName: e.target.value})} className="bg-white/10 border-yellow-400/30 text-white" required />
                    </div>
                     <div>
                        <Label htmlFor="managerName">{t('landing.form.your_name')}</Label>
                        <Input id="managerName" value={formData.managerName} onChange={(e) => setFormData({...formData, managerName: e.target.value})} className="bg-white/10 border-yellow-400/30 text-white" required />
                    </div>
                    <div>
                        <Label htmlFor="managerEmail">{t('landing.form.your_email')}</Label>
                        <Input id="managerEmail" type="email" value={formData.managerEmail} onChange={(e) => setFormData({...formData, managerEmail: e.target.value})} className="bg-white/10 border-yellow-400/30 text-white" required />
                    </div>
                    <DialogFooter>
                        <DialogClose asChild><Button type="button" variant="outline" className="text-white border-white/50 hover:bg-white/10" disabled={loading}>Cancelar</Button></DialogClose>
                        <Button type="submit" className="angola-gradient" disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {t('landing.form.submit')}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

const PricingCard = ({ planKey, icon, bestValue = false, onCtaClick }) => {
  const { t } = useTranslation();
  const plan = t(`landing.plans.${planKey}`, { returnObjects: true });

  return (
    <motion.div
      whileHover={{ y: -10 }}
      className={`relative glass-effect p-8 rounded-2xl border-2 ${bestValue ? 'border-yellow-400' : 'border-yellow-400/30'} flex flex-col`}
    >
      {bestValue && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1 bg-yellow-400 text-black font-bold text-sm rounded-full">
          POPULAR
        </div>
      )}
      <div className="text-center flex-grow">
        <div className="inline-block p-4 bg-white/10 rounded-xl mb-4">{icon}</div>
        <h3 className="text-2xl font-bold mb-2">{plan.title}</h3>
        <p className="text-gray-400 mb-6">{plan.users}</p>
        <p className="text-5xl font-bold mb-2">{plan.price}<span className="text-lg font-normal text-gray-400">{plan.price_suffix}</span></p>
        <p className="text-gray-400 text-sm mb-6">{plan.annual_price}</p>
      </div>
      <Button onClick={onCtaClick} className="w-full angola-gradient text-lg py-6 mt-auto">{t('landing.cta')}</Button>
    </motion.div>
  );
};

const LandingPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  const planDetails = {
    basic: { key: 'basic', users: 10, rawPrice: 25000 },
    pro: { key: 'pro', users: 50, rawPrice: 100000 },
    enterprise: { key: 'enterprise', users: 999, rawPrice: 0 } // Custom price
  };

  const handlePlanClick = (planKey) => {
    const plan = {
      ...planDetails[planKey],
      title: t(`landing.plans.${planKey}.title`),
    }
    setSelectedPlan(plan);
    setShowForm(true);
  };
  
  useEffect(() => {
    const phrases = t('landing.phrases', { returnObjects: true });
    if (!Array.isArray(phrases)) return;
    const interval = setInterval(() => {
      setPhraseIndex((prevIndex) => (prevIndex + 1) % phrases.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [t]);

  return (
    <div className="min-h-screen w-full overflow-x-hidden text-white p-6 relative">
      <header className="flex justify-between items-center mb-20">
        <img src="https://horizons-cdn.hostinger.com/39c5c6ac-23b8-4cfd-832b-f768f14b3976/e9b6a5897c5586a83ca9aada5238b2d2.png" alt="SaloLearning Logo" className="h-12 w-auto" />
        <div className="flex items-center gap-6">
          <LanguageSwitcher />
          <Button onClick={() => navigate('/login')} className="angola-gradient font-bold hidden sm:flex">
            {t('landing.login')}
          </Button>
        </div>
      </header>

      <main className="text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-6xl font-extrabold mb-4 bg-gradient-to-r from-angola-red via-white to-angola-yellow bg-clip-text text-transparent"
        >
          {t('landing.title')}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg md:text-xl text-gray-300 mb-8"
        >
          {t('landing.subtitle')}
        </motion.p>

        <div className="h-8 mb-12 relative">
          <AnimatePresence mode="wait">
            <motion.p
              key={phraseIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="text-yellow-400 text-lg font-medium absolute w-full left-0"
            >
              {Array.isArray(t('landing.phrases', { returnObjects: true })) && t('landing.phrases', { returnObjects: true })[phraseIndex]}
            </motion.p>
          </AnimatePresence>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Button onClick={() => navigate('/login')} className="angola-gradient font-bold text-xl py-6 px-10 sm:hidden">
            {t('landing.login')}
          </Button>
        </motion.div>

        <section id="plans" className="pt-20">
          <h2 className="text-3xl md:text-4xl font-bold mb-12">{t('landing.plansTitle')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <PricingCard
              planKey="basic"
              icon={<Users className="w-8 h-8 text-yellow-400" />}
              onCtaClick={() => handlePlanClick('basic')}
            />
            <PricingCard
              planKey="pro"
              icon={<Zap className="w-8 h-8 text-yellow-400" />}
              bestValue={true}
              onCtaClick={() => handlePlanClick('pro')}
            />
            <PricingCard
              planKey="enterprise"
              icon={<Gem className="w-8 h-8 text-yellow-400" />}
              onCtaClick={() => handlePlanClick('enterprise')}
            />
          </div>
        </section>

        <section id="faq" className="py-20 max-w-4xl mx-auto text-left">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">{t('landing.faq.title')}</h2>
            <div className="space-y-4">
                <AccordionItem q={t('landing.faq.q1')} a={t('landing.faq.a1')} />
                <AccordionItem q={t('landing.faq.q2')} a={t('landing.faq.a2')} />
                <AccordionItem 
                  q={t('landing.faq.q3')} 
                  a={t('landing.faq.a3')}
                  videoSrc="https://horizons-cdn.hostinger.com/39c5c6ac-23b8-4cfd-832b-f768f14b3976/a4e0c4a4e1d51a2d4807661b69739cae.mp4"
                />
                <AccordionItem 
                  q={t('landing.faq.q4')} 
                  a={t('landing.faq.a4')} 
                  videoSrc="https://horizons-cdn.hostinger.com/39c5c6ac-23b8-4cfd-832b-f768f14b3976/15b139a032223c14a1f59265f0a0d643.mp4"
                />
            </div>
        </section>
      </main>
      <ContactBubbles />
      {selectedPlan && <SubscriptionForm plan={selectedPlan} open={showForm} onOpenChange={setShowForm} />}
    </div>
  );
};

export default LandingPage;
