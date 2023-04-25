import { useState, useEffect, useContext } from 'react';
import SideBar from '../../components/layouts/sidebar';
import './users.scss';

import { motion, AnimatePresence } from 'framer-motion';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSearch,
  faEllipsisVertical,
} from '@fortawesome/free-solid-svg-icons';

// Include components
import MessageBox from '../../utils/modals/messageBox';
import EditUser from '../../utils/contextMenu/EditUser';

// Include custom hooks
import useHttp from '../../hooks/http.hook';
import useCreateToken from '../../hooks/createToken.hook';

// Config
import config from '../../config/main.json';
import { IUsersProps } from '../../config/types';

import { AuthContext } from '../../context/authContext';
import ChangeUserForm from '../../utils/changeUser';
import AddUserForm from '../../utils/addUser';

const UsersPage = () => {
  const auth = useContext(AuthContext);

  const { request } = useHttp();
  const { createToken } = useCreateToken();

  const [users, setUsers] = useState<IUsersProps[]>([]);
  const [activeUser, setActiveUser] = useState<IUsersProps>();
  const [filteredUsers, setFilteredUsers] = useState<IUsersProps[]>([]);
  const [search, setSearch] = useState('');
  const [isOpenForm, setIsOpenForm] = useState(false);
  const [isOpenAddUserForm, setIsOpenAddUserForm] = useState(false);

  // States for context menu
  const [posYObject, setPosYObject] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [isRemove, setIsRemove] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [isError, setIsError] = useState(false);
  const [message, setMessage] = useState('');

  // Заголовки таблицы
  const tableHeaders = [
    {
      id: 1,
      title: 'ФИО',
    },
    {
      id: 2,
      title: 'E-mail',
    },
    {
      id: 3,
      title: 'Уровень доступа',
    },
  ];

  // Get all users
  useEffect(() => {
    const fetchData = async () => {
      try {
        const authorization = {
          Authorization: `Bearer ${auth.accessToken}`,
        };
        const url = `${config.URL}/api/getUsers`;
        const data = await request(url, 'GET', null, authorization);

        // Если токен просрочен, создаем новый токен
        if (data.status && data.status === 403) {
          createToken();
        }

        setUsers(data.results);
        setFilteredUsers(data.results);
      } catch (err: any) {
        console.log(err);
      }
    };

    fetchData();
  }, [request, createToken, auth.accessToken, isRemove, isUpdated, isAdded]);

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

  const selectActiveUser = (e: any, id: number) => {
    const filter = users.filter((user) => user.id === id);
    setActiveUser(filter[0]);

    // Получаем высоту выбранного объекта
    let getHeight = e.clientY;
    setPosYObject(getHeight);
  };

  // Закрываем модалку через 3 секунды
  useEffect(() => {
    if (isRemove) {
      setMessage(`Пользователь <${activeUser!.FIO}> успешно удалён.`);
    }

    if (isUpdated) {
      setMessage(`Данные пользователя <${activeUser!.FIO}> успешно изменены.`);
    }

    if (isAdded) {
      setMessage(`Пользователь успешно добавлен.`);
    }

    const timer = setTimeout(() => {
      setIsRemove(false);
      setIsUpdated(false);
      setIsAdded(false);
      setIsError(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, [isRemove, isUpdated, isAdded, isError, activeUser]);

  // Click add user btn
  const addUserHandler = () => {
    setIsOpenAddUserForm(true);
  };

  return (
    <div className='app-main'>
      <SideBar />
      <AnimatePresence>
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -10, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className='users-container'
        >
          <div className='users-container__head-block'>
            <h2>Пользователи</h2>
            <div className='users-container__head-block__search'>
              <FontAwesomeIcon icon={faSearch} className='search-icon' />
              <input
                type='search'
                name='search'
                value={search}
                className='search-input'
                placeholder='Поиск по почте...'
                onChange={(e) => searchHandler(e)}
              />
            </div>
            <button
              className='add-user__btn main-btn'
              onClick={() => addUserHandler()}
            >
              Добавить
            </button>
          </div>
          <div className='users-container__table data-table'>
            <div className='data-table__row data-table__row-caption'>
              {tableHeaders.map((header) => (
                <div key={header.id} className='data-table__th-item'>
                  <span className='data-table__th-title'>{header.title}</span>
                </div>
              ))}
              <FontAwesomeIcon
                icon={faEllipsisVertical}
                className='dots-vertical-icon dots-table-hidden'
                title='Настроить'
              />
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
                  onClick={(e) => selectActiveUser(e, user.id)}
                >
                  <div className='data-table__item'>
                    <span className='data-table__text'>{user.FIO}</span>
                  </div>
                  <div className='data-table__item'>
                    <span className='data-table__text'>{user.email}</span>
                  </div>
                  <div className='data-table__item'>
                    <span className='data-table__text'>{user.access_name}</span>
                  </div>
                  <FontAwesomeIcon
                    icon={faEllipsisVertical}
                    className='dots-vertical-icon'
                    title='Изменить'
                    onClick={() => setIsEdit(true)}
                  />
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
          {isEdit && (
            <EditUser
              height={posYObject}
              isEdit={setIsEdit}
              isRemove={setIsRemove}
              isOpen={setIsOpenForm}
              activeUser={activeUser}
            />
          )}
          {(isRemove || isUpdated || isAdded || isError) && (
            <MessageBox message={message} color={isError && 'error'} />
          )}
          {isOpenForm && (
            <ChangeUserForm
              isOpen={setIsOpenForm}
              activeUser={activeUser}
              isUpdatedUser={setIsUpdated}
            />
          )}
          {isOpenAddUserForm && (
            <AddUserForm
              isOpen={setIsOpenAddUserForm}
              isError={setIsError}
              isAddedUser={setIsAdded}
              message={setMessage}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default UsersPage;
