import React from 'react';
import './splash.scss';

import Logo from '../../../assets/img/logo.svg';

const SplashScreen = () => {
  return (
    <div className='splashscreen'>
      <div className='splashscreen__title-block'>
        <h1 className='splashscreen__title'>Геострой</h1>
        <span className='splashscreen__sub-title'>
          Удобные инструменты для эффективной работы с датчиками!
        </span>
      </div>
      <p className='splashscreen__description'>
        Добро пожаловать в систему отслеживания показаний, здесь вы можете
        посмотреть значения уровня воды в скважинах по объектам
      </p>
      <img className='splashscreen__logo' src={Logo} alt='logo' />
    </div>
  );
};

export default React.memo(SplashScreen);
