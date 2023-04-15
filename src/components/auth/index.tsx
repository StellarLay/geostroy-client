import React from 'react';

import './auth.scss';
import './media.scss';

// Components
import Splashscreen from '../layouts/splashscreen';
import Login from './login';

//import Registration from './Registration';

const Auth = () => {
  return (
    <div className='auth-page'>
      <Splashscreen />
      <Login />
    </div>
  );
};

export default Auth;
