import React, { useState, useEffect, useContext } from 'react';
import SideBar from '../../components/layouts/sidebar';

import './settings.scss';
import '../media.scss';

import { motion, AnimatePresence } from 'framer-motion';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';

// Include custom hooks
import useHttp from '../../hooks/http.hook';
import useCreateToken from '../../hooks/createToken.hook';

// Config
import config from '../../config/main.json';
import { IPermissionsProps } from '../../config/types';

import { AuthContext } from '../../context/authContext';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSearch,
  faSquarePen,
  faTrash,
  faBars,
} from '@fortawesome/free-solid-svg-icons';

import {
  ISelectOptionsProps,
  IOpsProps,
  customStylSelectSettingsUser,
  customStylesMultiSelect,
} from '../../config/types';
import MessageBox from '../../utils/modals/messageBox';

const animatedComponents = makeAnimated();

const SettingsPage = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const [users, setUsers] = useState<IPermissionsProps[]>([]);
  const [selectUser, setSelectUser] = useState<IPermissionsProps>();
  const [selectPiezo, setSelectPiezo] = useState<IPermissionsProps>();
  const [filteredUsers, setFilteredUsers] = useState<IPermissionsProps[]>([]);
  const [search, setSearch] = useState('');

  const [showAddBlock, setShowAddBlock] = useState(false);
  const [isActiveBtn, setIsActiveBtn] = useState(false);
  const [isAddedPermission, setIsAddedPermission] = useState(false);
  const [isError, setIsError] = useState(false);
  const [message, setMessage] = useState('');

  const [opsData, setOpsData] = useState<IOpsProps[]>([]);
  const [options, setOptions] = useState<ISelectOptionsProps[]>([]);
  const [optionsUser, setOptionsUser] = useState<ISelectOptionsProps[]>([]);
  const [optionsPiezometer, setOptionsPiezometer] = useState<
    ISelectOptionsProps[]
  >([]);

  // Заголовки таблицы
  const tableHeaders = [
    {
      id: 1,
      title: 'E-mail',
    },
    {
      id: 2,
      title: 'Наименование объекта',
    },
    {
      id: 3,
      title: 'Наименование скважины',
    },
  ];

  const auth = useContext(AuthContext);

  const { request } = useHttp();
  const { createToken } = useCreateToken();

  // Get all users
  useEffect(() => {
    const fetchData = async () => {
      try {
        const authorization = {
          Authorization: `Bearer ${auth.accessToken}`,
        };
        const url = `${config.URL}/api/getPermissions`;
        const data = await request(url, 'GET', null, authorization);

        setUsers(data);
        setFilteredUsers(data);

        // Если токен просрочен, создаем новый токен
        if (data.status && data.status === 403) {
          createToken();
        }
      } catch (err: any) {
        console.log(err);
      }
    };

    fetchData();
  }, [request, createToken, auth.accessToken, isAddedPermission]);

  // Событие поиска
  const searchHandler = (e: any) => {
    setSearch(e.target.value);
    if (e.target.value !== '') {
      const filter = users.filter((user) => user.email === e.target.value);
      setFilteredUsers(filter);
    } else {
      setFilteredUsers(users);
    }
  };

  // Select user event
  const selectedUser = (option: any) => {
    setSelectUser(option);
  };

  // Selectpiezometer event
  const selectedPiezometer = (option: any) => {
    setSelectPiezo(option);
  };

  const addPermissionHandler = (e: any) => {
    e.preventDefault();

    const fetchUsers = async () => {
      try {
        const authorization = {
          Authorization: `Bearer ${auth.accessToken}`,
        };
        const url = `${config.URL}/api/getUsers`;
        const data = await request(url, 'GET', null, authorization);

        // Отбираем только гостей (3-й уровень доступа)
        let filter = data.results.filter((user: any) => user.access_lvl === 3);

        // Преобразуем data в нужный нам формат для тега select
        let opt: { id: any; value: any; label: any }[] = [];
        filter.forEach((element: any) => {
          opt.push({
            id: element.id,
            value: element.email,
            label: element.email,
          });
        });

        setOptionsUser(opt);
        // Если токен просрочен, создаем новый токен
        if (data.status && data.status === 403) {
          createToken();
        }
      } catch (err: any) {
        console.log(err);
      }
    };

    const fetchPiezometers = async () => {
      try {
        const url = `${config.URL}/api/getPiezometersForClients`;
        const data = await request(url, 'POST', {
          access_name: auth.access_name,
          user_id: auth.user_id,
          type: 'settings',
        });

        setOpsData(data);

        // Преобразуем data в нужный нам формат для тега select
        let opt: { id: any; value: any; label: any }[] = [];
        data.forEach((element: any) => {
          opt.push({
            id: element.piezometer_id,
            value: element.name,
            label: element.name,
          });
        });

        setOptionsPiezometer(opt);
      } catch (e) {
        console.log(e);
      }
    };

    fetchUsers();
    fetchPiezometers();

    // Показываем/скрываем блок "Добавить доступ"
    setShowAddBlock(showAddBlock ? false : true);
  };

  useEffect(() => {
    if (selectUser !== undefined && selectPiezo !== undefined) {
      setIsActiveBtn(true);
    } else {
      setIsActiveBtn(false);
    }
  }, [selectUser, selectPiezo]);

  const addPermissionFetch = () => {
    if (selectUser !== undefined && selectPiezo !== undefined) {
      // Получаем объект, к которому скважина привязана
      const filter = opsData.filter(
        (item) => item.piezometer_id === selectPiezo.id
      );

      const fetchAddPerm = async () => {
        try {
          await request(`${config.URL}/api/addPermission/`, 'POST', {
            access_name: auth.access_name,
            object_id: filter[0].object_id,
            piezo_id: selectPiezo.id,
            parent_user_id: auth.user_id,
            user_id: selectUser.id,
          });

          setIsAddedPermission(true);
        } catch (e: any) {
          setMessage(e.message);
          setIsError(true);
        }
      };
      console.log(selectPiezo);
      console.log(selectUser);

      fetchAddPerm();
    }
  };

  // Закрываем модалку через 3 секунды
  useEffect(() => {
    // if (isRemove) {
    //   setMessage(`Пользователь <${activeUser!.FIO}> успешно удалён.`);
    // }

    // if (isUpdated) {
    //   setMessage(`Данные пользователя <${activeUser!.FIO}> успешно изменены.`);
    // }

    if (isAddedPermission) {
      setMessage(
        `Разрешение успешно добавлено пользователю: ${selectUser?.email}.`
      );
    }

    const timer = setTimeout(() => {
      //setIsRemove(false);
      //setIsUpdated(false);
      setIsAddedPermission(false);
      setIsError(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, [isError, isAddedPermission, selectUser?.email]);

  return (
    <div className='app-main'>
      <SideBar isActive={showSidebar} />
      <AnimatePresence>
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -10, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className='container'
        >
          <div className='container__head-block'>
            <div className='container__head-block__title'>
              <h2>Настройки</h2>
              <FontAwesomeIcon
                icon={faBars}
                className='menu-burger-icon'
                onClick={() => setShowSidebar(showSidebar ? false : true)}
              />
            </div>
            <div className='container__head-block__search'>
              <FontAwesomeIcon icon={faSearch} className='search-icon' />
              <input
                type='search'
                name='search'
                value={search}
                className='search-input'
                placeholder='Поиск по email...'
                onChange={(e) => searchHandler(e)}
              />
            </div>
            <button
              className='add-user__btn main-btn'
              onClick={(e) => addPermissionHandler(e)}
            >
              Добавить доступ
            </button>
          </div>

          <div
            className={`permission-block add-permission ${
              showAddBlock ? 'show-block' : ''
            }`}
          >
            <span className='permission-block__title'>
              Добавить доступ к устройству
            </span>
            <div className='items'>
              <div className='items__input-block'>
                {optionsUser.length && (
                  <Select
                    components={animatedComponents}
                    options={optionsUser}
                    onChange={(option) => selectedUser(option)}
                    className='select-block select-user-objects'
                    styles={customStylSelectSettingsUser}
                    placeholder='Выберите пользователя...'
                  />
                )}
              </div>
              <div className='items__input-block'>
                {optionsPiezometer.length && (
                  <Select
                    components={animatedComponents}
                    options={optionsPiezometer}
                    onChange={(option) => selectedPiezometer(option)}
                    className='select-block select-user-objects'
                    styles={customStylSelectSettingsUser}
                    //isMulti
                    //maxMenuHeight={200}
                    placeholder='Выберите скважину...'
                  />
                )}
              </div>
              <button
                type='submit'
                className={`add-permission__save-btn main-btn ${
                  !isActiveBtn ? 'disabled' : ''
                }`}
                onClick={() => addPermissionFetch()}
              >
                Добавить
              </button>
            </div>
          </div>

          <div className='container__table data-table'>
            <div className='data-table__row data-table__row-caption'>
              {tableHeaders.map((header) => (
                <div key={header.id} className='data-table__th-item'>
                  <span className='data-table__th-title'>{header.title}</span>
                </div>
              ))}
              {/* <FontAwesomeIcon
                icon={faSquarePen}
                className='edit-icon dots-table-hidden'
                title='Изменить'
              />
              <FontAwesomeIcon
                icon={faTrash}
                className='remove-icon dots-table-hidden'
                title='Удалить'
              /> */}
            </div>
            {Object.keys(filteredUsers).length !== 0 ? (
              filteredUsers.map((user) => (
                <motion.div
                  key={user.id}
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -10, opacity: 0 }}
                  transition={{ duration: 0.1 }}
                  className='data-table__row'
                >
                  <div className='data-table__item'>
                    <span className='data-table__text'>{user.email}</span>
                  </div>
                  <div className='data-table__item'>
                    <span className='data-table__text'>{user.object_name}</span>
                  </div>
                  <div className='data-table__item'>
                    <span className='data-table__text'>{user.piezo_name}</span>
                  </div>
                  {/* <FontAwesomeIcon
                    icon={faSquarePen}
                    className='edit-icon'
                    title='Изменить'
                    onClick={() => changeUserHandler(user)}
                  />
                  <FontAwesomeIcon
                    icon={faTrash}
                    className='remove-icon'
                    title='Удалить'
                    onClick={() => removeUser(user)}
                  /> */}
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -10, opacity: 0 }}
                transition={{ duration: 0.1 }}
                className='data-table__row'
              >
                Пользователь не найден.
              </motion.div>
            )}
          </div>
          {(isAddedPermission || isError) && (
            <MessageBox message={message} color={isError && 'error'} />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default SettingsPage;
