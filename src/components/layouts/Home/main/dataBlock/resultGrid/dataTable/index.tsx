import React, { useState, useEffect, useContext } from 'react';

import { motion, AnimatePresence } from 'framer-motion';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquarePen, faTrash } from '@fortawesome/free-solid-svg-icons';

import { ITableData, ISensorsData } from '../../../../../../../config/types';
import ChangeDataModal from '../../../../../../../utils/changeData';
import MessageBox from '../../../../../../../utils/modals/messageBox';

// Include hooks
import useHttp from '../../../../../../../hooks/http.hook';

// Config
import config from '../../../../../../../config/main.json';

import { AuthContext } from '../../../../../../../context/authContext';

const DataTable = (props: any) => {
  const auth = useContext(AuthContext);

  const [tableData, setTableData] = useState<ITableData[]>([]);

  const [activeData, setActiveData] = useState<ISensorsData>();
  const [isOpenForm, setIsOpenForm] = useState(false);

  const [isRemove, setIsRemove] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);
  const [isError, setIsError] = useState(false);
  const [message, setMessage] = useState('');

  // Деструктуризация пропсов
  const { sensorData, filterData } = props;

  const { request } = useHttp();

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

  // Click change data
  const changeDataHandler = (item: any) => {
    let data = Object.create(item);

    // Приводим message_arr_time к string формату
    const timestamp_message_arr_time = new Date(item.message_arr_time);
    const formatted_message_arr_time =
      timestamp_message_arr_time.toLocaleDateString('en-GB', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: 'numeric',
        minute: 'numeric',
      });

    //Приводим device_time к string формату
    const timestamp_device_time = new Date(item.device_time);
    const formatted_device_time = timestamp_device_time.toLocaleDateString(
      'en-GB',
      {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: 'numeric',
        minute: 'numeric',
      }
    );

    data.message_arr_time = formatted_message_arr_time;
    data.device_time = formatted_device_time;

    setActiveData(data);
    setIsOpenForm(true);
  };

  // Remove sensor event
  const removeSensor = (id: number) => {
    const fetchData = async () => {
      try {
        const url = `${config.URL}/api/removeSensor/${id}`;
        await request(url, 'DELETE', null);

        // Активируем статус "Удалено", чтобы в компоненте dataBlock выполнить перерисовку показаний
        props.isRemovedRow(true);

        // Чтобы сработал messageBox
        setIsRemove(true);
      } catch (err: any) {
        console.log(err);
      }
    };

    fetchData();
  };

  // Обработчик модального окна
  useEffect(() => {
    if (isRemove) {
      setMessage(`Показание удалено.`);
    }

    if (isUpdated) {
      setMessage(`Показание успешно было изменено.`);
    }

    const timer = setTimeout(() => {
      setIsRemove(false);
      setIsUpdated(false);
      setIsError(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, [isRemove, isUpdated, isError]);

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
          {auth.access_name !== 'Гость' && (
            <React.Fragment>
              <FontAwesomeIcon
                icon={faSquarePen}
                className='edit-icon dots-table-hidden'
              />
              <FontAwesomeIcon
                icon={faTrash}
                className='remove-icon dots-table-hidden'
              />
            </React.Fragment>
          )}
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
                  {new Date(item.device_time).toLocaleDateString('en-GB', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: 'numeric',
                    minute: 'numeric',
                  })}
                </span>
              </div>
              <div className='data-table__item'>
                <span className='data-table__text'>
                  {new Date(item.message_arr_time).toLocaleDateString('en-GB', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: 'numeric',
                    minute: 'numeric',
                  })}
                </span>
              </div>
              {auth.access_name !== 'Гость' && (
                <React.Fragment>
                  <FontAwesomeIcon
                    icon={faSquarePen}
                    className='edit-icon'
                    title='Изменить'
                    onClick={() => changeDataHandler(item)}
                  />
                  <FontAwesomeIcon
                    icon={faTrash}
                    className='remove-icon'
                    title='Удалить'
                    onClick={() => removeSensor(item.id)}
                  />
                </React.Fragment>
              )}
            </motion.div>
          ))}
        {(isRemove || isUpdated || isError) && (
          <MessageBox message={message} color={isError && 'error'} />
        )}
        {isOpenForm && (
          <ChangeDataModal
            isOpen={setIsOpenForm}
            activeData={activeData}
            isUpdatedData={setIsUpdated}
            isUpdatedRow={props.isUpdatedRow}
          />
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default DataTable;
