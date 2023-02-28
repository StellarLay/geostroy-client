import React, { useState, useEffect, useRef } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';

import useHttp from '../../../../../hooks/http.hook';
import config from '../../../../../config/main.json';
import { IPiezometersProps } from '../../../../../config/types';

const activeClass = 'table-item__active';

const PiezometersBlock = (props: any) => {
  const [piezometers, setPiezometers] = useState<IPiezometersProps[]>([]);
  const { request } = useHttp();

  // Деструктуризация пропсов
  const { activeObject, updateActivePiezometer } = props;

  const [activePiezo, setActivePiezo] = useState<IPiezometersProps>();

  // Skip first render with useRef
  const isFirstRun = useRef(true);
  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }

    const fetchData = async () => {
      try {
        const url = `${config.URL}/api/getPiezometers/${activeObject.id}`;
        const data = await request(url, 'GET');

        setPiezometers(data);
      } catch (e) {
        console.log(e);
      }
    };

    fetchData();
  }, [request, activeObject]);

  const selectActivePiezometer = (e: any, id: number) => {
    const filter = piezometers.filter((item) => item.id === id);
    updateActivePiezometer(filter[0]);
    setActivePiezo(filter[0]);
  };

  return (
    <div className='table-block piezometers-block'>
      <div className='table-caption'>
        <span>Пьезометр</span>
      </div>
      <div className='table-items'>
        {piezometers.length ? (
          piezometers.map((item) => (
            <div
              key={item.id}
              className={`table-item ${activePiezo === item && activeClass}`}
              onClick={(e) => selectActivePiezometer(e, item.id)}
            >
              <span className='table-item__text'>{item.name}</span>
              <FontAwesomeIcon
                icon={faEllipsisVertical}
                className='dots-vertical-icon'
                title='Параметры'
              />
            </div>
          ))
        ) : (
          <div>
            {activeObject.id !== undefined ? (
              <span className='table-item__text'>Нет</span>
            ) : (
              <span className='table-item__text'>Не выбран объект</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PiezometersBlock;
