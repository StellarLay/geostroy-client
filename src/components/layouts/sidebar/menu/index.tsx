import React from 'react';
import '../sidebar.scss';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHouse,
  faScrewdriverWrench,
  faRightFromBracket,
} from '@fortawesome/free-solid-svg-icons';

const Menu = () => {
  return (
    <nav className='menu-block'>
      <ul className='menu-block__inner'>
        <div className='menu-block__inner-main'>
          <li className='menu-block__li menu-active'>
            <FontAwesomeIcon icon={faHouse} className='menu-icon' />
            <span className='menu-block__li-text'>Главная</span>
          </li>
          <li className='menu-block__li'>
            <FontAwesomeIcon icon={faScrewdriverWrench} className='menu-icon' />
            <span className='menu-block__li-text'>Датчики</span>
          </li>
        </div>
        <div className='menu-block__inner-exit'>
          <li className='menu-block__li'>
            <FontAwesomeIcon icon={faRightFromBracket} className='menu-icon' />
            <span className='menu-block__li-text'>Выход</span>
          </li>
        </div>
      </ul>
    </nav>
  );
};

export default Menu;
