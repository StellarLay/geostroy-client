import React from 'react';
import Menu from './menu';
import Profile from './profile';

import './sidebar.scss';

const SideBar = () => {
  return (
    <div className='sidebar-container'>
      <div className='sidebar-block'>
        <Profile />
        <Menu />
      </div>
    </div>
  );
};

export default SideBar;
