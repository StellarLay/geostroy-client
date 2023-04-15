import React, { useState, useEffect } from 'react';

import { motion, AnimatePresence } from 'framer-motion';

import { generate } from '@wcj/generate-password';

// Font Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-regular-svg-icons';

import Splashscreen from '../../layouts/splashscreen';
import { Link } from 'react-router-dom';

import config from '../../../config/main.json';
import useHttp from '../../../hooks/http.hook';

const ResetPass = () => {
  // States
  const [email, setEmail] = useState('');
  const [regBtnStatus, setRegBtnStatus] = useState(true);
  const [status, setStatus] = useState(false);
  const { request } = useHttp();

  // Send FORM
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    fetchData();
  };

  // Запрос на изменение пароля
  const fetchData = async () => {
    try {
      const url = `${config.URL}/auth/reset/`;
      const newpass = generate({
        length: 5,
        numeric: true,
      });

      await request(url, 'POST', { email, newpass });

      setStatus(true);
    } catch (e: any) {
      console.log(e.message);
    }
  };

  // Если поля не пустые, то активируем кнопку
  useEffect(() => {
    setRegBtnStatus(email ? true : false);
  }, [email]);

  return (
    <div className='auth-page'>
      <Splashscreen />
      <AnimatePresence>
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -10, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className='auth-section'
        >
          <form className='auth-section__form' onSubmit={handleSubmit}>
            <div className='auth-section__form__title-block'>
              <span className='auth-section__form-title'>Сброс пароля</span>
              <span className='auth-section__form-subtitle'>
                На указанный email придет новый пароль
              </span>
            </div>
            {!status ? (
              <React.Fragment>
                <div className='auth-section__form-inputs'>
                  <div className='auth-section__form-inputs__input'>
                    <FontAwesomeIcon icon={faEnvelope} className='mail-icon' />
                    <input
                      id='form-email'
                      type='email'
                      name='email'
                      placeholder='E-mail'
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <input
                  className={!regBtnStatus ? 'disabled' : ''}
                  type='submit'
                  value='Получить пароль'
                />
              </React.Fragment>
            ) : (
              <div className='success-reset-block'>
                <span className='success-message-reset'>
                  На электронный адрес {email} был выслан новый пароль
                </span>
              </div>
            )}
            <span
              className={`auth-section__is-account ${
                status && 'success-reset-back-btn'
              }`}
            >
              <Link to='/auth'>Назад</Link>
            </span>
          </form>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default ResetPass;
