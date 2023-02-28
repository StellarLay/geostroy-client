import React, { useState, useEffect, useRef, useCallback } from 'react';

// Components
import Filter from './filter';
import ResultGrid from './resultGrid';

import useHttp from '../../../../../hooks/http.hook';
import config from '../../../../../config/main.json';
import { ISensorsProps } from '../../../../../config/types';

const DataBlock = (props: any) => {
  const [sensor, setSensor] = useState<ISensorsProps[]>([]);
  const [isUpdateData, setIsUpdateData] = useState(false);

  const { request } = useHttp();

  // Деструктуризация пропсов
  const { activePiezo, getSensorIdModal, isSuccessAddData } = props;

  // При привязке датчика обновляем таблицу
  const updateData = useCallback((value: boolean) => {
    setIsUpdateData(value);
  }, []);

  const isFirstRun = useRef(true);
  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }

    const fetchData = async () => {
      try {
        const url = `${config.URL}/api/getSensors/${activePiezo.id}`;
        const data = await request(url, 'GET');

        setSensor(data);
      } catch (e) {
        console.log(e);
      }
    };

    fetchData();
  }, [request, activePiezo, isUpdateData, getSensorIdModal, isSuccessAddData]);

  return (
    <div className='data-block'>
      <Filter />
      {Object.keys(activePiezo).length !== 0 ? (
        <ResultGrid
          sensorData={sensor}
          activePiezo={activePiezo}
          updateData={updateData}
          getSensorIdModal={getSensorIdModal}
        />
      ) : (
        <div className='result-grid result-grid__disable'>
          <span>Датчик не выбран / не привязан</span>
        </div>
      )}
    </div>
  );
};

export default DataBlock;
