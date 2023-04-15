import { useState, useEffect } from 'react';

import { motion, AnimatePresence } from 'framer-motion';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';

import { ITableData } from '../../../../../../../config/types';

const DataTable = (props: any) => {
  const [tableData, setTableData] = useState<ITableData[]>([]);

  // Деструктуризация пропсов
  const { sensorData, filterData } = props;

  // Заголовки таблицы
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

  // Фильтр таблицы
  useEffect(() => {
    // Если в фильтре есть данные
    if (Object.keys(filterData).length !== 0) {
      let filter;
      // Если фильтруем по полю "Время по устройству"
      if (filterData.field === 'device_time') {
        filter = sensorData.filter(
          (f: any) =>
            f.device_time > filterData.dateFrom &&
            f.device_time < filterData.dateTo
        );
      }

      // Иначе фильтруем по полю "Время прихода сообщения"
      else {
        filter = sensorData.filter(
          (f: any) =>
            f.message_arr_time > filterData.dateFrom &&
            f.message_arr_time < filterData.dateTo
        );
      }

      setTableData(filter);
    }

    // Иначе очищаем фильтр
    else {
      setTableData(sensorData);
    }
  }, [filterData, sensorData]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -10, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className='data-table'
      >
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
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              transition={{ duration: 0.3 }}
              key={item.id}
              className='data-table__row'
            >
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
                <span className='data-table__text'>
                  {new Date(item.device_time).toLocaleDateString() +
                    ', ' +
                    new Date(item.device_time).toLocaleTimeString()}
                </span>
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
            </motion.div>
          ))}
      </motion.div>
    </AnimatePresence>
  );
};

export default DataTable;
