import { useEffect, useState, useContext } from 'react';

import '../modal.scss';

import { motion, AnimatePresence } from 'framer-motion';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';

import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IChangeUserProps } from '../../config/types';

import useHttp from '../../hooks/http.hook';
import config from '../../config/main.json';

import {
  ISelectOptionsProps,
  customStylesSelect,
  customStylesMultiSelect,
} from '../../config/types';

import { AuthContext } from '../../context/authContext';

const animatedComponents = makeAnimated();

const ChangeUserForm = (props: any) => {
  const { activeUser } = props;

  const [options, setOptions] = useState<ISelectOptionsProps[]>([]);
  const [optionsObj, setOptionsObj] = useState<ISelectOptionsProps[]>([]);
  const [activeAccess, setActiveAccess] = useState<ISelectOptionsProps>();
  const [activeObjects, setActiveObjects] = useState<ISelectOptionsProps[]>([]);

  const [formData, setFormData] = useState<IChangeUserProps>({
    user_id: activeUser.id,
    FIO: activeUser.FIO,
    email: activeUser.email,
    access_lvl: activeUser.access_lvl,
    access_name: activeUser.access_name,
    password: '',
  });

  // const [objectsData, setObjectsData] = useState<IObjectsDataProps>({
  //   user_id: activeUser.id,
  //   items: activeObjects
  // });

  //console.log(activeObjects);

  const auth = useContext(AuthContext);
  const { request } = useHttp();

  //console.log(activeUser);

  // Заполняем стейт данными с полей
  const changeHandler = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // POST query add data
  const submitHandler = async (e: any) => {
    e.preventDefault();

    const fetchUpdateUser = async () => {
      try {
        await request(`${config.URL}/api/updateUser/`, 'POST', {
          ...formData,
        });

        props.isOpen(false);
        props.isUpdatedUser(true);
      } catch (e: any) {
        console.log(e.message);
      }
    };

    const fetchUpdateObjectsOfUser = async () => {
      try {
        await request(
          `${config.URL}/api/updateUsersOfObjects/${activeUser.id}`,
          'POST',
          {
            activeObjects,
          }
        );
      } catch (e: any) {
        console.log(e.message);
      }
    };

    fetchUpdateUser();
    fetchUpdateObjectsOfUser();
  };

  // Select access_name event
  const selectedAccess = (option: any) => {
    setFormData({ ...formData, access_lvl: option.id });
  };

  // Select objects event
  const selectedObjects = (option: any) => {
    setActiveObjects(option);
  };

  // Load select access options
  useEffect(() => {
    const fetchAccess = async () => {
      const url = `${config.URL}/api/getAccess/`;
      const data = await request(url, 'GET');

      setOptions(data);

      // Определяем текущий доступ у юзера
      const filter = data.filter(
        (opt: any) => opt.value === activeUser.access_name
      );

      setActiveAccess(filter);
    };

    fetchAccess();
  }, [request, activeUser, auth, optionsObj]);

  // Load select objects options
  useEffect(() => {
    const fetchObjects = async () => {
      const authorization = {
        Authorization: `Bearer ${auth.accessToken}`,
      };
      const url = `${config.URL}/api/getObjects`;
      const data = await request(
        url,
        'POST',
        { user_id: auth.user_id, access_name: auth.access_name },
        authorization
      );

      // Преобразуем data в нужный нам формат для тега select
      let opt: { id: any; value: any; label: any }[] = [];
      data.results.forEach((element: any) => {
        opt.push({ id: element.id, value: element.name, label: element.name });
      });

      setOptionsObj(opt);
    };

    fetchObjects();
  }, [request, auth]);

  // Load select active objects options
  useEffect(() => {
    const fetchObjectsOfUser = async () => {
      const url = `${config.URL}/api/getObjectsOfUser/${activeUser.id}`;
      const data = await request(url, 'GET');

      // Функция для фильтрации активных объектов (multi)
      const filterSelectedObjects = (filters: any) => {
        const filteredObjects: any[] = [];
        filters.forEach((filterValue: any) => {
          filteredObjects.push(
            ...optionsObj.filter((opt) => opt.value.includes(filterValue.name))
          );
        });

        setActiveObjects(filteredObjects);
      };

      filterSelectedObjects(data);
    };

    fetchObjectsOfUser();
  }, [request, auth, activeUser, optionsObj]);

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
        <h1>Редактирование пользователя</h1>
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
            <div className='add-modal__input-block change-user-perm__select-block'>
              <label>Уровень доступа</label>
              {options.length && (
                <Select
                  defaultValue={activeAccess}
                  options={options}
                  onChange={(option) => selectedAccess(option)}
                  className='select-block'
                  styles={customStylesSelect}
                />
              )}
            </div>
          </div>
          <div className='add-modal__row'>
            <div className='add-modal__input-block change-user-obj__select-block'>
              <label>Ваши объекты</label>
              {optionsObj.length && (
                <Select
                  components={animatedComponents}
                  value={activeObjects}
                  options={optionsObj}
                  onChange={(option) => selectedObjects(option)}
                  className='select-block select-user-objects'
                  styles={customStylesMultiSelect}
                  isMulti
                  maxMenuHeight={200}
                  placeholder='Выберите объект...'
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

export default ChangeUserForm;
