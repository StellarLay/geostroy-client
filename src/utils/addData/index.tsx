import React, { useState } from 'react';

import '../modal.scss';

import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ISensorsData } from '../../config/types';

import useHttp from '../../hooks/http.hook';
import config from '../../config/main.json';

const AddDataModal = (props: any) => {
  const [formData, setFormData] = useState<ISensorsData>({
    sensor_id: props.dataAddModal.sensor_id,
    piezometer_id: props.dataAddModal.piezo_id,
    adc_lvl: null,
    lvl_m: null,
    lvl_m_corr: null,
    battery_voltage: null,
    battery_charge: null,
    error_code: 0,
    device_time: '',
    message_arr_time: new Date().toISOString().slice(0, 10),
    working_mode: null,
    sleep_time: '',
  });

  //const [isLogin, setIsLogin] = useState<boolean>(false);
  const { request } = useHttp();

  // Заполняем стейт данными с полей
  const changeHandler = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // POST query add data
  const addHandler = async (e: any) => {
    e.preventDefault();

    try {
      await request(`${config.URL}/api/addSensorData/`, 'POST', {
        ...formData,
      });
      //console.log('Data: ' + data);
      //setIsLogin(true);
      props.isOpen(false);
      props.isSuccess(true);
    } catch (e) {
      //setIsLogin(false);
    }
  };

  return (
    <div className='add-modal'>
      <FontAwesomeIcon
        icon={faXmark}
        className='close-icon'
        onClick={() => props.isOpen(false)}
      />
      <h1>Добавить показание</h1>
      <form className='add-modal-form' onSubmit={(e) => addHandler(e)}>
        <div className='add-modal__row'>
          <div className='add-modal__input-block'>
            <label>Код пъезометра</label>
            <input
              type='text'
              name='piezometer_id'
              disabled
              value={props.dataAddModal.piezo_id}
            />
          </div>
          <div className='add-modal__input-block'>
            <label>Код датчика</label>
            <input
              type='text'
              name='sensor_id'
              disabled
              value={props.dataAddModal.sensor_id}
            />
          </div>
          <div className='add-modal__input-block'>
            <label>Дата прихода</label>
            <input
              type='text'
              name='message_arr_time'
              value={formData.message_arr_time}
              onChange={(e) => changeHandler(e)}
              disabled
            />
          </div>
          <div className='add-modal__input-block'>
            <label>Время по устройству</label>
            <input
              type='date'
              name='device_time'
              onChange={(e) => changeHandler(e)}
            />
          </div>
          <div className='add-modal__input-block'>
            <label>Код ошибки</label>
            <input
              type='text'
              name='error_code'
              onChange={(e) => changeHandler(e)}
            />
          </div>
        </div>
        <div className='add-modal__row'>
          <div className='add-modal__input-block'>
            <label>Уровень по АЦП</label>
            <input
              type='text'
              name='adc_lvl'
              onChange={(e) => changeHandler(e)}
            />
          </div>
          <div className='add-modal__input-block'>
            <label>Уровень (м)</label>
            <input
              type='text'
              name='lvl_m'
              onChange={(e) => changeHandler(e)}
            />
          </div>
          <div className='add-modal__input-block'>
            <label>Уровень + коррекция (м)</label>
            <input
              type='text'
              name='lvl_m_corr'
              onChange={(e) => changeHandler(e)}
            />
          </div>
          <div className='add-modal__input-block'>
            <label>Напряжение на аккумуляторе</label>
            <input
              type='text'
              name='battery_voltage'
              onChange={(e) => changeHandler(e)}
            />
          </div>
          <div className='add-modal__input-block'>
            <label>Заряд аккумулятора</label>
            <input
              type='text'
              name='battery_charge'
              onChange={(e) => changeHandler(e)}
            />
          </div>
        </div>
        <div className='add-modal__row'>
          <div className='add-modal__input-block'>
            <label>Режим работы (1 или 2)</label>
            <input
              type='text'
              name='working_mode'
              onChange={(e) => changeHandler(e)}
            />
          </div>
          <div className='add-modal__input-block'>
            <label>Время сна</label>
            <input
              type='text'
              name='sleep_time'
              onChange={(e) => changeHandler(e)}
            />
          </div>
        </div>
        <div className='add-modal__btn-block'>
          <button type='submit' className='add-modal__save-btn main-btn'>
            Добавить
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddDataModal;
