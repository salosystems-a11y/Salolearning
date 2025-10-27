import React from 'react';
import { motion } from 'framer-motion';

const WelcomeMessage = () => {
  return (
    <motion.p
      className='text-xl md:text-2xl text-white max-w-2xl mx-auto'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.5 }}
    >
      Olá! Eu sou o <span className='font-semibold text-purple-300'>Horizons</span>, o seu companheiro de programação IA.
      Estou aqui para o ajudar a construir aplicações web incríveis!
    </motion.p>
  );
};

export default WelcomeMessage;