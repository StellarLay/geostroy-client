import { useState, useEffect } from 'react';

import Select from 'react-select';

import { customStylesSelectFilter } from '../../../../../../config/types';

const options = [
  { value: 'device_time', label: 'Время по устройству' },
  { value: 'message_arr_time', label: 'Время прихода сообщения' },
];

const Filter = (props: any) => {
  const [isDisabled, setIsDisabled] = useState(true);
  const [isFilter, setIsFilter] = useState(false);
  const [filterData, setFilterData] = useState({
    dateFrom: '',
    dateTo: '',
    field: '',
  });

  // Применяем фильтр
  const applyFilter = () => {
    setIsFilter(true);
    props.updateFilter(filterData);
  };

  // Очищаем фильтр
  const clearFilter = () => {
    setIsFilter(false);
    setFilterData({
      dateFrom: '',
      dateTo: '',
      field: '',
    });
    props.updateFilter({});
  };

  const handleChange = (e: any) => {
    // Если мы выбираем из select тип поля
    if (e.value === 'device_time' || e.value === 'message_arr_time') {
      setFilterData({ ...filterData, field: e.value });
    } else {
      setFilterData({ ...filterData, [e.target.name]: e.target.value });
    }
  };

  // Валидация полей фильтра
  useEffect(() => {
    if (
      filterData.dateFrom !== '' &&
      filterData.dateTo !== '' &&
      filterData.field !== ''
    ) {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
  }, [filterData]);

  return (
    <div className='filter-block'>
      <div className='filter-block__date-from'>
        <span className='filter-block__date-from__text'>С</span>
        <input
          type='date'
          value={filterData.dateFrom}
          name='dateFrom'
          onChange={(e) => handleChange(e)}
        />
      </div>
      <div className='filter-block__date-to'>
        <span className='filter-block__date-to__text'>По</span>
        <input
          type='date'
          value={filterData.dateTo}
          name='dateTo'
          onChange={(e) => handleChange(e)}
        />
      </div>
      <div className='filter-block__fields'>
        <Select
          options={options}
          onChange={(e) => handleChange(e)}
          className='select-filter-fields'
          styles={customStylesSelectFilter}
          placeholder='По полю'
          name='field'
        />
      </div>
      <button
        className={`filter-block__apply-btn main-btn ${
          isDisabled && 'disabled'
        }`}
        onClick={() => applyFilter()}
      >
        Применить
      </button>
      {isFilter && (
        <button
          className='filter-block__clear-btn main-btn'
          onClick={() => clearFilter()}
        >
          Очистить
        </button>
      )}
    </div>
  );
};

export default Filter;
