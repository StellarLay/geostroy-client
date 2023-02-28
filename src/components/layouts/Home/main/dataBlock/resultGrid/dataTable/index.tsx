import React, { useState, useEffect } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';

import { ITableData } from '../../../../../../../config/types';

const DataTable = (props: any) => {
  const [tableData, setTableData] = useState<ITableData[]>([]);

  // Деструктуризация пропсов
  const { sensorData } = props;

  const tableHeaders = [
    {
      id: 1,
      title: 'Датчик',
      subtitle: 'название',
    },
    {
      id: 2,
      title: 'Уровень',
      subtitle: 'метров',
    },
    {
      id: 3,
      title: 'Уровень + коррекция',
      subtitle: 'метров',
    },
    {
      id: 4,
      title: 'Время по устройству',
      subtitle: 'd/m/y, h/m/s',
    },
    {
      id: 5,
      title: 'Время прихода сообщения',
      subtitle: 'd/m/y, h/m/s',
    },
  ];

  // Загружаем данные о показателях с пропса в стейт
  useEffect(() => {
    setTableData(sensorData);
  }, [sensorData]);

  return (
    <div className='data-table'>
      <div className='data-table__row data-table__row-caption'>
        {tableHeaders.map((header) => (
          <div key={header.id} className='data-table__th-item'>
            <span className='data-table__th-title'>{header.title}</span>
            <span className='data-table__th-subtitle'>{header.subtitle}</span>
          </div>
        ))}
        <FontAwesomeIcon
          icon={faEllipsisVertical}
          className='dots-vertical-icon dots-table-hidden'
          title='Настроить'
        />
      </div>
      {tableData &&
        tableData.map((item) => (
          <div key={item.id} className='data-table__row'>
            <div className='data-table__item'>
              <span className='data-table__text'>{item.sensor_name}</span>
            </div>
            <div className='data-table__item'>
              <span className='data-table__text'>{item.lvl_m}</span>
            </div>
            <div className='data-table__item'>
              <span className='data-table__text'>{item.lvl_m_corr}</span>
            </div>
            <div className='data-table__item'>
              <span className='data-table__text'>{item.device_time}</span>
            </div>
            <div className='data-table__item'>
              <span className='data-table__text'>
                {new Date(item.message_arr_time).toLocaleDateString() +
                  ', ' +
                  new Date(item.message_arr_time).toLocaleTimeString()}
              </span>
            </div>
            <FontAwesomeIcon
              icon={faEllipsisVertical}
              className='dots-vertical-icon'
              title='Настроить'
            />
          </div>
        ))}
    </div>
  );
};

export default DataTable;
