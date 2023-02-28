import React, { useState, useEffect } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';

import useHttp from '../../../../../hooks/http.hook';

import config from '../../../../../config/main.json';
import { IObjectsProps } from '../../../../../config/types';

const activeClass = 'table-item__active';

const ObjectsBlock = (props: any) => {
  const [objects, setObjects] = useState<IObjectsProps[]>([]);
  const { request } = useHttp();

  // Деструктуризация пропсов
  const { updateActiveObject } = props;

  const [activeObject, setActiveObject] = useState<IObjectsProps>();

  // Загружаем объекты
  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = `${config.URL}/api/getObjects`;
        const data = await request(url, 'GET');

        // Сохраняем в стейт массив объектов
        setObjects(data);
      } catch (e) {
        console.log(e);
      }
    };

    fetchData();
  }, [request, updateActiveObject]);

  const selectActiveObject = (e: any, id: number) => {
    const filter = objects.filter((item) => item.id === id);
    setActiveObject(filter[0]);
    updateActiveObject(filter[0]);
  };

  return (
    <div className='table-block objects-block'>
      <div className='table-caption'>
        <span>Объект</span>
      </div>
      <div className='table-items'>
        {objects.map((item) => (
          <div
            key={item.id}
            className={`table-item ${activeObject === item && activeClass}`}
            onClick={(e) => selectActiveObject(e, item.id)}
          >
            <span className='table-item__text'>{item.name}</span>
            <FontAwesomeIcon
              icon={faEllipsisVertical}
              className='dots-vertical-icon'
              title='Параметры'
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ObjectsBlock;
