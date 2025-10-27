
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: true,
    fallbackLng: 'pt',
    interpolation: {
      escapeValue: false,
    },
    resources: {
      pt: {
        translation: {
          landing: {
            title: "Transforme a Formação da sua Equipa",
            subtitle: "A plataforma gamificada que impulsiona resultados.",
            login: "Entrar",
            plansTitle: "Planos Flexíveis para a sua Empresa",
            monthly: "Mensal",
            annually: "Anual",
            cta: "Contratar Plano",
            phrases: [
              "Desbloqueie o potencial da sua equipa com desafios.",
              "Aprender nunca foi tão competitivo e divertido.",
              "Rankings em tempo real para motivar os seus consultores.",
              "Cursos e questionários personalizados para a sua empresa."
            ],
            plans: {
              basic: {
                title: "Equipa Essencial",
                users: "Até 10 utilizadores",
                price: "25.000 Kz",
                price_suffix: "/mês",
                annual_price: "ou 250.000 Kz/ano"
              },
              pro: {
                title: "Negócio Pro",
                users: "Até 50 utilizadores",
                price: "100.000 Kz",
                price_suffix: "/mês",
                annual_price: "ou 1.000.000 Kz/ano"
              },
              enterprise: {
                title: "Empresa Elite",
                users: "Mais de 50 utilizadores",
                price: "Contacto",
                price_suffix: "",
                annual_price: "Preço personalizado"
              }
            },
            form: {
                title: "Iniciar Subscrição",
                subtitle: "A nossa equipa entrará em contacto para finalizar o pagamento.",
                company_name: "Nome da Empresa",
                your_name: "Seu Nome (Gestor)",
                your_email: "Seu Email (Gestor)",
                submit: "Enviar Pedido",
                success_title: "Pedido Recebido!",
                success_message: "Obrigado! Entraremos em contacto em breve com os detalhes para pagamento por transferência bancária."
            },
            faq: {
              title: "Perguntas Frequentes",
              q1: "Como funciona a contratação?",
              a1: "Após escolher um plano e enviar o formulário, a nossa equipa comercial entrará em contacto para fornecer os dados para pagamento por transferência bancária e finalizar a sua subscrição.",
              q2: "O que acontece depois do pagamento?",
              a2: "Assim que o pagamento for confirmado, a sua conta de Gestor será ativada. Receberá um email com os seus dados de acesso para entrar na plataforma e começar a configurar a sua equipa.",
              q3: "Como adiciono os meus utilizadores?",
              a3: "Com o seu acesso de Gestor, terá um painel de controlo onde poderá criar, editar e remover os utilizadores (estudantes e professores) da sua empresa, de acordo com o limite do seu plano.",
              q4: "Posso personalizar os conteúdos?",
              a4: "Sim! Os Gestores e Professores podem criar cursos, questionários e tarefas personalizadas, adaptadas às necessidades de formação da sua equipa, tornando a aprendizagem relevante e eficaz."
            }
          }
        }
      },
      en: {
        translation: {
          landing: {
            title: "Transform Your Team's Training",
            subtitle: "The gamified platform that drives results.",
            login: "Login",
            plansTitle: "Flexible Plans for Your Company",
            monthly: "Monthly",
            annually: "Annually",
            cta: "Choose Plan",
            phrases: [
              "Unlock your team's potential with challenges.",
              "Learning has never been so competitive and fun.",
              "Real-time rankings to motivate your consultants.",
              "Custom courses and quizzes for your company."
            ],
            plans: {
              basic: {
                title: "Essential Team",
                users: "Up to 10 users",
                price: "AOA 25,000",
                price_suffix: "/month",
                annual_price: "or AOA 250,000/year"
              },
              pro: {
                title: "Business Pro",
                users: "Up to 50 users",
                price: "AOA 100,000",
                price_suffix: "/month",
                annual_price: "or AOA 1,000,000/year"
              },
              enterprise: {
                title: "Enterprise Elite",
                users: "50+ users",
                price: "Contact Us",
                price_suffix: "",
                annual_price: "Custom pricing"
              }
            },
            form: {
                title: "Start Subscription",
                subtitle: "Our team will contact you to finalize the payment.",
                company_name: "Company Name",
                your_name: "Your Name (Manager)",
                your_email: "Your Email (Manager)",
                submit: "Submit Request",
                success_title: "Request Received!",
                success_message: "Thank you! We will contact you shortly with details for payment via bank transfer."
            },
            faq: {
              title: "Frequently Asked Questions",
              q1: "How does the subscription work?",
              a1: "After choosing a plan and submitting the form, our sales team will contact you to provide the details for payment via bank transfer and finalize your subscription.",
              q2: "What happens after payment?",
              a2: "Once payment is confirmed, your Manager account will be activated. You will receive an email with your login credentials to access the platform and start setting up your team.",
              q3: "How do I add my users?",
              a3: "With your Manager access, you will have a dashboard where you can create, edit, and remove users (students and teachers) from your company, according to your plan's limit.",
              q4: "Can I customize the content?",
              a4: "Yes! Managers and Teachers can create custom courses, quizzes, and tasks tailored to your team's training needs, making learning relevant and effective."
            }
          }
        }
      }
    }
  });

export default i18n;
