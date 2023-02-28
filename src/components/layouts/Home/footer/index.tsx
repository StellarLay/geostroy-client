import React from 'react';

import config from '../../../../config/main.json';

const Footer = () => {
  return (
    <footer className='home-block__footer'>
      <span className='home-block__footer-copyright'>
        © 2023 ГеостройПроект. Все права защищены.
      </span>
      <span className='home-block__footer-version'>{config.version}</span>
    </footer>
  );
};

export default Footer;
