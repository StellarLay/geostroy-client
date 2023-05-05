import React, { useState, useEffect, useContext } from 'react';
import { CSVLink } from 'react-csv';

import useHttp from '../../../../../../../hooks/http.hook';
import config from '../../../../../../../config/main.json';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';

import {
  IPiezoDataProps,
  ISelectOptionsProps,
  customStylesSelect,
  ISensorsProps,
} from '../../../../../../../config/types';

import { AuthContext } from '../../../../../../../context/authContext';

import Select from 'react-select';

const ControlPanel = (props: any) => {
  const auth = useContext(AuthContext);

  const [headersForExcel, setHeadersForExcel] = useState([]);
  const [dataForExcel, setDataForExcel] = useState([]);
  const [piezoData, setPiezoData] = useState<IPiezoDataProps[]>([]);
  const [isUnbind, setIsUnbind] = useState(false);
  const [unbindSensorsData, setUnbindSensorsData] = useState<
    ISelectOptionsProps[]
  >([]);
  const [selectedSensor, setSelectedSensor] = useState(unbindSensorsData[0]);
  const [sensorName, setSensorName] = useState<ISensorsProps[]>([]);

  const { request } = useHttp();

  // Деструктуризация пропсов
  const {
    sensorData,
    activePiezo,
    updateBindSensorStatus,
    getSensorId,
    isChangedBindStatus,
    getSensorIdModal,
  } = props;

  // Клик на кнопку выгрузки в Excel (формируем таблицу)
  const clickExcelBtn = () => {
    // Названия столбцов
    let headers: any = [
      { label: 'Наименование датчика', key: 'sensor_name' },
      { label: 'Уровень по АЦП', key: 'adc_lvl' },
      { label: 'Уровень', key: 'lvl_m' },
      { label: 'Уровень + коррекция', key: 'lvl_m_corr' },
      { label: 'Напряжение на аккумуляторе', key: 'battery_voltage' },
      { label: 'Заряд аккумулятора в %', key: 'battery_charge' },
      { label: 'Код ошибки', key: 'error_code' },
      { label: 'Время по устройству', key: 'device_time' },
      { label: 'Время прихода сообщения', key: 'message_arr_time' },
      { label: 'Режим работы', key: 'working_mode' },
      { label: 'Время сна', key: 'sleep_time' },
    ];

    // Массив данных
    let newExcelArr: any = [];

    sensorData.forEach((item: any) => {
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

      newExcelArr.push({
        sensor_name: item.sensor_name,
        adc_lvl: item.adc_lvl,
        lvl_m: item.lvl_m,
        lvl_m_corr: item.lvl_m_corr,
        battery_voltage: item.battery_voltage,
        battery_charge: item.battery_charge,
        error_code: item.error_code,
        device_time: formatted_device_time,
        message_arr_time: formatted_message_arr_time,
        working_mode: item.working_mode,
        sleep_time: item.sleep_time,
      });

      setHeadersForExcel(headers);
      setDataForExcel(newExcelArr);
    });
  };

  // Запрос к БД (отвязываем датчик от выбранной скважины)
  const unBindFetch = async () => {
    try {
      const url = `${config.URL}/api/unbindSensor/${activePiezo.piezometer_id}`;
      await request(url, 'PUT');

      setIsUnbind(true);
    } catch (e) {
      console.log(e);
    }
  };

  // Клик "Отвязать датчик"
  const unbindSensorClick = () => {
    setIsUnbind(false);
    unBindFetch();
  };

  // Загружаем таблицу objects_piezomters_sensors
  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = `${config.URL}/api/getObjectsPiezoSensors/${activePiezo.piezometer_id}`;
        const data = await request(url, 'GET');

        setPiezoData(data);
      } catch (e) {
        console.log(e);
      }
    };

    fetchData();
  }, [request, activePiezo, isUnbind, isChangedBindStatus]);

  // Запрос к БД (получаем непривязанные датчики)
  useEffect(() => {
    // Для оптимизации будем создавать эффект только при выборе скважины БЕЗ датчика
    if (piezoData.length > 0) {
      if (piezoData[0].sensor_id === null) {
        const getUnBindSensors = async () => {
          try {
            const url = `${config.URL}/api/getUnbindSensors/`;
            const data = await request(url, 'GET');

            // Преобразуем полученные данные в массив (id, value, label) для компонента SELECT
            let sensorsOptions: ISelectOptionsProps[] = [];

            data.forEach((item: any) => {
              sensorsOptions.push({
                id: item.sensor_id,
                value: item.name,
                label: item.name,
              });
            });

            setUnbindSensorsData(sensorsOptions);
          } catch (e) {
            console.log(e);
          }
        };

        getUnBindSensors();
      }
    }
  }, [request, piezoData, isChangedBindStatus]);

  // Запрос к БД (получить имя привязанного датчика)
  useEffect(() => {
    // Для оптимизации будем создавать эффект только при выборе скважины БЕЗ датчика
    const fetchSensorName = async () => {
      try {
        const url = `${config.URL}/api/getSensorName/${piezoData[0].sensor_id}`;
        const data = await request(url, 'GET');

        setSensorName(data);
      } catch (e) {
        //console.log(e);
      }
    };

    fetchSensorName();
  }, [request, isUnbind, piezoData, isChangedBindStatus]);

  // Событие выбора непривязанного датчика
  const locationEvent = (event: any) => {
    setSelectedSensor(event.id);

    // Делаем кнопку "Привязать датчик" активной
    updateBindSensorStatus(false);

    // Передаем id выбранного датчика в resultGrid.tsx
    getSensorId(event.id);
  };

  // Клик "Добавить показание"
  const clickBindBtn = () => {
    const data = {
      piezo_id: piezoData[0].piezometer_id,
      sensor_id: piezoData[0].sensor_id,
    };

    // Передаем данные child -> parent в компонент App.tsx
    getSensorIdModal(data, true);
  };

  return (
    <div className='result-grid__control-block'>
      {piezoData.length > 0 &&
        (sensorName.length > 0 ? (
          <div className='info-sensor'>
            <span className='info-sensor__title'>Привязанный датчик</span>
            <span className='info-sensor__name'>{sensorName[0].name}</span>
            <div className='info-sensor__status'></div>
            {auth.access_name === 'Администратор' && (
              <span
                className='info-sensor__unbind-sensor'
                onClick={() => unbindSensorClick()}
              >
                Отвязать датчик
              </span>
            )}
          </div>
        ) : (
          auth.access_name === 'Администратор' && (
            <div className='info-sensor info-sensor-not'>
              <span className='info-sensor__title'>
                Датчик не прикреплён.
                {sensorData.length && (
                  <span> Предыдущий: {sensorData[0].sensor_name}</span>
                )}
              </span>
              {unbindSensorsData.length && (
                <Select
                  defaultValue={selectedSensor}
                  options={unbindSensorsData}
                  onChange={(option) => locationEvent(option)}
                  className='select-block'
                  styles={customStylesSelect}
                  placeholder='Выберите датчик'
                />
              )}
            </div>
          )
        ))}

      <div className='control-buttons'>
        {sensorName.length > 0 && auth.access_name !== 'Гость' && (
          <button
            className='main-btn add-info__btn'
            onClick={() => clickBindBtn()}
          >
            + Добавить показание
          </button>
        )}
        <CSVLink
          className='main-btn-white add-excel__btn'
          onClick={() => clickExcelBtn()}
          data={dataForExcel}
          headers={headersForExcel}
          filename={'data-sensors'}
          title='Выгрузить данные'
        >
          <FontAwesomeIcon icon={faDownload} className='download-icon' />
          Excel (.xlsx)
        </CSVLink>
      </div>
    </div>
  );
};

export default ControlPanel;
