import React, { useContext } from 'react';
import '../sidebar.scss';

import { NavLink } from 'react-router-dom';

import { AuthContext } from '../../../../context/authContext';
import { useNavigate } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHouse,
  faUser,
  faGear,
  faRightFromBracket,
} from '@fortawesome/free-solid-svg-icons';

let menuItems = [
  {
    id: 1,
    name: 'Главная',
    icon: faHouse,
    href: '/',
    active: true,
  },
  {
    id: 2,
    name: 'Пользователи',
    icon: faUser,
    href: '/users',
    permission: ['Администратор'],
  },
  {
    id: 3,
    name: 'Настройки',
    icon: faGear,
    href: '/settings',
    permission: ['Администратор', 'Клиент'],
  },
];

const Menu = () => {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  const logoutHandler = (e: any) => {
    e.preventDefault();
    auth.logout();
    navigate('/');
  };

  return (
    <nav className='menu-block'>
      <ul className='menu-block__inner'>
        <div className='menu-block__inner-main'>
          {menuItems.map(
            (item) =>
              (item.name !== 'Пользователи' ||
                auth.access_name === 'Администратор') &&
              (item.name !== 'Настройки' ||
                auth.access_name === 'Администратор' ||
                auth.access_name === 'Клиент') && (
                <NavLink
                  to={item.href}
                  key={item.id}
                  className={({ isActive }) =>
                    isActive ? 'menu-block__li menu-active' : 'menu-block__li'
                  }
                >
                  <FontAwesomeIcon icon={item.icon} className='menu-icon' />
                  <span className='menu-block__li-text'>{item.name}</span>
                </NavLink>
              )
          )}
        </div>
        <div className='menu-block__inner-exit'>
          <li className='menu-block__li'>
            <FontAwesomeIcon icon={faRightFromBracket} className='menu-icon' />
            <a
              href='/'
              className='menu-block__li-text text-link'
              onClick={logoutHandler}
            >
              Выход
            </a>
          </li>
        </div>
      </ul>
    </nav>
  );
};

export default Menu;
