import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

const Header = () => {
  return (
    <header className='home-block__header'>
      <div className='home-block__header-search'>
        <FontAwesomeIcon icon={faSearch} className='search-icon' />
        <input
          type='search'
          name='search'
          className='search-input'
          placeholder='Введите название объекта или скважины...'
        />
      </div>
    </header>
  );
};

export default Header;
