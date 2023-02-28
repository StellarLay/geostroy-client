import React from 'react';
import '../sidebar.scss';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserAstronaut } from '@fortawesome/free-solid-svg-icons';

const Profile = () => {
  return (
    <div className='profile-block'>
      <FontAwesomeIcon icon={faUserAstronaut} className='profile-icon' />
      <span className='profile-block__username'>Ваш логин</span>
      <span className='profile-block__role'>Администратор</span>
    </div>
  );
};

export default Profile;
