import React from 'react';

import '../../modal.scss';

import { motion, AnimatePresence } from 'framer-motion';

const MessageBox = (props: any) => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -10, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className={`message-box ${props.color === 'error' && 'error-color'}`}
      >
        <span className='message-box__text'>{props.message}</span>
      </motion.div>
    </AnimatePresence>
  );
};

export default MessageBox;
