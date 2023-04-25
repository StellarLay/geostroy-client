import { useEffect, useState, useContext } from 'react';

import '../modal.scss';

import { motion, AnimatePresence } from 'framer-motion';
import Select from 'react-select';

import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IChangeUserProps } from '../../config/types';

import useHttp from '../../hooks/http.hook';
import config from '../../config/main.json';

import { ISelectOptionsProps, customStylesSelect } from '../../config/types';

import { AuthContext } from '../../context/authContext';

const AddUserForm = (props: any) => {
  const [options, setOptions] = useState<ISelectOptionsProps[]>([]);
  const [formData, setFormData] = useState<IChangeUserProps>({
    user_id: 0,
    FIO: '',
    email: '',
    access_lvl: 1,
    access_name: '',
    password: '',
  });

  const auth = useContext(AuthContext);
  const { request } = useHttp();

  // Заполняем стейт данными с полей
  const changeHandler = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // POST query add data
  const submitHandler = async (e: any) => {
    e.preventDefault();

    const fetchUpdateUser = async () => {
      try {
        await request(`${config.URL}/api/addUser/`, 'POST', {
          ...formData,
        });

        props.isAddedUser(true);
        props.isOpen(false);
      } catch (e: any) {
        props.message(e.message);
        props.isError(true);
      }
    };

    fetchUpdateUser();
  };

  // Select access_name event
  const selectedAccess = (option: any) => {
    setFormData({ ...formData, access_lvl: option.id });
  };

  // Load select access options
  useEffect(() => {
    const fetchAccess = async () => {
      const url = `${config.URL}/api/getAccess/`;
      const data = await request(url, 'GET');

      setOptions(data);
    };

    fetchAccess();
  }, [request, auth]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -10, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className='add-modal change-user-modal'
      >
        <FontAwesomeIcon
          icon={faXmark}
          className='close-icon'
          onClick={() => props.isOpen(false)}
        />
        <h1>Добавление нового пользователя</h1>
        <form
          className='add-modal-form change-user-form'
          onSubmit={(e) => submitHandler(e)}
        >
          <div className='add-modal__row'>
            <div className='add-modal__input-block'>
              <label>ФИО</label>
              <input
                type='text'
                name='FIO'
                onChange={(e) => changeHandler(e)}
                value={formData.FIO}
                required
              />
            </div>
            <div className='add-modal__input-block'>
              <label>E-mail</label>
              <input
                type='email'
                name='email'
                onChange={(e) => changeHandler(e)}
                value={formData.email}
                required
              />
            </div>
            <div className='add-modal__input-block'>
              <label>Пароль</label>
              <input
                type='text'
                name='password'
                onChange={(e) => changeHandler(e)}
                value={formData.password}
                required
              />
            </div>
            <div className='add-modal__input-block change-user-perm__select-block'>
              <label>Уровень доступа</label>
              {options.length && (
                <Select
                  defaultValue={options[0]}
                  options={options}
                  onChange={(option) => selectedAccess(option)}
                  className='select-block'
                  styles={customStylesSelect}
                  placeholder='Выберите роль...'
                  required
                />
              )}
            </div>
          </div>
          <div className='add-modal__btn-block'>
            <button type='submit' className='add-modal__save-btn main-btn'>
              Сохранить
            </button>
          </div>
        </form>
      </motion.div>
    </AnimatePresence>
  );
};

export default AddUserForm;
