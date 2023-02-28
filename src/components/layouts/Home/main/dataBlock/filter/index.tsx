import React from 'react';

//import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
//import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

const Filter = () => {
  return (
    <div className='filter-block'>
      <div className='filter-block__date-from'>
        <span className='filter-block__date-from__text'>С</span>
        <input type='date' name='from-date' />
      </div>
      <div className='filter-block__date-to'>
        <span className='filter-block__date-to__text'>По</span>
        <input type='date' name='to-date' />
      </div>
      <button className='filter-block__apply-btn main-btn'>
        Применить фильтр
      </button>
    </div>
  );
};

export default Filter;
