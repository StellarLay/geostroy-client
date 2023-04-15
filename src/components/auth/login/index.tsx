import { useState, useEffect, useContext } from 'react';
import '../auth.scss';

import { motion, AnimatePresence } from 'framer-motion';

// Font Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-regular-svg-icons';
import { faLock } from '@fortawesome/free-solid-svg-icons';

// Components
import MessageBox from '../../../utils/modals/messageBox';

import config from '../../../config/main.json';
import useHttp from '../../../hooks/http.hook';

import { AuthContext } from '../../../context/authContext';
import { Link } from 'react-router-dom';

const Login = () => {
  const auth = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [regBtnStatus, setRegBtnStatus] = useState(true);
  const [isModal, setIsModal] = useState(false);
  const { request, error } = useHttp();

  // Если поля не пустые, то активируем кнопку входа
  useEffect(() => {
    setRegBtnStatus(email && password ? true : false);
  }, [email, password]);

  // Закрываем модалку через 3 секунды
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsModal(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, [isModal]);

  // Send FORM
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    fetchData();
  };

  // Запрос на получение юзера
  const fetchData = async () => {
    try {
      const url = `${config.URL}/auth/login/`;
      const data = await request(url, 'POST', { email, password });

      auth.login(
        data.accessToken,
        data.refreshToken,
        data.id,
        data.access_lvl,
        data.email,
        data.access_name
      );
    } catch (e: any) {
      setIsModal(true);
    }
  };

  return (
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
            <span className='auth-section__form-title'>Авторизация</span>
            <span className='auth-section__form-subtitle'>
              Войдите в свой аккаунт
            </span>
          </div>
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
            <div className='auth-section__form-inputs__input'>
              <FontAwesomeIcon icon={faLock} className='password-icon' />
              <input
                id='form-password'
                type='password'
                name='password'
                placeholder='Пароль'
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                autoComplete='on'
              />
            </div>
          </div>
          <input
            className={!regBtnStatus ? 'disabled' : ''}
            type='submit'
            value='Войти'
          />
          <span className='auth-section__is-account'>
            Забыли пароль? <Link to='/reset'>Восстановить</Link>
          </span>
        </form>
        {isModal && <MessageBox message={error} color='error' />}
      </motion.div>
    </AnimatePresence>
  );
};

export default Login;
