import React from 'react';
import './home.scss';

import { motion, AnimatePresence } from 'framer-motion';

// Components
import Header from './header';
import Footer from './footer';
import Main from './main';

const Home = (props: any) => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -10, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className='home-block'
      >
        <Header />
        <Main
          getSensorIdModal={props.getSensorIdModal}
          isSuccessAddData={props.isSuccessAddData}
        />
        <Footer />
      </motion.div>
    </AnimatePresence>
  );
};

export default Home;
