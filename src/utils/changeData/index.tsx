import React, { useState } from 'react';

import '../modal.scss';

import InputMask from 'react-input-mask';

import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ISensorsData } from '../../config/types';

import useHttp from '../../hooks/http.hook';
import config from '../../config/main.json';

const ChangeDataModal = (props: any) => {
  const { activeData } = props;

  const [formData, setFormData] = useState<ISensorsData>({
    sensor_id: activeData.sensor_id,
    piezometer_id: activeData.piezometer_id,
    adc_lvl: activeData.adc_lvl,
    lvl_m: activeData.lvl_m,
    lvl_m_corr: activeData.lvl_m_corr,
    battery_voltage: activeData.battery_voltage,
    battery_charge: activeData.battery_charge,
    error_code: activeData.error_code,
    device_time: activeData.device_time,
    message_arr_time: activeData.message_arr_time,
    working_mode: activeData.working_mode,
    sleep_time: activeData.sleep_time,
  });

  //const [isLogin, setIsLogin] = useState<boolean>(false);
  const { request } = useHttp();

  // Заполняем стейт данными с полей
  const changeHandler = (e: any) => {
    if (e.target.name === 'working_mode') {
      setFormData({ ...formData, [e.target.name]: parseInt(e.target.value) });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  // POST query add data
  const addHandler = async (e: any) => {
    e.preventDefault();

    //Приводим дату к нужному mysql формату
    formData.device_time = formData.device_time
      .split(' ')
      .map((part) => part.split('-').reverse().join('/'))
      .join(' ');

    try {
      await request(`${config.URL}/api/changeSensorData/`, 'POST', {
        ...formData,
      });

      props.isOpen(false);
      props.isUpdatedData(true);

      // Обновляем таблицу
      props.isUpdatedRow(true);
    } catch (e: any) {
      console.log(e.message);
    }
  };

  return (
    <div className='add-modal'>
      <FontAwesomeIcon
        icon={faXmark}
        className='close-icon'
        onClick={() => props.isOpen(false)}
      />
      <h1>Редактирование показания</h1>
      <form className='add-modal-form' onSubmit={(e) => addHandler(e)}>
        <div className='add-modal__row'>
          <div className='add-modal__input-block'>
            <label>Код пъезометра</label>
            <input
              type='text'
              name='piezometer_id'
              disabled
              value={formData.piezometer_id}
            />
          </div>
          <div className='add-modal__input-block'>
            <label>Код датчика</label>
            <input
              type='text'
              name='sensor_id'
              disabled
              value={formData.sensor_id}
            />
          </div>
          <div className='add-modal__input-block'>
            <label>Время по устройству</label>
            <InputMask
              mask='99/99/9999, 99:99'
              type='text'
              name='device_time'
              value={formData.device_time}
              onChange={(e) => changeHandler(e)}
              required
            />
          </div>
          <div className='add-modal__input-block'>
            <label>Дата прихода</label>
            <InputMask
              mask='99/99/9999, 99:99'
              type='text'
              name='message_arr_time'
              value={formData.message_arr_time}
              onChange={(e) => changeHandler(e)}
            />
          </div>
          <div className='add-modal__input-block'>
            <label>Код ошибки</label>
            <input
              type='text'
              name='error_code'
              value={formData.error_code?.toString()}
              onChange={(e) => changeHandler(e)}
              required
            />
          </div>
        </div>
        <div className='add-modal__row'>
          <div className='add-modal__input-block'>
            <label>Уровень по АЦП</label>
            <input
              type='text'
              name='adc_lvl'
              value={formData.adc_lvl?.toString()}
              onChange={(e) => changeHandler(e)}
              required
            />
          </div>
          <div className='add-modal__input-block'>
            <label>Уровень (м)</label>
            <input
              type='text'
              name='lvl_m'
              value={formData.lvl_m?.toString()}
              onChange={(e) => changeHandler(e)}
              required
            />
          </div>
          <div className='add-modal__input-block'>
            <label>Уровень + коррекция (м)</label>
            <input
              type='text'
              name='lvl_m_corr'
              value={formData.lvl_m_corr?.toString()}
              onChange={(e) => changeHandler(e)}
              required
            />
          </div>
          <div className='add-modal__input-block'>
            <label>Напряжение на аккумуляторе</label>
            <input
              type='text'
              name='battery_voltage'
              value={formData.battery_voltage?.toString()}
              onChange={(e) => changeHandler(e)}
              required
            />
          </div>
          <div className='add-modal__input-block'>
            <label>Заряд аккумулятора</label>
            <input
              type='text'
              name='battery_charge'
              value={formData.battery_charge?.toString()}
              onChange={(e) => changeHandler(e)}
              required
            />
          </div>
        </div>
        <div className='add-modal__row'>
          <div className='add-modal__input-block'>
            <label>Время сна</label>
            <InputMask
              mask='99:99'
              type='text'
              name='sleep_time'
              value={formData.sleep_time}
              onChange={(e) => changeHandler(e)}
              required
            />
          </div>
          <div className='add-modal__input-block'>
            <label>Режим работы</label>
            <div className='add-modal__input-block__radio-item'>
              <input
                id='mode_first'
                type='radio'
                value='1'
                name='working_mode'
                onChange={(e) => changeHandler(e)}
                checked={formData.working_mode === 1}
              />
              <label htmlFor='mode_first'>Удаленное управление</label>
            </div>
            <div className='add-modal__input-block__radio-item'>
              <input
                id='mode_second'
                type='radio'
                name='working_mode'
                value='2'
                onChange={(e) => changeHandler(e)}
                checked={formData.working_mode === 2}
              />
              <label htmlFor='mode_second'>Цикл</label>
            </div>
          </div>
        </div>
        <div className='add-modal__btn-block'>
          <button type='submit' className='add-modal__save-btn main-btn'>
            Сохранить
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChangeDataModal;
