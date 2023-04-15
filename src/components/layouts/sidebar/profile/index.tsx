import React, { useContext } from 'react';
import '../sidebar.scss';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserAstronaut } from '@fortawesome/free-solid-svg-icons';

import { AuthContext } from '../../../../context/authContext';

const Profile = () => {
  const auth = useContext(AuthContext);

  return (
    <div className='profile-block'>
      <FontAwesomeIcon icon={faUserAstronaut} className='profile-icon' />
      <span className='profile-block__username'>{auth.email}</span>
      <span className='profile-block__role'>{auth.access_name}</span>
    </div>
  );
};

export default Profile;
