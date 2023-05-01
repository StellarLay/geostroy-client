import React from 'react';
import Menu from './menu';
import Profile from './profile';

import './sidebar.scss';

const SideBar = (props: any) => {
  return (
    <div
      className={`sidebar-container ${props.isActive ? 'show-sidebar' : ''}`}
    >
      <div className='sidebar-block'>
        <Profile />
        <Menu />
      </div>
    </div>
  );
};

export default SideBar;
