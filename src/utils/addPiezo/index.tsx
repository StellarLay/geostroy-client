import React, { useState } from 'react';

import '../modal.scss';

import InputMask from 'react-input-mask';

import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ICreatePiezometersProps } from '../../config/types';

import useHttp from '../../hooks/http.hook';
import config from '../../config/main.json';

const AddPiezoModal = (props: any) => {
  const [formData, setFormData] = useState<ICreatePiezometersProps>({
    name: '',
    user_id: 0,
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

      props.isOpen(false);
      props.isSuccess(true);
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
      <h1>Добавление скважины</h1>
      <form className='add-modal-form' onSubmit={(e) => addHandler(e)}>
        <div className='add-modal__row'>
          <div className='add-modal__input-block'>
            <label>Наименование</label>
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
            <label>Время по устройству</label>
            <InputMask
              mask='99-99-9999 99:99'
              type='text'
              name='device_time'
              onChange={(e) => changeHandler(e)}
              required
            />
          </div>
          <div className='add-modal__input-block'>
            <label>Код ошибки</label>
            <input
              type='text'
              name='error_code'
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
              onChange={(e) => changeHandler(e)}
              required
            />
          </div>
          <div className='add-modal__input-block'>
            <label>Уровень (м)</label>
            <input
              type='text'
              name='lvl_m'
              onChange={(e) => changeHandler(e)}
              required
            />
          </div>
          <div className='add-modal__input-block'>
            <label>Уровень + коррекция (м)</label>
            <input
              type='text'
              name='lvl_m_corr'
              onChange={(e) => changeHandler(e)}
              required
            />
          </div>
          <div className='add-modal__input-block'>
            <label>Напряжение на аккумуляторе</label>
            <input
              type='text'
              name='battery_voltage'
              onChange={(e) => changeHandler(e)}
              required
            />
          </div>
          <div className='add-modal__input-block'>
            <label>Заряд аккумулятора</label>
            <input
              type='text'
              name='battery_charge'
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
                checked
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
              />
              <label htmlFor='mode_second'>Цикл</label>
            </div>
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

export default AddPiezoModal;
