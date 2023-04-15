import React, { useState } from 'react';
import '../auth.scss';

// Font Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser,
  faEnvelope,
  faEye,
  faCircleCheck,
} from '@fortawesome/free-regular-svg-icons';
import { faLock } from '@fortawesome/free-solid-svg-icons';
import { faGithub, faVk, faTelegram } from '@fortawesome/free-brands-svg-icons';

import useHttp from '../../../hooks/http.hook';

const Registration = () => {
  // States
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordType, setPasswordType] = useState('password');
  const [isConfirmPassword, setIsConfirmPassword] = useState(false);

  const [regBtnStatus, setRegBtnStatus] = useState(false);
  const { error, request } = useHttp();
  const [isModal, setIsModal] = useState(false);

  // Переключаем вид пароля
  const passwordDown = () => setPasswordType('text');
  const passwordUp = () => setPasswordType('password');

  const changePassword = (e: any) => {
    setPassword(e.target.value);
  };

  // Ставим галочку, если подтвердили пароль
  const changeConfirmPassword = (e: any) => {
    if (e.target.value === password) {
      setIsConfirmPassword(true);
      setRegBtnStatus(true);
    } else {
      setIsConfirmPassword(false);
      setRegBtnStatus(false);
    }
  };

  return (
    <div className='reg-section'>
      <form className='reg-section__form'>
        <div className='reg-section__form__title-block'>
          <span className='reg-section__form-title'>Регистрация</span>
          <span className='reg-section__form-subtitle'>
            Создайте свой аккаунт
          </span>
        </div>
        <div className='reg-section__form-inputs'>
          <div className='reg-section__form-inputs__input'>
            <FontAwesomeIcon icon={faUser} className='user-icon' />
            <input
              id='form-username'
              type='text'
              name='username'
              placeholder='Имя пользователя'
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className='reg-section__form-inputs__input'>
            <FontAwesomeIcon icon={faEnvelope} className='mail-icon' />
            <input
              id='form-email'
              type='email'
              name='email'
              placeholder='E-mail'
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className='reg-section__form-inputs__input'>
            <FontAwesomeIcon icon={faLock} className='password-icon' />
            <input
              id='form-password'
              type={passwordType}
              name='password'
              placeholder='Пароль'
              onChange={(e) => changePassword(e)}
              value={password}
            />
            <FontAwesomeIcon
              icon={faEye}
              className='eye-icon'
              onMouseDown={passwordDown}
              onMouseUp={passwordUp}
            />
          </div>
          <div className='reg-section__form-inputs__input'>
            <input
              id='form-confirm-password'
              type='password'
              name='confirm-password'
              placeholder='Подтвердите пароль'
              onChange={(e) => changeConfirmPassword(e)}
            />

            {isConfirmPassword && (
              <FontAwesomeIcon icon={faCircleCheck} className='complete-icon' />
            )}
          </div>
        </div>
        <input
          className={!regBtnStatus ? 'disabled' : ''}
          type='submit'
          value='Зарегистрироваться'
        />
        <span className='reg-section__is-account'>
          Уже есть аккаунт? <a href='/'>Войти</a>
        </span>
        <div className='reg-section__social-media'>
          <FontAwesomeIcon icon={faGithub} className='social-icon' />
          <FontAwesomeIcon icon={faVk} className='social-icon' />
          <FontAwesomeIcon icon={faTelegram} className='social-icon' />
        </div>
      </form>
    </div>
  );
};

export default Registration;
