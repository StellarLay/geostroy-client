import React, { useState, useCallback, useContext } from 'react';

import useHttp from '../../../../../../hooks/http.hook';
import config from '../../../../../../config/main.json';

// Components
import StatusPanel from './statusPanel';
import ControlPanel from './controlPanel';
import DataTable from './dataTable';

import { AuthContext } from '../../../../../../context/authContext';

const ResultGrid = (props: any) => {
  const auth = useContext(AuthContext);

  const { request } = useHttp();

  const [isBindSensorStatus, setIsBindSensorStatus] = useState(true);
  const [isClickBindBtn, setIsClickBindBtn] = useState(false);

  const [sensorId, setSensorId] = useState(null);

  // Деструктуризация пропсов
  const { sensorData, activePiezo, getSensorIdModal, filterData } = props;

  // Отлавливаем активный объект (через useCallBack заходим только при изменении значения)
  const updateBindSensor = useCallback((value: boolean) => {
    setIsBindSensorStatus(value);
  }, []);

  // Запрос к БД (привязка датчика к скважине)
  const SensorToPiezoFetch = async () => {
    try {
      const url = `${config.URL}/api/addSensorToPiezo/${activePiezo.piezometer_id}/${sensorId}`;
      await request(url, 'PUT');

      updateBindSensor(true);
      setIsClickBindBtn(false);
    } catch (e) {
      console.log(e);
    }
  };

  // Клик на кнопку "Привязать датчик"
  const bindBtnClick = () => {
    SensorToPiezoFetch();
    setIsClickBindBtn(true);
  };

  return (
    <div className='result-grid'>
      <div className='result-grid__top-block'>
        {auth.access_name === 'Администратор' && (
          <button
            className={`main-btn bind-sensor__btn ${
              isBindSensorStatus && 'disabled'
            }`}
            onClick={() => bindBtnClick()}
          >
            Привязать датчик
          </button>
        )}

        <StatusPanel sensorData={sensorData} />
      </div>
      <ControlPanel
        sensorData={sensorData}
        activePiezo={activePiezo}
        updateBindSensorStatus={updateBindSensor}
        getSensorId={setSensorId}
        isChangedBindStatus={isClickBindBtn}
        getSensorIdModal={getSensorIdModal}
      />
      <DataTable
        sensorData={sensorData}
        filterData={filterData}
        isUpdatedRow={props.isUpdatedRow}
        isRemovedRow={props.isRemovedRow}
      />
    </div>
  );
};

export default ResultGrid;
