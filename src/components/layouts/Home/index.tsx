import React from 'react';
import './home.scss';

import { motion, AnimatePresence } from 'framer-motion';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

// Components
import Header from './header';
import Footer from './footer';
import Main from './main';

const Home = (props: any) => {
  const { showSidebar, setShowSidebar } = props;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -10, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className='home-block'
      >
        <FontAwesomeIcon
          icon={faBars}
          className='menu-burger-icon'
          onClick={() => setShowSidebar(showSidebar ? false : true)}
        />
        <Header />
        <Main
          getSensorIdModal={props.getSensorIdModal}
          isSuccessAddData={props.isSuccessAddData}
          isAddedPiezo={props.isAddedPiezo}
          isAddedPiezoMsg={props.isAddedPiezoMsg}
        />
        <Footer />
      </motion.div>
    </AnimatePresence>
  );
};

export default Home;
